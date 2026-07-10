import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { CourseCard } from "@/components/public/course-card";
import { getPublicCourse } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatCurrency, formatDate } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return { title: slug };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicCourse(locale, slug);
  const course = data.course;

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionTitle kicker={course.track ?? "Course"} title={course.title} subtitle={course.description} align="left" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Pricing</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.pricing ? (
                <>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Regular</div>
                    <div className="mt-2 text-lg font-black text-slate-950">{formatCurrency(course.pricing.discount_price ?? course.pricing.old_price ?? 0, locale)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Online</div>
                    <div className="mt-2 text-lg font-black text-slate-950">{formatCurrency(course.pricing.online_discount_price ?? course.pricing.discount_price ?? 0, locale)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Offline</div>
                    <div className="mt-2 text-lg font-black text-slate-950">{formatCurrency(course.pricing.offline_discount_price ?? course.pricing.discount_price ?? 0, locale)}</div>
                  </div>
                </>
              ) : null}
            </div>
          </section>

          <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Available batches</h2>
            <div className="mt-4 space-y-3">
              {(course.batches ?? []).map((batch) => (
                <div key={batch.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-bold text-slate-950">{batch.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{batch.start_date ? formatDate(batch.start_date, locale) : "TBA"} · {batch.class_time}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {data.related_courses.length ? (
          <section className="mt-14">
            <SectionTitle kicker="Related Courses" title="More options" align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.related_courses.map((item) => (
                <CourseCard key={item.id} course={item} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
