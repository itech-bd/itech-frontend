import type { ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export function PageHero({
  locale,
  kicker,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
  className,
}: {
  locale: AppLocale;
  kicker?: string;
  title: string;
  subtitle?: ReactNode;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("section-band bg-[color:var(--surface-primary)] py-14 sm:py-16 lg:py-20", className)}>
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
        <div className="max-w-3xl">
          {kicker ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--brand-primary)]/15 bg-[color:var(--brand-primary-light)] px-3 py-2 text-xs font-bold uppercase text-[color:var(--brand-primary-dark)]">
              <Sparkles aria-hidden className="h-4 w-4" />
              {kicker}
            </div>
          ) : null}
          <h1 className="mt-5 text-4xl font-black leading-[1.08] text-[color:var(--text-heading)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle ? <div className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--text-body)] sm:text-lg">{subtitle}</div> : null}
          {(primaryHref && primaryLabel) || (secondaryHref && secondaryLabel) ? (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {primaryHref && primaryLabel ? (
                <LocaleLink
                  locale={locale}
                  href={primaryHref}
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-primary-dark)]"
                >
                  {primaryLabel}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </LocaleLink>
              ) : null}
              {secondaryHref && secondaryLabel ? (
                <LocaleLink
                  locale={locale}
                  href={secondaryHref}
                  className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
                >
                  {secondaryLabel}
                </LocaleLink>
              ) : null}
            </div>
          ) : null}
        </div>
        {children ? <div className="min-w-0">{children}</div> : null}
      </div>
    </section>
  );
}
