import type { ReactNode } from "react";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { StudentDashboard } from "@/lib/api/types";
import { logoutAction } from "@/actions/auth";

export function StudentShell({
  locale,
  dashboard,
  children,
}: {
  locale: AppLocale;
  dashboard: StudentDashboard;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(46,49,146,.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(244,123,32,.12),transparent_32%),#f8fafc]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:px-8">
        <aside className="hidden w-[19rem] shrink-0 rounded-[2rem] bg-[#17194f] p-4 text-white shadow-2xl lg:block">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Student Panel</div>
            <div className="mt-2 text-lg font-bold">{dashboard.user.name}</div>
            <div className="text-sm text-white/70">{dashboard.user.email}</div>
          </div>
          <nav className="mt-6 space-y-1.5">
            {dashboard.menu.map((item) => (
              <LocaleLink
                key={item.key}
                href={item.href}
                locale={locale}
                className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white/80 group-hover:bg-white/15">
                  •
                </span>
                <span>{item.label}</span>
              </LocaleLink>
            ))}
          </nav>
          <div className="mt-6 border-t border-white/10 pt-4">
            <LocaleLink href="/" locale={locale} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15">
              Visit Website
            </LocaleLink>
            <form action={logoutAction.bind(null, locale)} className="mt-3">
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                Logout
              </button>
            </form>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
