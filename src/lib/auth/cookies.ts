import { env } from "@/lib/env";

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: env.AUTH_COOKIE_MAX_AGE,
  };
}

export function authCookieName() {
  return env.AUTH_COOKIE_NAME;
}
