import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Link as LinkIcon, MonitorPlay, UserRound, UsersRound } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { StudentCard, StudentEmptyState, StudentInfoItem, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { getStudentBatch } from "@/lib/api/site";
import { formatDate, formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

export default async function StudentBatchDetailPage({ params }: { params: Promise<{ locale: string; batch: string }> }) {
  const { locale, batch } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getStudentBatch(locale, batch);
  const thumbnail = resolveMediaUrl(data.batch.course?.thumbnail_url);

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Batch Workspace"
        title={data.batch.name}
        description={data.batch.course?.title ?? "Your batch schedule and access details are organized here."}
        action={
          <LocaleLink
            locale={locale}
            href="/student/batches"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            All batches
          </LocaleLink>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <StudentCard className="overflow-hidden p-0">
          <div className="relative aspect-[16/9] bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {thumbnail ? (
              <Image src={thumbnail} alt={data.batch.course?.title ?? data.batch.name} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 45vw" unoptimized />
            ) : (
              <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">{data.batch.course?.title ?? data.batch.name}</div>
            )}
          </div>
        </StudentCard>

        <StudentCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)]">
                <CheckCircle2 aria-hidden className="h-4 w-4" />
                Enrollment
              </div>
              <h2 className="mt-4 text-2xl font-black text-[color:var(--text-heading)]">Access summary</h2>
            </div>
            <StudentStatusBadge status={data.enrollment.status ?? data.batch.status} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StudentInfoItem icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Start date" value={formatDate(data.batch.start_date, locale)} />
            <StudentInfoItem icon={<Clock3 aria-hidden className="h-4 w-4" />} label="Class time" value={data.batch.class_time ?? "TBA"} />
            <StudentInfoItem icon={<MonitorPlay aria-hidden className="h-4 w-4" />} label="Schedule access" value={data.schedule_access ? "Approved" : "Pending approval"} />
            <StudentInfoItem icon={<UsersRound aria-hidden className="h-4 w-4" />} label="Mentors" value={formatNumber(data.batch.mentors.length, locale)} />
          </div>

          {data.batch.live_class_link ? (
            <a
              href={data.batch.live_class_link}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
            >
              <LinkIcon aria-hidden className="h-4 w-4" />
              Open live class
            </a>
          ) : null}
        </StudentCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <StudentCard>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-[color:var(--brand-secondary-dark)]">Class schedule</div>
              <h2 className="mt-2 text-2xl font-black text-[color:var(--text-heading)]">Upcoming and recorded lessons</h2>
            </div>
            <div className="text-sm font-bold text-[color:var(--text-muted)]">{formatNumber(data.schedules.length, locale)} classes</div>
          </div>

          <div className="mt-5 space-y-3">
            {data.schedule_access && data.schedules.length ? (
              data.schedules.map((schedule, index) => (
                <div key={schedule.id} className="grid gap-4 rounded-2xl border border-[color:var(--border-default)]/70 bg-[color:var(--surface-secondary)] p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-[color:var(--brand-primary)] shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-[color:var(--text-heading)]">{schedule.topic}</h3>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">{formatDate(schedule.class_date, locale)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.live_class_link ? (
                      <a href={schedule.live_class_link} target="_blank" rel="noreferrer" className="focus-ring rounded-xl bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-extrabold text-white">
                        Live
                      </a>
                    ) : null}
                    {schedule.recorded_video_link ? (
                      <a href={schedule.recorded_video_link} target="_blank" rel="noreferrer" className="focus-ring rounded-xl border border-[color:var(--border-default)] bg-white px-4 py-2 text-xs font-extrabold text-[color:var(--text-heading)]">
                        Recording
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <StudentEmptyState title={data.schedule_access ? "No class schedule yet" : "Schedule pending"} message={data.schedule_access ? "Class schedules will appear here after they are published." : "Your class schedule will unlock after enrollment approval."} />
            )}
          </div>
        </StudentCard>

        <StudentCard>
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-tint)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-secondary-dark)]">
            <UsersRound aria-hidden className="h-4 w-4" />
            Batch mentors
          </div>
          <div className="mt-5 space-y-3">
            {data.batch.mentors.length ? (
              data.batch.mentors.map((mentor) => {
                const image = resolveMediaUrl(mentor.profile_image_url);
                return (
                  <div key={mentor.id} className="flex items-center gap-3 rounded-2xl border border-[color:var(--border-default)]/70 bg-white p-3">
                    <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
                      {image ? <Image src={image} alt={mentor.name} fill className="object-cover" sizes="48px" unoptimized /> : <UserRound aria-hidden className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black text-[color:var(--text-heading)]">{mentor.name}</div>
                      <div className="truncate text-xs font-semibold text-[color:var(--text-muted)]">{mentor.email ?? "Mentor"}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-6 text-[color:var(--text-muted)]">Mentor information will appear after assignment.</p>
            )}
          </div>
        </StudentCard>
      </section>
    </main>
  );
}
