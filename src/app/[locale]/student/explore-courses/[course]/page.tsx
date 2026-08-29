import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  MonitorPlay,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { StudentCard, StudentEmptyState, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { getCheckoutPreview, getPublicCourse } from "@/lib/api/site";
import type { BatchSummary, CheckoutPreview, CourseSummary } from "@/lib/api/types";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";
import { sanitizeCmsHtml } from "@/lib/sanitize";

export default async function StudentExploreCourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; course: string }>;
}) {
  const { locale, course: courseParam } = await params;
  if (!isLocale(locale)) notFound();

  const [details, preview] = await Promise.all([
    getPublicCourse(locale, courseParam),
    getCheckoutPreview(locale, courseParam),
  ]);
  const course = details.course;
  const thumbnail = resolveMediaUrl(course.thumbnail_url);
  const courseKey = course.slug ?? course.id;
  const joinedByBatch = new Map(preview.joined_batches.map((item) => [item.batch_id, item]));
  const enrollmentStatus = overallEnrollmentStatus(preview);

  if (enrollmentStatus !== "none") {
    redirect(`/${locale}/student/courses/${courseKey}`);
  }

  const primaryHref = `/checkout/courses/${courseKey}`;
  const primaryLabel = "Enroll Now";

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker={course.track ?? "Course Details"}
        title={course.title}
        description="Review the course, available batches, and your current admission status."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <LocaleLink
              locale={locale}
              href="/student/explore-courses"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              All Courses
            </LocaleLink>
            <LocaleLink
              locale={locale}
              href={primaryHref}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(255,122,26,0.18)] transition hover:bg-[color:var(--brand-secondary-dark)]"
            >
              {primaryLabel}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </LocaleLink>
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-5">
          <StudentCard className="overflow-hidden p-0">
            <div className="relative aspect-[16/8] min-h-64 overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="brand-grid grid h-full place-items-center p-8 text-center text-3xl font-black text-white">
                  {course.title}
                </div>
              )}
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <StudentStatusBadge status={enrollmentStatus === "none" ? "open" : enrollmentStatus} />
                <span className="rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1 text-xs font-black text-[color:var(--brand-primary-dark)]">
                  {course.track ?? "Professional Skill"}
                </span>
              </div>
              <article
                className="site-prose mt-5 max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(course.description) }}
              />
            </div>
          </StudentCard>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-[color:var(--text-heading)]">Available batches</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-body)]">Pick a running or upcoming batch when you enroll.</p>
            </div>
            {(course.batches ?? []).length ? (
              <div className="grid gap-4">
                {(course.batches ?? []).map((batch) => (
                  <ExploreBatchCard
                    key={batch.id}
                    batch={batch}
                    course={course}
                    locale={locale}
                    joined={joinedByBatch.get(batch.id)}
                    enrollmentStatus={enrollmentStatus}
                  />
                ))}
              </div>
            ) : (
              <StudentEmptyState title="No batch is open right now" message="Please check again later or contact the office for the next schedule." />
            )}
          </section>
        </div>

        <aside className="xl:sticky xl:top-5 xl:self-start">
          <StudentCard>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary)]">
                <WalletCards aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">Admission</p>
                <h2 className="text-xl font-black text-[color:var(--text-heading)]">{priceLabel(course, locale)}</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <SummaryRow icon={<BookOpenCheck aria-hidden className="h-4 w-4" />} label="Status" value={statusLabel(enrollmentStatus)} />
              <SummaryRow icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Batches" value={`${course.batches?.length ?? 0} available`} />
              <SummaryRow icon={<MonitorPlay aria-hidden className="h-4 w-4" />} label="Mode" value="Online and offline when available" />
            </div>

            <LocaleLink
              locale={locale}
              href={primaryHref}
              className="focus-ring mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
            >
              {primaryLabel}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </LocaleLink>
          </StudentCard>
        </aside>
      </section>
    </main>
  );
}

function ExploreBatchCard({
  batch,
  course,
  locale,
  joined,
  enrollmentStatus,
}: {
  batch: BatchSummary;
  course: CourseSummary;
  locale: AppLocale;
  joined?: CheckoutPreview["joined_batches"][number];
  enrollmentStatus: ReturnType<typeof overallEnrollmentStatus>;
}) {
  const courseKey = course.slug ?? course.id;
  const joinedStatus = joined?.status ?? null;
  const useCourseLink = enrollmentStatus === "approved" && !joinedStatus;
  const actionHref = joinedStatus
    ? `/student/batches/${batch.id}`
    : useCourseLink
      ? `/student/courses/${courseKey}`
      : `/checkout/courses/${courseKey}`;
  const actionLabel = joinedStatus ? "View Batch" : useCourseLink ? "Go to Course" : "Select Batch";

  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border-default)] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-[color:var(--text-heading)]">{batch.name}</h3>
            <StudentStatusBadge status={joinedStatus ?? batch.status} />
          </div>
          <div className="mt-3 grid gap-2 text-sm font-bold text-[color:var(--text-body)] md:grid-cols-3">
            <span className="flex items-center gap-2 rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2">
              <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-primary)]" />
              {batch.start_date ? formatDate(batch.start_date, locale) : "TBA"}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2">
              <Clock3 aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-secondary)]" />
              {batch.class_time ?? "Contact office"}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2">
              <UsersRound aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" />
              {batch.mentors?.length ? `${batch.mentors.length} mentor${batch.mentors.length === 1 ? "" : "s"}` : "Mentor TBA"}
            </span>
          </div>
        </div>
        <LocaleLink
          locale={locale}
          href={actionHref}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
        >
          {actionLabel}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}

function SummaryRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[color:var(--surface-secondary)] p-3">
      <span className="text-[color:var(--brand-primary)]">{icon}</span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">{label}</p>
        <p className="mt-1 font-extrabold text-[color:var(--text-heading)]">{value}</p>
      </div>
    </div>
  );
}

function overallEnrollmentStatus(preview: CheckoutPreview) {
  const statuses = preview.joined_batches.map((item) => item.status);

  if (statuses.includes("approved")) return "approved";
  if (statuses.includes("pending")) return "pending";
  return "none";
}

function statusLabel(status: ReturnType<typeof overallEnrollmentStatus>) {
  if (status === "approved") return "Enrolled";
  if (status === "pending") return "Admission pending";
  return "Open for admission";
}

function priceLabel(course: CourseSummary, locale: AppLocale) {
  const price =
    course.pricing?.online_discount_price ??
    course.pricing?.offline_discount_price ??
    course.pricing?.discount_price ??
    course.pricing?.old_price ??
    null;

  return price ? formatCurrency(price, locale) : "Contact for fee";
}
