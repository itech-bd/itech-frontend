import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CourseCard } from "@/components/public/course-card";
import { PaginationNav } from "@/components/ui/pagination";
import { PageHero } from "@/components/ui/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { LocaleLink } from "@/components/ui/link";
import { getPublicPage, listPublicCourses } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import { formatNumber } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: "Courses | iTechBD Ltd",
    description: "Browse active IT and creative training courses with upcoming batches and pricing.",
  };
}

export default async function CoursesPage({
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

  const [courses, pageData] = await Promise.all([
    listPublicCourses(locale, { search, track, page, per_page: 12 }),
    getPublicPage(locale, "courses"),
  ]);
  const hero = pageData.page.sections[0];
  const tracks = Array.isArray(courses.filters.tracks)
    ? courses.filters.tracks.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <main>
      <PageHero
        locale={locale}
        kicker="Course Directory"
        title={hero?.title ?? "Browse our courses"}
        subtitle={<div className="site-prose" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(hero?.content ?? "<p>Search and filter active courses from the API.</p>") }} />}
        primaryHref="/contact"
        primaryLabel="Need guidance?"
        secondaryHref="/reviews"
        secondaryLabel="Student reviews"
      >
        <div className="surface-card p-5">
          <SlidersHorizontal aria-hidden className="h-8 w-8 text-[color:var(--brand-primary)]" />
          <p className="mt-4 text-sm font-bold text-[color:var(--text-muted)]">Live course results</p>
          <div className="mt-1 text-4xl font-black text-[color:var(--text-heading)]">{formatNumber(courses.pagination.total, locale)}</div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-body)]">Use filters to find the right skill track, then apply to an available batch.</p>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <form className="surface-card grid gap-4 p-4 lg:grid-cols-[1fr_280px_auto] lg:items-end">
            <div>
              <label htmlFor="course-search" className="block text-sm font-extrabold text-[color:var(--text-heading)]">Search courses</label>
              <div className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-white px-3">
                <Search aria-hidden className="h-4 w-4 text-[color:var(--text-muted)]" />
                <input id="course-search" type="search" name="search" defaultValue={search} placeholder="Course name or keyword" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none placeholder:text-[color:var(--text-muted)]" />
              </div>
            </div>
            <div>
              <label htmlFor="course-track" className="block text-sm font-extrabold text-[color:var(--text-heading)]">Track</label>
              <select id="course-track" name="track" defaultValue={track} className="mt-2 min-h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3 py-3 text-sm font-semibold text-[color:var(--text-heading)]">
                <option value="">All tracks</option>
                {tracks.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-[color:var(--brand-primary)] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]">
              Filter
            </button>
          </form>

          {(search || track) ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-[color:var(--text-muted)]">Active filters:</span>
              {search ? <span className="rounded-lg bg-[color:var(--brand-primary-light)] px-3 py-1.5 font-bold text-[color:var(--brand-primary-dark)]">Search: {search}</span> : null}
              {track ? <span className="rounded-lg bg-[color:var(--surface-tint)] px-3 py-1.5 font-bold text-[color:var(--brand-secondary-dark)]">Track: {track}</span> : null}
              <LocaleLink locale={locale} href="/courses" className="focus-ring inline-flex items-center gap-1 rounded-lg border border-[color:var(--border-default)] px-3 py-1.5 font-extrabold text-[color:var(--text-heading)]">
                <X aria-hidden className="h-4 w-4" />
                Reset
              </LocaleLink>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-[color:var(--text-heading)]">
              {formatNumber(courses.pagination.total, locale)} course{courses.pagination.total === 1 ? "" : "s"} found
            </h2>
            <p className="text-sm font-bold text-[color:var(--text-muted)]">Page {courses.pagination.current_page} of {courses.pagination.last_page}</p>
          </div>

          {courses.items.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.items.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-6" title="No matching courses" message="Try a different keyword or clear the active filters." />
          )}

          {courses.items.length ? (
            <PaginationNav locale={locale} pagination={courses.pagination} basePath="/courses" searchParams={{ search, track }} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
