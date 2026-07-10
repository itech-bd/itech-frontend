import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { PaginationNav } from "@/components/ui/pagination";
import { listStudentCourses } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentCoursesPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search : "";
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const courses = await listStudentCourses(locale, { search, page, per_page: 12 });

  return (
    <main>
      <SectionTitle kicker="My Courses" title="Enrolled courses" subtitle="Courses tied to your pending or approved batch enrollments." align="left" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {courses.items.map((course) => (
          <div key={course.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="font-black text-slate-950">{course.title}</div>
            <div className="mt-1 text-sm text-slate-500">{course.enrolled_batches_count ?? 0} batches</div>
          </div>
        ))}
      </div>
      <PaginationNav locale={locale} pagination={courses.pagination} basePath="/student/courses" searchParams={{ search }} />
    </main>
  );
}
