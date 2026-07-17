import type { ReactNode } from "react";
import type { AppLocale } from "@/lib/i18n/routing";
import type { PublicBootstrap } from "@/lib/api/types";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function SiteShell({
  bootstrap,
  locale,
  children,
}: {
  bootstrap: PublicBootstrap;
  locale: AppLocale;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader bootstrap={bootstrap} locale={locale} />
      {children}
      <SiteFooter bootstrap={bootstrap} locale={locale} />
    </div>
  );
}
