import "server-only";

import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { ApiError } from "@/lib/api/errors";
import type { LaravelEnvelope } from "./response";

export type RequestOptions = RequestInit & {
  locale?: "en" | "bn";
  auth?: boolean;
  noStore?: boolean;
};

function mapErrorCode(status: number, code?: string): ApiError["code"] {
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "SERVER_ERROR";
  if (code === "VALIDATION_ERROR") return "VALIDATION_ERROR";
  return "UNKNOWN_ERROR";
}

async function parseJson<T>(response: Response): Promise<LaravelEnvelope<T>> {
  const text = await response.text();
  if (!text) {
    throw new ApiError("Empty API response", response.status, mapErrorCode(response.status));
  }

  try {
    return JSON.parse(text) as LaravelEnvelope<T>;
  } catch {
    throw new ApiError("Invalid API response", response.status, mapErrorCode(response.status));
  }
}

function buildHeaders(headers: HeadersInit | undefined, locale: "en" | "bn", authToken?: string | null) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set("Accept", "application/json");
  nextHeaders.set("X-Locale", locale);
  if (authToken) {
    nextHeaders.set("Authorization", `Bearer ${authToken}`);
  }
  return nextHeaders;
}

export async function apiFetch<T>(
  path: string,
  init: RequestOptions = {},
): Promise<T> {
  const locale = init.locale ?? "en";
  const token = init.auth ? (await cookies()).get(env.AUTH_COOKIE_NAME)?.value ?? null : null;
  const response = await fetch(`${env.LARAVEL_API_URL}/api/v1${path}`, {
    ...init,
    headers: buildHeaders(init.headers, locale, token),
    cache: init.noStore === false ? init.cache : init.cache ?? "no-store",
  });

  const body = await parseJson<T>(response);
  if (!response.ok || body.success === false) {
    throw new ApiError(
      body.message ?? "API request failed",
      response.status,
      mapErrorCode(response.status, body.code),
      body.errors,
    );
  }

  return body.data;
}

export async function apiFetchEnvelope<T>(
  path: string,
  init: RequestOptions = {},
): Promise<LaravelEnvelope<T>> {
  const locale = init.locale ?? "en";
  const token = init.auth ? (await cookies()).get(env.AUTH_COOKIE_NAME)?.value ?? null : null;
  const response = await fetch(`${env.LARAVEL_API_URL}/api/v1${path}`, {
    ...init,
    headers: buildHeaders(init.headers, locale, token),
    cache: init.noStore === false ? init.cache : init.cache ?? "no-store",
  });
  const body = await parseJson<T>(response);
  if (!response.ok || body.success === false) {
    throw new ApiError(
      body.message ?? "API request failed",
      response.status,
      mapErrorCode(response.status, body.code),
      body.errors,
    );
  }
  return body;
}
