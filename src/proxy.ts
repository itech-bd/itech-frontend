import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/routing";
import { env } from "@/lib/env";

const PUBLIC_FILE = /\.(.*)$/;

function hasLocalePrefix(pathname: string) {
  const [, maybeLocale] = pathname.split("/");
  return isLocale(maybeLocale);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (!hasLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const isProtected = pathname.includes("/student") || pathname.includes("/checkout") || pathname.endsWith("/profile");
  if (isProtected && !request.cookies.get(env.AUTH_COOKIE_NAME)?.value) {
    const locale = pathname.split("/")[1] === "bn" ? "bn" : "en";
    const login = request.nextUrl.clone();
    login.pathname = `/${locale}/login`;
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
