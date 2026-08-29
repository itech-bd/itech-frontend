import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  Compass,
  FileText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { PaginationNav } from "@/components/ui/pagination";
import { StudentEmptyState, StudentPageHeader } from "@/components/student/student-panel-ui";
import { listStudentCourseCatalog } from "@/lib/api/site";
import type { StudentCourseCatalogItem } from "@/lib/api/types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatting";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export default async function StudentExploreCoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search : "";
  const track = typeof query.track === "string" ? query.track : "";
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const catalog = await listStudentCourseCatalog(locale, { search, track, page, per_page: 9 });
  const tracks = Array.isArray(catalog.filters.tracks)
    ? catalog.filters.tracks.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Explore Courses"
        title="Find your next course"
        description="Browse every active course while staying inside your student panel."
        action={
          <div className="rounded-2xl bg-[color:var(--brand-primary-light)] px-4 py-3 text-sm font-black text-[color:var(--brand-primary-dark)]">
            {formatNumber(catalog.pagination.total, locale)} active course{catalog.pagination.total === 1 ? "" : "s"}
          </div>
        }
      />

      <form className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
        <div className="grid gap-4 lg:grid-cols-[1fr_17rem_auto] lg:items-end">
          <div>
            <label htmlFor="catalog-search" className="block text-sm font-extrabold text-[color:var(--text-heading)]">
              Search courses
            </label>
            <div className="mt-2 flex min-h-12 items-center gap-3 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4">
              <Search aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--text-muted)]" />
              <input
                id="catalog-search"
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Course name or keyword"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold text-[color:var(--text-heading)] outline-none placeholder:text-[color:var(--text-muted)]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="catalog-track" className="block text-sm font-extrabold text-[color:var(--text-heading)]">
              Track
            </label>
            <select
              id="catalog-track"
              name="track"
              defaultValue={track}
              className="mt-2 min-h-12 w-full rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]"
            >
              <option value="">All tracks</option>
              {tracks.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-primary)] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
          >
            <SlidersHorizontal aria-hidden className="h-4 w-4" />
            Filter
          </button>
        </div>
      </form>

      {search || track ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-[color:var(--text-muted)]">Active filters:</span>
          {search ? (
            <span className="rounded-lg bg-[color:var(--brand-primary-light)] px-3 py-1.5 font-bold text-[color:var(--brand-primary-dark)]">
              Search: {search}
            </span>
          ) : null}
          {track ? (
            <span className="rounded-lg bg-[color:var(--surface-tint)] px-3 py-1.5 font-bold text-[color:var(--brand-secondary-dark)]">
              Track: {track}
            </span>
          ) : null}
          <LocaleLink
            locale={locale}
            href="/student/explore-courses"
            className="focus-ring inline-flex items-center gap-1 rounded-lg border border-[color:var(--border-default)] bg-white px-3 py-1.5 font-extrabold text-[color:var(--text-heading)]"
          >
            <X aria-hidden className="h-4 w-4" />
            Reset
          </LocaleLink>
        </div>
      ) : null}

      {catalog.items.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {catalog.items.map((course) => (
            <CatalogCourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
      ) : (
        <StudentEmptyState
          title="No courses found"
          message="Try a different keyword or clear the active filters."
          action={
            <LocaleLink
              locale={locale}
              href="/student/explore-courses"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
            >
              <Compass aria-hidden className="h-4 w-4" />
              Clear filters
            </LocaleLink>
          }
        />
      )}

      <PaginationNav locale={locale} pagination={catalog.pagination} basePath="/student/explore-courses" searchParams={{ search, track }} />
    </main>
  );
}

