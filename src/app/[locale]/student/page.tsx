import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  CalendarDays,
  CircleDashed,
  CirclePlay,
  Clock3,
  FileText,
  GraduationCap,
  MonitorPlay,
  Video,
} from "lucide-react";
import { StudentStats } from "@/components/student/student-stats";
import { StudentCard, StudentEmptyState, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { LocaleLink } from "@/components/ui/link";
import { getStudentDashboard } from "@/lib/api/site";
import type { StudentDashboard } from "@/lib/api/types";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dashboard = await getStudentDashboard(locale);
  const nextClass = dashboard.upcoming_schedules[0];

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Learning Console"
        title={`Welcome back, ${dashboard.user.name}`}
        description="Your courses, live classes, mentors, and invoices are organized here so you always know the next step."
        action={
          <LocaleLink
            locale={locale}
            href="/student/courses"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(255,122,26,0.22)] transition hover:bg-[color:var(--brand-secondary-dark)]"
          >
            Continue Learning
            <ArrowRight aria-hidden className="h-4 w-4" />
          </LocaleLink>
        }
      />

      <StudentStats stats={dashboard.stats} locale={locale} />

      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <StudentCard className="overflow-hidden p-0">
          <div className="border-b border-[color:var(--border-default)]/80 bg-[linear-gradient(135deg,#ffffff,#f4f8ff)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)]">
                  <MonitorPlay aria-hidden className="h-4 w-4" />
                  Upcoming Classes
                </div>
                <h2 className="mt-4 text-2xl font-black text-[color:var(--text-heading)]">Your next learning sessions</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-body)]">Follow your upcoming class schedule and join on time.</p>
              </div>
              {nextClass ? (
                <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                  <div className="font-black text-[color:var(--text-heading)]">Next class</div>
                  <div className="mt-1 text-[color:var(--text-muted)]">{formatDate(nextClass.class_date, locale)}</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:p-6">
            {dashboard.upcoming_schedules.length ? (
              dashboard.upcoming_schedules.map((schedule, index) => (
                <UpcomingClassCard key={schedule.id} schedule={schedule} locale={locale} featured={index === 0} />
              ))
            ) : (
              <StudentEmptyState title="No upcoming classes yet" message="Your approved batch schedule will appear here when classes are available." />
            )}
          </div>
        </StudentCard>

        <div className="grid gap-5">
          <StudentCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-tint)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-secondary-dark)]">
                  <GraduationCap aria-hidden className="h-4 w-4" />
                  Recent Batches
                </div>
                <h2 className="mt-4 text-xl font-black text-[color:var(--text-heading)]">Active learning</h2>
              </div>
              <LocaleLink locale={locale} href="/student/batches" className="text-xs font-black text-[color:var(--brand-primary)] hover:underline">
                View all
              </LocaleLink>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.recent_batches.length ? (
                dashboard.recent_batches.map((batch) => (
                  <LocaleLink
                    key={batch.id}
                    locale={locale}
                    href={`/student/batches/${batch.id}`}
                    className="focus-ring block rounded-2xl border border-[color:var(--border-default)]/70 bg-[color:var(--surface-secondary)] p-4 transition hover:border-[color:var(--brand-primary)]/30 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-[color:var(--text-heading)]">{batch.name}</div>
                        <div className="mt-1 text-sm text-[color:var(--text-muted)]">{batch.course?.title ?? "Course"}</div>
                      </div>
                      <StudentStatusBadge status={batch.enrollment?.status ?? batch.status} />
                    </div>
                  </LocaleLink>
                ))
              ) : (
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">No batch enrolled yet.</p>
              )}
            </div>
          </StudentCard>

          <StudentCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                  <FileText aria-hidden className="h-4 w-4" />
                  Recent Invoices
                </div>
                <h2 className="mt-4 text-xl font-black text-[color:var(--text-heading)]">Payment summary</h2>
              </div>
              <LocaleLink locale={locale} href="/student/invoices" className="text-xs font-black text-[color:var(--brand-primary)] hover:underline">
                View all
              </LocaleLink>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.recent_orders.length ? (
                dashboard.recent_orders.map((order) => (
                  <LocaleLink
                    key={order.id}
                    locale={locale}
                    href={`/student/invoices/${order.id}`}
                    className="focus-ring block rounded-2xl border border-[color:var(--border-default)]/70 bg-white p-4 transition hover:border-[color:var(--brand-secondary)]/35 hover:bg-[color:var(--surface-tint)]/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-[color:var(--text-heading)]">#INV-{order.id}</div>
                        <div className="mt-1 text-sm text-[color:var(--text-muted)]">{order.course?.title ?? "Course"}</div>
                      </div>
                      <div className="text-right">
                        <StudentStatusBadge status={order.status} />
                        <div className="mt-2 text-sm font-black text-[color:var(--text-heading)]">{formatCurrency(order.amount, locale)}</div>
                      </div>
                    </div>
                  </LocaleLink>
                ))
              ) : (
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">No invoice found yet.</p>
              )}
            </div>
          </StudentCard>

          <StudentCard className="bg-[linear-gradient(135deg,var(--text-heading),var(--brand-primary-deep))] text-white">
            <Clock3 aria-hidden className="h-6 w-6 text-[color:var(--brand-secondary)]" />
            <h2 className="mt-4 text-xl font-black">Keep your momentum</h2>
            <p className="mt-2 text-sm leading-7 text-white/75">Check your next class, review your batch, and keep your project work moving every week.</p>
          </StudentCard>
        </div>
      </section>
    </main>
  );
}

