import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import { sanitizeCmsHtml } from "@/lib/sanitize";

export function HeroSection({
  locale,
  title,
  highlight,
  content,
  ctaHref = "/courses",
  ctaLabel = "Explore Courses",
}: {
  locale: AppLocale;
  title: string;
  highlight?: string;
  content: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-primary)]/8 via-white to-[color:var(--brand-orange)]/10" />
      <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[color:var(--brand-orange)]/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[color:var(--brand-primary)]/15 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-primary)]/10 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand-primary)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[color:var(--brand-red)]" />
            Admissions going on
          </div>
          <h1 className="mt-6 text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {title}
            {highlight ? <span className="block text-[color:var(--brand-orange)]">{highlight}</span> : null}
          </h1>
          <div className="site-prose mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(content) }} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LocaleLink locale={locale} href={ctaHref} className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand-orange)] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[color:var(--brand-orange)]/25 transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-red)]">
              {ctaLabel} <span className="ml-2">→</span>
            </LocaleLink>
            <LocaleLink locale={locale} href="/contact" className="inline-flex items-center justify-center rounded-full border border-[color:var(--brand-primary)]/15 bg-white px-7 py-3.5 text-sm font-extrabold text-[color:var(--brand-primary)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-primary)] hover:text-white">
              Free Consultation
            </LocaleLink>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-[color:var(--brand-primary)]/10">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-[color:var(--brand-primary)] to-[color:var(--brand-orange)] p-8 text-white">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">Start Learning</div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Join an upcoming batch and build professional skills.</h2>
            <p className="mt-3 text-white/80">Course, batch, mentor, and admission details stay updated as new opportunities open.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
