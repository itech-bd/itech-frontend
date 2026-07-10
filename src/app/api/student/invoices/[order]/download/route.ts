import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { authCookieName } from "@/lib/auth/cookies";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ order: string }> },
) {
  const { order } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${authCookieName()}=([^;]+)`));
  const token = match?.[1];

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
  }

  const upstream = await fetch(`${env.LARAVEL_API_URL}/api/v1/student/invoices/${order}/download`, {
    headers: {
      Accept: "application/pdf",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const body = contentType.includes("application/json") ? await upstream.json().catch(() => null) : await upstream.text().catch(() => "");
    return NextResponse.json(
      typeof body === "object" && body ? body : { success: false, message: "Failed to download invoice." },
      { status: upstream.status || 500 },
    );
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") ?? "application/pdf");
  const disposition = upstream.headers.get("content-disposition");
  if (disposition) headers.set("Content-Disposition", disposition);
  headers.set("Cache-Control", "no-store, private, max-age=0");
  return new NextResponse(upstream.body, { status: 200, headers });
}
