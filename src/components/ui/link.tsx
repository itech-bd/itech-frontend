import Link from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/lib/i18n/paths";
import type { AppLocale } from "@/lib/i18n/routing";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  locale: AppLocale;
};

export function LocaleLink({ href, locale, ...props }: Props) {
  return <Link {...props} href={localizeHref(href, locale)} />;
}
