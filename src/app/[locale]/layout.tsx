import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { getPublicBootstrap } from "@/lib/api/site";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bn" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: locale === "bn" ? "আইটেকবিডি লিমিটেড" : "iTechBD Ltd",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const bootstrap = await getPublicBootstrap(locale);

  return <SiteShell bootstrap={bootstrap} locale={locale}>{children}</SiteShell>;
}
