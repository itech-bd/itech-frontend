"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
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
  const segment = useSelectedLayoutSegment();
  const isStudentRoute = segment === "student";

  return (
    <div className="min-h-screen overflow-x-hidden">
      {isStudentRoute ? null : <SiteHeader bootstrap={bootstrap} locale={locale} />}
      {children}
      {isStudentRoute ? null : <SiteFooter bootstrap={bootstrap} locale={locale} />}
    </div>
  );
}
