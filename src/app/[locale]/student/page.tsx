import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, FileText, GraduationCap, MonitorPlay } from "lucide-react";
import { StudentStats } from "@/components/student/student-stats";
import { StudentCard, StudentEmptyState, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { LocaleLink } from "@/components/ui/link";
import { getStudentDashboard } from "@/lib/api/site";
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

          <div className="space-y-3 p-5 sm:p-6">
            {dashboard.upcoming_schedules.length ? (
              dashboard.upcoming_schedules.map((schedule) => (
                <div key={schedule.id} className="grid gap-4 rounded-2xl border border-[color:var(--border-default)]/70 bg-white p-4 transition hover:border-[color:var(--brand-primary)]/30 hover:bg-[color:var(--surface-secondary)] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--brand-primary-light)] text-center text-[color:var(--brand-primary)]">
                    <CalendarDays aria-hidden className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[color:var(--text-heading)]">{schedule.topic}</h3>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">
                      {formatDate(schedule.class_date, locale)} - {schedule.batch?.name ?? "Batch"}
                    </p>
                    {schedule.batch?.course ? (
                      <p className="mt-1 text-xs font-bold text-[color:var(--brand-primary)]">{schedule.batch.course.title}</p>
                    ) : null}
                  </div>
                  {schedule.live_class_link ? (
                    <a
                      href={schedule.live_class_link}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex min-h-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
                    >
                      Join class
                    </a>
                  ) : (
                    <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[color:var(--surface-secondary)] px-4 py-2 text-xs font-extrabold text-[color:var(--text-muted)]">
                      Scheduled
                    </span>
                  )}
                </div>
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
