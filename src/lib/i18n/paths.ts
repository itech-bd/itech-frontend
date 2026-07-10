import type { AppLocale } from "./routing";

export function localizeHref(href: string, locale: AppLocale) {
  if (!href.startsWith("/")) return href;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;

  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export function stripLocalePrefix(href: string) {
  const match = href.match(/^\/(en|bn)(\/.*)?$/);
  if (!match) return href;
  return match[2] ?? "/";
}
