import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getStudentCourse } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentCourseDetailPage({ params }: { params: Promise<{ locale: string; course: string }> }) {
  const { locale, course } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getStudentCourse(locale, course);
  return (
    <main>
      <SectionTitle kicker="Course" title={data.course.title} subtitle={data.course.description} align="left" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {data.batches.map((batch) => (
          <div key={batch.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="font-black text-slate-950">{batch.name}</div>
            <div className="mt-1 text-sm text-slate-500">{batch.enrollment?.status ?? batch.status}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
