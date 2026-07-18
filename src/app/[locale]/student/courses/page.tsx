import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpenCheck, Search } from "lucide-react";
import { PaginationNav } from "@/components/ui/pagination";
import { LocaleLink } from "@/components/ui/link";
import { StudentEmptyState, StudentPageHeader } from "@/components/student/student-panel-ui";
import { listStudentCourses } from "@/lib/api/site";
import type { CourseSummary } from "@/lib/api/types";
import { formatCurrency, formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

export default async function StudentCoursesPage({
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
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const courses = await listStudentCourses(locale, { search, page, per_page: 9 });

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="My Courses"
        title="Your enrolled learning paths"
        description="Continue the courses connected with your pending or approved batch enrollments."
        action={
          <div className="rounded-2xl bg-[color:var(--brand-primary-light)] px-4 py-3 text-sm font-black text-[color:var(--brand-primary-dark)]">
            {formatNumber(courses.pagination.total, locale)} course{courses.pagination.total === 1 ? "" : "s"}
          </div>
        }
      />

      <form className="rounded-[1.5rem] border border-white/80 bg-white/85 p-3 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-4">
        <label htmlFor="course-search" className="sr-only">Search courses</label>
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4">
          <Search aria-hidden className="h-4 w-4 text-[color:var(--text-muted)]" />
          <input
            id="course-search"
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search your courses"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold text-[color:var(--text-heading)] outline-none placeholder:text-[color:var(--text-muted)]"
          />
          <button type="submit" className="rounded-xl bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-extrabold text-white">
            Search
          </button>
        </div>
      </form>

      {courses.items.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {courses.items.map((course) => (
            <StudentCourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
      ) : (
        <StudentEmptyState title="No enrolled courses found" message="Try a different search keyword or apply to a course from the public course page." />
      )}

      <PaginationNav locale={locale} pagination={courses.pagination} basePath="/student/courses" searchParams={{ search }} />
    </main>
  );
}

function StudentCourseCard({ course, locale }: { course: CourseSummary; locale: "en" | "bn" }) {
  const thumbnail = resolveMediaUrl(course.thumbnail_url);
  const href = `/student/courses/${course.slug ?? course.id}`;
  const fee =
    course.pricing?.online_discount_price ??
    course.pricing?.offline_discount_price ??
    course.pricing?.discount_price ??
    course.pricing?.old_price ??
    null;

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[color:var(--border-default)] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
      <LocaleLink locale={locale} href={href} className="focus-ring block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {thumbnail ? (
            <Image src={thumbnail} alt={course.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 33vw" unoptimized />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-xl font-black text-white">{course.title}</div>
          )}
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)] shadow-sm">
            {course.track ?? "Skill Track"}
          </div>
        </div>
      </LocaleLink>
      <div className="p-5">
        <h2 className="line-clamp-2 min-h-12 text-lg font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={href} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {course.title}
          </LocaleLink>
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[color:var(--brand-primary-light)] p-3">
            <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-primary-dark)]">Batches</div>
            <div className="mt-1 text-lg font-black text-[color:var(--text-heading)]">{formatNumber(course.enrolled_batches_count ?? 0, locale)}</div>
          </div>
          <div className="rounded-2xl bg-[color:var(--surface-tint)] p-3">
            <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">Fee starts</div>
            <div className="mt-1 text-lg font-black text-[color:var(--text-heading)]">{fee ? formatCurrency(fee, locale) : "--"}</div>
          </div>
        </div>
        <LocaleLink
          locale={locale}
          href={href}
          className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
        >
          View course
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}
