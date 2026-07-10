import { z } from "zod";

const envSchema = z.object({
  LARAVEL_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  AUTH_COOKIE_NAME: z.string().min(1).default("itech_student_token"),
  AUTH_COOKIE_MAX_AGE: z.coerce.number().int().positive().default(60 * 60 * 24 * 30),
  DEFAULT_LOCALE: z.enum(["en", "bn"]).default("en"),
  SUPPORTED_LOCALES: z.string().default("en,bn"),
});

export const env = envSchema.parse({
  LARAVEL_API_URL: process.env.LARAVEL_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE: process.env.AUTH_COOKIE_MAX_AGE,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
  SUPPORTED_LOCALES: process.env.SUPPORTED_LOCALES,
});

export const supportedLocales = env.SUPPORTED_LOCALES.split(",")
  .map((locale) => locale.trim())
  .filter(Boolean) as Array<"en" | "bn">;

export type Locale = (typeof supportedLocales)[number];
