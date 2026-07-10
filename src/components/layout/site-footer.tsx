import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { PublicBootstrap } from "@/lib/api/types";

export function SiteFooter({
  bootstrap,
  locale,
}: {
  bootstrap: PublicBootstrap;
  locale: AppLocale;
}) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1.35fr_.95fr] lg:items-start">
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--brand-primary)] text-white shadow-brand">
                i
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-950">iTechBD Ltd</div>
                <div className="text-sm text-slate-500">Public website and student panel</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-base leading-9 text-slate-700">
              Practical training, mentor support, and career-focused courses for learners in Bangladesh.
            </p>
          </div>

          <div>
            <h3 className="text-[2rem] font-black uppercase tracking-tight text-slate-950">Useful Links</h3>
            <div className="mt-5 h-2 w-full max-w-[33rem] bg-[color:var(--brand-orange)]" />
            <div className="mt-7 grid gap-x-8 gap-y-4 text-lg text-slate-800 sm:grid-cols-2 lg:grid-cols-3">
              {bootstrap.footer_navigation.map((link) => (
                <LocaleLink key={link.href + link.label} locale={locale} href={link.href} className="transition hover:text-[color:var(--brand-orange)]">
                  {link.label}
                </LocaleLink>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[2rem] font-black uppercase tracking-tight text-slate-950">Contact</h3>
            <div className="mt-6 grid gap-5 text-lg leading-8 text-slate-800">
              <p>Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} iTechBD Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <LocaleLink href="/privacy" locale={locale} className="transition hover:text-[color:var(--brand-orange)]">
              Privacy
            </LocaleLink>
            <LocaleLink href="/terms" locale={locale} className="transition hover:text-[color:var(--brand-orange)]">
              Terms
            </LocaleLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
