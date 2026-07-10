export const locales = ["en", "bn"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";

export function isLocale(value: string | null | undefined): value is AppLocale {
  return value === "en" || value === "bn";
}

export function getLocaleFromPathname(pathname: string) {
  const [, maybeLocale] = pathname.split("/");
  return isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

export function withLocale(pathname: string, locale: AppLocale) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);
  if (segments[0] === "en" || segments[0] === "bn") {
    segments[0] = locale;
    return `/${segments.join("/")}`;
  }
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
