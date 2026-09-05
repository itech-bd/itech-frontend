import type { ReactNode } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  Compass,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { PublicBootstrap, StudentDashboard } from "@/lib/api/types";
import { logoutAction } from "@/actions/auth";

const navIcons = {
  dashboard: Home,
  profile: UserRound,
  courses: BookOpenCheck,
  explore_courses: Compass,
  batches: CalendarDays,
  mentors: UsersRound,
  invoices: FileText,
};

export function StudentShell({
  locale,
  dashboard,
  bootstrap,
  children,
}: {
  locale: AppLocale;
  dashboard: StudentDashboard;
  bootstrap: PublicBootstrap;
  children: ReactNode;
}) {
  const initials = dashboard.user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_4%,rgba(15,74,163,0.12),transparent_30%),radial-gradient(circle_at_92%_8%,rgba(255,122,26,0.13),transparent_28%),linear-gradient(180deg,#f7fbff_0%,#fffaf4_100%)]">
      <div className="grid min-h-screen w-full gap-4 px-3 pb-4 pt-3 sm:px-4 sm:pt-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:px-4 lg:py-4 2xl:px-5">
        <aside className="hidden self-start overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/80 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:w-64 lg:flex-col">
          <div className="shrink-0 overflow-hidden rounded-[1.1rem] bg-[linear-gradient(135deg,var(--brand-primary-deep),var(--brand-primary)_62%,var(--brand-secondary))] p-4 text-white">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/82">
              <Sparkles aria-hidden className="h-3 w-3 text-[color:var(--brand-secondary)]" />
              Student Panel
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-base font-black text-[color:var(--brand-primary)] shadow-lg">
                {initials || <UserRound aria-hidden className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-black">{dashboard.user.name}</div>
                <div className="truncate text-xs font-semibold text-white/72">{dashboard.user.email}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white/10 px-2.5 py-1.5">
                <div className="text-base font-black">{dashboard.stats.courses}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/65">Courses</div>
              </div>
              <div className="rounded-xl bg-white/10 px-2.5 py-1.5">
                <div className="text-base font-black">{dashboard.stats.batches}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/65">Batches</div>
              </div>
            </div>
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:var(--border-default)_transparent]">
            <nav className="grid gap-1" aria-label="Student navigation">
              {dashboard.menu.map((item) => {
                const Icon = navIcons[item.key as keyof typeof navIcons] ?? GraduationCap;
                return (
                  <LocaleLink
                    key={item.key}
                    href={item.href}
                    locale={locale}
                    className="focus-ring group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-extrabold text-[color:var(--text-body)] transition hover:bg-[color:var(--brand-primary-light)] hover:text-[color:var(--brand-primary-dark)]"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--surface-secondary)] text-[color:var(--brand-primary)] transition group-hover:bg-white">
                      <Icon aria-hidden className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </LocaleLink>
                );
              })}
            </nav>
          </div>

          <div className="mt-3 grid shrink-0 gap-2 border-t border-[color:var(--border-default)] bg-white/80 pt-3">
            <LocaleLink
              href="/"
              locale={locale}
              className="focus-ring inline-flex min-h-10 items-center justify-center rounded-xl border border-[color:var(--border-default)] bg-white px-3 py-2 text-xs font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-secondary)] hover:text-[color:var(--brand-secondary)]"
            >
              Visit Website
            </LocaleLink>
            <form action={logoutAction.bind(null, locale)}>
              <button
                type="submit"
                className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--text-heading)] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
              >
                <LogOut aria-hidden className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex min-h-full flex-col gap-3 sm:gap-4">
          <div className="rounded-[1.25rem] border border-white/80 bg-white/82 p-2.5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:hidden">
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--brand-primary)] text-sm font-black text-white">
                {initials || <UserRound aria-hidden className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-black text-[color:var(--text-heading)]">{dashboard.user.name}</div>
                <div className="truncate text-xs font-semibold text-[color:var(--text-muted)]">{dashboard.user.email}</div>
              </div>
              <form action={logoutAction.bind(null, locale)} className="shrink-0">
                <button
                  type="submit"
                  aria-label="Logout"
                  title="Logout"
                  className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:var(--border-default)] bg-white px-3 text-xs font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-secondary)] hover:text-[color:var(--brand-secondary)]"
                >
                  <LogOut aria-hidden className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 p-3 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5">
            {children}
          </div>
          </div>
        </div>
      </div>

      <SiteFooter bootstrap={bootstrap} locale={locale} compact />

      <nav className="fixed inset-x-3 bottom-3 z-40 flex gap-1.5 overflow-x-auto rounded-[1.25rem] border border-white/80 bg-white/95 p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden" aria-label="Student mobile navigation">
        {dashboard.menu.map((item) => {
          const Icon = navIcons[item.key as keyof typeof navIcons] ?? GraduationCap;
          return (
            <LocaleLink
              key={item.key}
              href={item.href}
              locale={locale}
              className="focus-ring flex min-w-[4.65rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-black text-[color:var(--text-heading)] transition hover:bg-[color:var(--brand-primary-light)] hover:text-[color:var(--brand-primary-dark)]"
            >
              <Icon aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
              <span className="max-w-full truncate leading-none">{item.label}</span>
            </LocaleLink>
          );
        })}
      </nav>
    </div>
  );
}