function CatalogCourseCard({ course, locale }: { course: StudentCourseCatalogItem; locale: AppLocale }) {
  const thumbnail = resolveMediaUrl(course.thumbnail_url);
  const courseKey = course.slug ?? course.id;
  const firstBatch = course.batches?.[0];
  const batchCount = course.batches?.length ?? 0;
  const lowest =
    course.pricing?.online_discount_price ??
    course.pricing?.offline_discount_price ??
    course.pricing?.discount_price ??
    course.pricing?.old_price ??
    null;
  const primary = primaryAction(course);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[color:var(--border-default)] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
      <LocaleLink locale={locale} href={`/student/explore-courses/${courseKey}`} className="focus-ring block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-xl font-black text-white">
              {course.title}
            </div>
          )}
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)] shadow-sm">
            {course.track ?? "Professional Skill"}
          </div>
          <EnrollmentPill status={course.enrollment_status} className="absolute right-3 top-3" />
          {lowest ? (
            <div className="absolute bottom-3 right-3 rounded-full bg-[color:var(--text-heading)] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
              {formatCurrency(lowest, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 min-h-12 text-lg font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/student/explore-courses/${courseKey}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {course.title}
          </LocaleLink>
        </h2>

        <div className="mt-4 grid gap-2 text-xs font-bold text-[color:var(--text-body)]">
          <div className="flex items-center gap-2 rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2">
            <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-primary)]" />
            <span>{batchCount ? `${formatNumber(batchCount, locale)} available batch${batchCount === 1 ? "" : "es"}` : "Batch announced soon"}</span>
          </div>
          {firstBatch ? (
            <div className="flex items-center gap-2 rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2">
              <Clock3 aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--brand-secondary)]" />
              <span className="line-clamp-1">
                {firstBatch.start_date ? `Starts ${formatDate(firstBatch.start_date, locale)}` : "Start date TBA"}
                {firstBatch.class_time ? `, ${firstBatch.class_time}` : ""}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[color:var(--border-default)] pt-4 text-xs font-black">
          <div className="rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2">
            <span className="text-[color:var(--text-muted)]">Offline </span>
            <span className="text-[color:var(--brand-secondary)]">
              {course.pricing?.offline_discount_price ? formatCurrency(course.pricing.offline_discount_price, locale) : "--"}
            </span>
          </div>
          <div className="rounded-xl bg-[color:var(--surface-secondary)] px-3 py-2 text-right">
            <span className="text-[color:var(--text-muted)]">Online </span>
            <span className="text-[color:var(--brand-secondary)]">{lowest ? formatCurrency(lowest, locale) : "--"}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <LocaleLink
            locale={locale}
            href={`/student/explore-courses/${courseKey}`}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--brand-secondary)]/35 px-4 py-2 text-xs font-extrabold text-[color:var(--brand-secondary)] transition hover:bg-[color:var(--surface-tint)]"
          >
            Details
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href={primary.href}
            className={cn(
              "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold text-white transition",
              primary.tone === "primary"
                ? "bg-[color:var(--brand-primary)] hover:bg-[color:var(--brand-primary-dark)]"
                : primary.tone === "secondary"
                  ? "bg-[color:var(--brand-secondary)] hover:bg-[color:var(--brand-secondary-dark)]"
                  : "bg-[color:var(--text-heading)] hover:bg-[color:var(--brand-primary-dark)]",
            )}
          >
            {primary.icon}
            {primary.label}
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}

function EnrollmentPill({ status, className }: { status: StudentCourseCatalogItem["enrollment_status"]; className?: string }) {
  const config = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    pending: "bg-amber-50 text-amber-700 ring-amber-100",
    none: "bg-white/95 text-[color:var(--brand-secondary-dark)] ring-white/70",
  }[status];
  const label = status === "approved" ? "Enrolled" : status === "pending" ? "Pending" : "Open";

  return <span className={cn("rounded-full px-3 py-1.5 text-xs font-black ring-1 shadow-sm", config, className)}>{label}</span>;
}

function primaryAction(course: StudentCourseCatalogItem) {
  const courseKey = course.slug ?? course.id;

  if (course.enrollment_status === "approved") {
    return {
      href: `/student/courses/${courseKey}`,
      label: "Go to Course",
      icon: <BookOpenCheck aria-hidden className="h-4 w-4" />,
      tone: "primary" as const,
    };
  }

  if (course.enrollment_status === "pending") {
    return {
      href: course.pending_order_id ? `/student/invoices/${course.pending_order_id}` : `/student/courses/${courseKey}`,
      label: course.pending_order_id ? "View Invoice" : "View Request",
      icon: <FileText aria-hidden className="h-4 w-4" />,
      tone: "dark" as const,
    };
  }

  return {
    href: `/checkout/courses/${courseKey}`,
    label: "Enroll Now",
    icon: <ArrowRight aria-hidden className="h-4 w-4" />,
    tone: "secondary" as const,
  };
}
