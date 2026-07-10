import { HeroSection } from "./hero-section";
import { SectionTitle } from "@/components/ui/section-title";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import type { AppLocale } from "@/lib/i18n/routing";
import type { PublicPagePayload, CourseSummary } from "@/lib/api/types";
import { CourseCard } from "./course-card";

export function CmsPage({
  locale,
  data,
  heading,
  fallbackDescription,
  featuredCourses,
}: {
  locale: AppLocale;
  data: PublicPagePayload;
  heading: string;
  fallbackDescription?: string;
  featuredCourses?: CourseSummary[];
}) {
  const hero = data.page.sections[0];
  const bodySections = data.page.sections.slice(1);

  return (
    <main>
      <HeroSection
        locale={locale}
        title={hero?.title ?? heading}
        highlight=""
        content={hero?.content ?? fallbackDescription ?? ""}
        ctaHref={hero?.button_link ?? "/courses"}
        ctaLabel={hero?.button_text ?? "Explore Courses"}
      />

      {bodySections.length ? (
        <section className="py-14">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-2 lg:px-8">
            {bodySections.map((section) => (
              <article key={section.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex rounded-full bg-[color:var(--brand-orange)]/10 px-3 py-1 text-xs font-extrabold text-[color:var(--brand-orange)]">
                  {section.icon ?? section.key}
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-950">{section.title ?? heading}</h2>
                <div className="site-prose mt-3 text-sm leading-7" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(section.content) }} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {featuredCourses?.length ? (
        <section className="bg-white py-14">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Featured Courses" title="Popular options" subtitle="These are highlighted from the current API response." align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
