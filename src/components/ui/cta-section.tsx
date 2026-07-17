import { ArrowRight, MessageCircle } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";

export function CTASection({
  locale,
  title,
  description,
  primaryHref = "/courses",
  primaryLabel = "Browse courses",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to us",
}: {
  locale: AppLocale;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-[color:var(--text-heading)] text-white shadow-[var(--shadow-soft)]">
          <div className="brand-grid grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white">
                <MessageCircle aria-hidden className="h-4 w-4" />
                Admission support
              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <LocaleLink
                locale={locale}
                href={primaryHref}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
              >
                {primaryLabel}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </LocaleLink>
              <LocaleLink
                locale={locale}
                href={secondaryHref}
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-[color:var(--text-heading)]"
              >
                {secondaryLabel}
              </LocaleLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
