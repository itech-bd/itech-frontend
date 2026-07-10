import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { CourseCard } from "@/components/public/course-card";
import { PaginationNav } from "@/components/ui/pagination";
import { getPublicPage, listPublicCourses } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "কোর্স" : "Courses" };
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

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionTitle kicker="Courses" title={pageData.page.sections[0]?.title ?? "Browse our courses"} subtitle={pageData.page.sections[0]?.content ?? "Search and filter active courses from the API."} align="left" />

        <form className="mt-8 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_260px_auto] lg:items-end">
          <div>
            <label htmlFor="course-search" className="block text-sm font-extrabold text-slate-900">Search courses</label>
            <input id="course-search" type="search" name="search" defaultValue={search} placeholder="Course name or keyword" className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </div>
          <div>
            <label htmlFor="course-track" className="block text-sm font-extrabold text-slate-900">Track</label>
            <input id="course-track" type="text" name="track" defaultValue={track} placeholder="Track name" className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </div>
          <button type="submit" className="rounded-2xl bg-[color:var(--brand-primary)] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-deep)]">Filter</button>
        </form>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.items.map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>

        {courses.items.length ? (
          <PaginationNav locale={locale} pagination={courses.pagination} basePath="/courses" searchParams={{ search, track }} />
        ) : null}
      </div>
    </main>
  );
}
