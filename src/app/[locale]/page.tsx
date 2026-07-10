import type { Metadata } from "next";
import { getPublicHome } from "@/lib/api/site";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";
import { SectionTitle } from "@/components/ui/section-title";
import { CourseCard } from "@/components/public/course-card";
import { MentorCard } from "@/components/public/mentor-card";
import { NewsCard } from "@/components/public/news-card";
import { ReviewCard } from "@/components/public/review-card";
import { HeroSection } from "@/components/public/hero-section";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: locale === "bn" ? "হোম" : "Home",
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicHome(locale);

  const heroText =
    data.page.sections.find((section) => section.key === "hero_paragraph")?.content ??
    data.page.sections[0]?.content ??
    "<p>Practical training, mentor support, and career-focused courses.</p>";
  const heroTitle = data.page.sections.find((section) => section.key === "hero_primary")?.title ?? "Develop Software and";
  const heroHighlight = data.page.sections.find((section) => section.key === "hero_emphasis")?.title ?? "Professional Skills";

  return (
    <main>
      <HeroSection locale={locale} title={heroTitle} highlight={heroHighlight} content={heroText} ctaHref="/courses" ctaLabel="Explore Courses" />

      <section className="py-14">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <SectionTitle kicker="Popular Courses" title="Choose a course and start learning" subtitle="These cards are loaded directly from the active courses in the API." align="left" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.popular_courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {data.upcoming_batches.length ? (
        <section className="py-14">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Upcoming Batches" title="Admission is going on" subtitle="Batch cards come directly from the API." align="left" />
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {data.upcoming_batches.slice(0, 4).map((batch) => (
                <article key={batch.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="inline-flex rounded-full bg-[color:var(--brand-orange)]/10 px-3 py-1 text-xs font-extrabold text-[color:var(--brand-orange)]">{batch.status}</div>
                      <h3 className="mt-3 text-xl font-black text-slate-950">{batch.name}</h3>
                      <p className="mt-1 text-sm font-bold text-[color:var(--brand-primary)]">{batch.course?.title}</p>
                    </div>
                    <div className="rounded-2xl bg-[color:var(--brand-primary)] px-4 py-3 text-center text-white">
                      <div className="text-xs font-bold uppercase opacity-80">Starts</div>
                      <div className="text-sm font-black">{batch.start_date ?? "Soon"}</div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3"><span className="block font-black text-slate-950">Class days</span>{batch.class_days.join(", ") || "Announced soon"}</div>
                    <div className="rounded-2xl bg-slate-50 p-3"><span className="block font-black text-slate-950">Class time</span>{batch.class_time || "Contact office"}</div>
                    <div className="rounded-2xl bg-slate-50 p-3"><span className="block font-black text-slate-950">Duration</span>{batch.end_date ?? "Open"}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.mentors.length ? (
        <section className="py-14">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Expert Mentors" title="Learn from industry practitioners" subtitle="Mentors are loaded from the API and linked to their user profiles when available." align="left" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.mentors.slice(0, 4).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.latest_news.length ? (
        <section className="py-14">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="News & Updates" title="Latest announcements" subtitle="Published news from the API appears automatically." align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {data.latest_news.map((news) => (
                <NewsCard key={news.id} news={news} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.reviews.length ? (
        <section className="bg-white py-14">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Success Stories" title="What learners say" subtitle="Only approved reviews from the API are shown here." align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {data.reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