type DashboardSchedule = StudentDashboard["upcoming_schedules"][number];

function UpcomingClassCard({
  schedule,
  locale,
  featured,
}: {
  schedule: DashboardSchedule;
  locale: "en" | "bn";
  featured: boolean;
}) {
  const month = formatScheduleDatePart(schedule.class_date, locale, { month: "short" });
  const day = formatScheduleDatePart(schedule.class_date, locale, { day: "2-digit" });
  const weekday = formatScheduleDatePart(schedule.class_date, locale, { weekday: "long" });
  const distanceLabel = getScheduleDistanceLabel(schedule.class_date, locale);

  return (
    <article
      className={
        featured
          ? "rounded-[1.35rem] border border-[color:var(--brand-secondary)]/35 bg-[linear-gradient(135deg,#fff7f0_0%,#ffffff_48%,#f4f8ff_100%)] p-4 shadow-[0_14px_32px_rgba(255,122,26,0.09)]"
          : "rounded-[1.35rem] border border-[color:var(--border-default)]/75 bg-white p-4 transition hover:border-[color:var(--brand-primary)]/30 hover:bg-[color:var(--surface-secondary)]"
      }
    >
      <div className="grid gap-4 xl:grid-cols-[5.25rem_minmax(0,1fr)_minmax(17rem,.42fr)] xl:items-center">
        <div className="flex items-center gap-3 xl:block">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white text-center shadow-sm ring-1 ring-[color:var(--border-default)]/75">
            <div>
              <div className="text-xs font-black uppercase text-[color:var(--brand-primary)]">{month}</div>
              <div className="mt-1 text-3xl font-black leading-none text-[color:var(--text-heading)]">{day}</div>
            </div>
          </div>
          <div className="min-w-0 xl:mt-3">
            <span className={featured ? "rounded-full bg-[color:var(--brand-secondary)] px-3 py-1 text-xs font-black text-white" : "rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1 text-xs font-black text-[color:var(--brand-primary-dark)]"}>
              {featured ? "Next class" : distanceLabel}
            </span>
            <p className="mt-2 truncate text-xs font-bold text-[color:var(--text-muted)]">{weekday}</p>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-black leading-snug text-[color:var(--text-heading)]">{schedule.topic}</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-sm font-bold text-[color:var(--text-body)] ring-1 ring-[color:var(--border-default)]/70">
              <BookOpenCheck aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-primary)]" />
              <span className="truncate">{schedule.batch?.course?.title ?? "Course"}</span>
            </div>
            <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-sm font-bold text-[color:var(--text-body)] ring-1 ring-[color:var(--border-default)]/70">
              <GraduationCap aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-secondary)]" />
              <span className="truncate">{schedule.batch?.name ?? "Batch"}</span>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--text-muted)]">
            <CalendarDays aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
            {formatDate(schedule.class_date, locale)}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <ScheduleAction
            href={schedule.live_class_link}
            label="Join live class"
            emptyLabel="Live link pending"
            tone="live"
            icon={<Video aria-hidden className="h-4 w-4" />}
          />
          <ScheduleAction
            href={schedule.recorded_video_link}
            label="Watch recording"
            emptyLabel="Recording after class"
            tone="recording"
            icon={<CirclePlay aria-hidden className="h-4 w-4" />}
          />
          {schedule.batch?.id ? (
            <LocaleLink
              locale={locale}
              href={`/student/batches/${schedule.batch.id}`}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color:var(--border-default)] bg-white px-4 py-2.5 text-xs font-black text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)] sm:col-span-2 xl:col-span-1 2xl:col-span-2"
            >
              Batch routine
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </LocaleLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ScheduleAction({
  href,
  label,
  emptyLabel,
  tone,
  icon,
}: {
  href: string | null;
  label: string;
  emptyLabel: string;
  tone: "live" | "recording";
  icon: ReactNode;
}) {
  if (!href) {
    return (
      <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--border-default)] bg-white/65 px-4 py-2.5 text-xs font-black text-[color:var(--text-muted)]">
        <CircleDashed aria-hidden className="h-4 w-4" />
        {emptyLabel}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        tone === "live"
          ? "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-primary)] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[color:var(--brand-primary-dark)]"
          : "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-secondary)] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
      }
    >
      {icon}
      {label}
      <ArrowUpRight aria-hidden className="h-4 w-4" />
    </a>
  );
}

function getLocalDate(value: string | null | undefined) {
  if (!value) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatScheduleDatePart(
  value: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  const date = getLocalDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function getScheduleDistanceLabel(value: string | null | undefined, locale: string) {
  const date = getLocalDate(value);
  if (!date) return "Scheduled";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `${new Intl.NumberFormat(locale).format(days)} days left`;
  return "Past class";
}
