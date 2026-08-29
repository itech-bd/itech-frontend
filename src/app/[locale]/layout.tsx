import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { getPublicBootstrap } from "@/lib/api/site";
import { getOptionalCurrentUser } from "@/lib/auth/current-user";
import { shouldUseBackendPanel } from "@/lib/auth/login-redirect";
import { env } from "@/lib/env";
import { isLocale } from "@/lib/i18n/routing";

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
    title: "iTechBD Ltd",
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
  const [bootstrap, currentUser] = await Promise.all([
    getPublicBootstrap(locale),
    getOptionalCurrentUser(locale),
  ]);
  const accountHref = currentUser
    ? shouldUseBackendPanel(currentUser.roles)
      ? `${env.LARAVEL_API_URL}/dashboard`
      : "/student"
    : null;

  return (
    <SiteShell bootstrap={bootstrap} locale={locale} currentUser={currentUser} accountHref={accountHref}>
      {children}
    </SiteShell>
  );
}
