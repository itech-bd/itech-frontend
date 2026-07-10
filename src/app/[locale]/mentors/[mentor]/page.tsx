import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { CourseCard } from "@/components/public/course-card";
import { getPublicMentor } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; mentor: string }> }): Promise<Metadata> {
  const { locale, mentor } = await params;
  if (!isLocale(locale)) notFound();
  return { title: mentor };
}

export default async function MentorDetailPage({ params }: { params: Promise<{ locale: string; mentor: string }> }) {
  const { locale, mentor } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicMentor(locale, mentor);

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionTitle kicker={data.mentor.topic ?? "Mentor"} title={data.mentor.name} subtitle={data.mentor.bio ?? undefined} align="left" />
        {data.related_courses.length ? (
          <section className="mt-14">
            <SectionTitle kicker="Related Courses" title="Courses connected with this mentor" align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.related_courses.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
