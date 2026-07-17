"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AppLocale } from "@/lib/i18n/routing";
import { stripLocalePrefix } from "@/lib/i18n/paths";

export function LocaleSwitcher({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function change(nextLocale: AppLocale) {
    const currentPath = stripLocalePrefix(pathname);
    const nextPath = `/${nextLocale}${currentPath === "/" ? "" : currentPath}`;
    const query = searchParams.toString();
    router.push(`${nextPath}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => change("en")}
        className={`focus-ring px-3 py-1.5 text-xs font-bold ${locale === "en" ? "bg-[color:var(--brand-primary)] text-white" : "text-[color:var(--text-body)]"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => change("bn")}
        className={`focus-ring px-3 py-1.5 text-xs font-bold ${locale === "bn" ? "bg-[color:var(--brand-primary)] text-white" : "text-[color:var(--text-body)]"}`}
      >
        BN
      </button>
    </div>
  );
}
