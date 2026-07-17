import Image from "next/image";
import { BadgeCheck, BookOpenCheck, CalendarDays, ImageIcon, Megaphone, UsersRound } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { PageHero } from "@/components/ui/page-hero";
import { CTASection } from "@/components/ui/cta-section";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import { resolveMediaUrl } from "@/lib/media";
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
  const heroImage = resolveMediaUrl(hero?.image_url);
  const bodySections = data.page.sections.slice(1);
  const stats = data.stats
    ? [
        { label: "Courses", value: data.stats.courses, icon: BookOpenCheck },
        { label: "Mentors", value: data.stats.mentors, icon: UsersRound },
        { label: "Batches", value: data.stats.batches, icon: CalendarDays },
        { label: "Updates", value: data.stats.updates, icon: Megaphone },
      ]
    : [];

  return (
    <main>
      <PageHero
        locale={locale}
        kicker={data.page.slug.replace(/-/g, " ")}
        title={hero?.title ?? heading}
        subtitle={<div className="site-prose" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(hero?.content ?? fallbackDescription ?? "") }} />}
        primaryHref={hero?.button_link ?? "/courses"}
        primaryLabel={hero?.button_text ?? "Explore Courses"}
        secondaryHref="/contact"
        secondaryLabel="Contact team"
      >
        <div className="surface-card overflow-hidden p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {heroImage ? (
              <Image src={heroImage} alt={hero?.title ?? heading} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" priority />
            ) : (
              <div className="brand-grid grid h-full place-items-center text-white">
                <ImageIcon aria-hidden className="h-14 w-14" />
              </div>
            )}
          </div>
        </div>
      </PageHero>

      {stats.length ? (
        <section className="bg-white py-10">
          <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-[color:var(--border-default)] bg-white p-4 shadow-sm">
                  <Icon aria-hidden className="h-5 w-5 text-[color:var(--brand-primary)]" />
                  <div className="mt-3 text-2xl font-black text-[color:var(--text-heading)]">
                    <AnimatedCounter value={item.value} locale={locale} />
                  </div>
                  <div className="text-sm font-bold text-[color:var(--text-muted)]">{item.label}</div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {bodySections.length ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 md:grid-cols-2 lg:px-8">
            {bodySections.map((item) => {
              const image = resolveMediaUrl(item.image_url);
              return (
                <article key={item.id} className="surface-card overflow-hidden">
                  {image ? (
                    <div className="relative aspect-[16/9] bg-[color:var(--surface-secondary)]">
                      <Image src={image} alt={item.title ?? heading} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-xs font-extrabold text-[color:var(--brand-primary-dark)]">
                      <BadgeCheck aria-hidden className="h-4 w-4" />
                      {item.icon ?? item.key}
                    </div>
                    <h2 className="mt-4 text-2xl font-black leading-tight text-[color:var(--text-heading)]">{item.title ?? heading}</h2>
                    <div className="site-prose mt-3 text-sm leading-7" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(item.content) }} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {featuredCourses?.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Featured Courses" title="Popular options" subtitle="These are highlighted from the current API response." align="left" />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        locale={locale}
        title="Need help choosing the right path?"
        description="Talk with the team and get guidance before you apply."
        primaryHref="/courses"
        primaryLabel="Browse Courses"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />
    </main>
  );
}
