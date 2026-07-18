import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Layers3, MonitorPlay, UsersRound } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { StudentCard, StudentEmptyState, StudentInfoItem, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { getStudentCourse } from "@/lib/api/site";
import { formatDate, formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";
import { sanitizeCmsHtml } from "@/lib/sanitize";

export default async function StudentCourseDetailPage({ params }: { params: Promise<{ locale: string; course: string }> }) {
  const { locale, course } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getStudentCourse(locale, course);
  const thumbnail = resolveMediaUrl(data.course.thumbnail_url);

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Course Workspace"
        title={data.course.title}
        description="Review your enrolled batches, schedule access, and course learning path."
        action={
          <LocaleLink
            locale={locale}
            href="/student/courses"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            All courses
          </LocaleLink>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <StudentCard className="overflow-hidden p-0">
          <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {thumbnail ? (
              <Image src={thumbnail} alt={data.course.title} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 45vw" unoptimized />
            ) : (
              <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">{data.course.title}</div>
            )}
          </div>
          <div className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <StudentInfoItem icon={<Layers3 aria-hidden className="h-4 w-4" />} label="Track" value={data.course.track ?? "Professional Skill"} />
              <StudentInfoItem icon={<MonitorPlay aria-hidden className="h-4 w-4" />} label="Enrolled batches" value={formatNumber(data.batches.length, locale)} />
            </div>
          </div>
        </StudentCard>

        <StudentCard>
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)]">
            <Layers3 aria-hidden className="h-4 w-4" />
            Course overview
          </div>
          {data.course.description ? (
            <div className="site-prose mt-4 text-sm leading-7" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(data.course.description) }} />
          ) : (
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-body)]">Course details will appear here when they are added.</p>
          )}
        </StudentCard>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.14em] text-[color:var(--brand-secondary-dark)]">Your batches</div>
            <h2 className="mt-2 text-2xl font-black text-[color:var(--text-heading)]">Batch access and progress</h2>
          </div>
        </div>

        {data.batches.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.batches.map((batch) => (
              <StudentCard key={batch.id} className="transition hover:-translate-y-0.5 hover:border-[color:var(--brand-primary)]/35">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[color:var(--text-heading)]">{batch.name}</h3>
                    <p className="mt-1 text-sm font-bold text-[color:var(--brand-primary)]">{data.course.title}</p>
                  </div>
                  <StudentStatusBadge status={batch.enrollment?.status ?? batch.status} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <StudentInfoItem icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Starts" value={formatDate(batch.start_date, locale)} />
                  <StudentInfoItem icon={<Clock3 aria-hidden className="h-4 w-4" />} label="Time" value={batch.class_time ?? "TBA"} />
                  <StudentInfoItem icon={<MonitorPlay aria-hidden className="h-4 w-4" />} label="Classes" value={formatNumber(batch.class_schedules_count ?? 0, locale)} />
                  <StudentInfoItem icon={<UsersRound aria-hidden className="h-4 w-4" />} label="Mentors" value={formatNumber(batch.mentors_count ?? batch.mentors?.length ?? 0, locale)} />
                </div>
                <LocaleLink
                  locale={locale}
                  href={`/student/batches/${batch.id}`}
                  className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
                >
                  Open batch schedule
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </LocaleLink>
              </StudentCard>
            ))}
          </div>
        ) : (
          <StudentEmptyState title="No batch access yet" message="Your enrolled batches for this course will appear here." />
        )}
      </section>
    </main>
  );
}
