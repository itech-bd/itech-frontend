import type { ReactNode } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { StudentDashboard } from "@/lib/api/types";
import { logoutAction } from "@/actions/auth";

const navIcons = {
  dashboard: Home,
  profile: UserRound,
  courses: BookOpenCheck,
  batches: CalendarDays,
  mentors: UsersRound,
  invoices: FileText,
};

export function StudentShell({
  locale,
  dashboard,
  children,
}: {
  locale: AppLocale;
  dashboard: StudentDashboard;
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
      <div className="grid min-h-screen w-full gap-5 px-4 py-4 sm:px-5 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-5 lg:py-5 2xl:px-6">
        <aside className="hidden self-start rounded-[1.75rem] border border-white/80 bg-white/80 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:sticky lg:top-24 lg:block">
          <div className="overflow-hidden rounded-[1.4rem] bg-[linear-gradient(135deg,var(--brand-primary-deep),var(--brand-primary)_62%,var(--brand-secondary))] p-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/82">
              <Sparkles aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-secondary)]" />
              Student Panel
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-lg font-black text-[color:var(--brand-primary)] shadow-lg">
                {initials || <UserRound aria-hidden className="h-6 w-6" />}
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-black">{dashboard.user.name}</div>
                <div className="truncate text-xs font-semibold text-white/72">{dashboard.user.email}</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl bg-white/10 px-3 py-2">
                <div className="text-lg font-black">{dashboard.stats.courses}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">Courses</div>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2">
                <div className="text-lg font-black">{dashboard.stats.batches}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">Batches</div>
              </div>
            </div>
          </div>

          <nav className="mt-4 grid gap-1.5" aria-label="Student navigation">
            {dashboard.menu.map((item) => {
              const Icon = navIcons[item.key as keyof typeof navIcons] ?? GraduationCap;
              return (
                <LocaleLink
                  key={item.key}
                  href={item.href}
                  locale={locale}
                  className="focus-ring group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-extrabold text-[color:var(--text-body)] transition hover:bg-[color:var(--brand-primary-light)] hover:text-[color:var(--brand-primary-dark)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--surface-secondary)] text-[color:var(--brand-primary)] transition group-hover:bg-white">
                    <Icon aria-hidden className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </LocaleLink>
              );
            })}
          </nav>

          <div className="mt-5 grid gap-2 border-t border-[color:var(--border-default)] pt-4">
            <LocaleLink
              href="/"
              locale={locale}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-secondary)] hover:text-[color:var(--brand-secondary)]"
            >
              Visit Website
            </LocaleLink>
            <form action={logoutAction.bind(null, locale)}>
              <button
                type="submit"
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--text-heading)] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
              >
                <LogOut aria-hidden className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 rounded-[1.5rem] border border-white/80 bg-white/82 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:hidden">
            <div className="flex items-center gap-3 px-1 py-2">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--brand-primary)] text-sm font-black text-white">
                {initials || <UserRound aria-hidden className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <div className="truncate font-black text-[color:var(--text-heading)]">{dashboard.user.name}</div>
                <div className="truncate text-xs font-semibold text-[color:var(--text-muted)]">{dashboard.user.email}</div>
              </div>
            </div>
            <nav className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Student mobile navigation">
              {dashboard.menu.map((item) => {
                const Icon = navIcons[item.key as keyof typeof navIcons] ?? GraduationCap;
                return (
                  <LocaleLink
                    key={item.key}
                    href={item.href}
                    locale={locale}
                    className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full bg-[color:var(--surface-secondary)] px-4 py-2 text-xs font-extrabold text-[color:var(--text-heading)]"
                  >
                    <Icon aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
                    {item.label}
                  </LocaleLink>
                );
              })}
            </nav>
          </div>

          <div className="min-h-[calc(100vh-2rem)] rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5 lg:min-h-[calc(100vh-2.5rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
