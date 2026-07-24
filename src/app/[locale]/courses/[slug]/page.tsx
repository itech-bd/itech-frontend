import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpenCheck, CalendarDays, MonitorPlay, WalletCards } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { CardSlider } from "@/components/ui/card-slider";
import { CourseCard } from "@/components/public/course-card";
import { BatchCard } from "@/components/public/batch-card";
import { PageHero } from "@/components/ui/page-hero";
import { LocaleLink } from "@/components/ui/link";
import { getPublicCourse } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/formatting";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import { resolveMediaUrl } from "@/lib/media";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `${slug} | iTechBD Ltd` };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicCourse(locale, slug);
  const course = data.course;
  const thumbnail = resolveMediaUrl(course.thumbnail_url);
  const priceRows = course.pricing
    ? [
        { label: "Regular", old: course.pricing.old_price, current: course.pricing.discount_price ?? course.pricing.old_price },
        { label: "Online", old: course.pricing.online_old_price, current: course.pricing.online_discount_price ?? course.pricing.online_old_price },
        { label: "Offline", old: course.pricing.offline_old_price, current: course.pricing.offline_discount_price ?? course.pricing.offline_old_price },
      ].filter((item) => item.current || item.old)
    : [];
  const lowest = priceRows.map((item) => item.current ?? item.old ?? 0).filter(Boolean).sort((a, b) => a - b)[0] ?? null;

  return (
    <main>
      <PageHero
        locale={locale}
        kicker={course.track ?? "Course"}
        title={course.title}
        subtitle={<div className="site-prose line-clamp-5" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(course.description) }} />}
        primaryHref={`/checkout/courses/${course.slug ?? course.id}`}
        primaryLabel="Apply for admission"
        secondaryHref="/courses"
        secondaryLabel="All courses"
      >
        <div className="surface-card overflow-hidden p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {thumbnail ? (
              <Image src={thumbnail} alt={course.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" priority unoptimized />
            ) : (
              <div className="brand-grid grid h-full place-items-center p-8 text-center text-2xl font-black text-white">{course.title}</div>
            )}
          </div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_22rem] lg:px-8">
          <div className="min-w-0 space-y-8">
            {priceRows.length ? (
              <section className="surface-card p-5">
                <SectionTitle kicker="Course Fee" title="Transparent pricing" subtitle="Current admission fees and available discounts are shown clearly." align="left" />
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {priceRows.map((item) => (
                    <div key={item.label} className="rounded-lg bg-[color:var(--surface-secondary)] p-4">
                      <div className="text-sm font-bold text-[color:var(--text-muted)]">{item.label}</div>
                      <div className="mt-2 text-xl font-black text-[color:var(--text-heading)]">{formatCurrency(item.current ?? item.old ?? 0, locale)}</div>
                      {item.old && item.current && item.old > item.current ? (
                        <div className="mt-1 text-sm font-bold text-[color:var(--text-muted)] line-through">{formatCurrency(item.old, locale)}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="surface-card p-5 lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col lg:overflow-hidden">
              <SectionTitle kicker="Overview" title="What you will learn" align="left" />
              <article className="site-prose mt-5 min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(course.description) }} />
            </section>

            {(course.batches ?? []).length ? (
              <section>
                <SectionTitle kicker="Available Batches" title="Choose an upcoming batch" subtitle="Review batch schedule, mentor guidance, and class timing before you apply." align="left" />
                <div className="mt-6 grid gap-5">
                  {(course.batches ?? []).map((batch) => (
                    <BatchCard key={batch.id} batch={batch} locale={locale} course={course} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card overflow-hidden">
              <div className="bg-[color:var(--text-heading)] p-5 text-white">
                <div className="flex items-center gap-3">
                  <WalletCards aria-hidden className="h-6 w-6 text-[color:var(--brand-secondary)]" />
                  <div>
                    <div className="text-sm font-bold text-white/72">Admission summary</div>
                    <div className="text-xl font-black">{lowest ? formatCurrency(lowest, locale) : "Contact for fee"}</div>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 p-5 text-sm">
                <div className="flex items-center gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3">
                  <BookOpenCheck aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
                  <span className="font-bold text-[color:var(--text-heading)]">{course.track ?? "Professional Skill"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3">
                  <CalendarDays aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
                  <span className="font-bold text-[color:var(--text-heading)]">{course.batches?.length ?? 0} available batch{(course.batches?.length ?? 0) === 1 ? "" : "es"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3">
                  <MonitorPlay aria-hidden className="h-4 w-4 text-[color:var(--brand-accent)]" />
                  <span className="font-bold text-[color:var(--text-heading)]">Online and offline options when available</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3">
                  <BadgeCheck aria-hidden className="h-4 w-4 text-[color:var(--success)]" />
                  <span className="font-bold text-[color:var(--text-heading)]">Mentor-led practical training</span>
                </div>
                <LocaleLink
                  locale={locale}
                  href={`/checkout/courses/${course.slug ?? course.id}`}
                  className="focus-ring mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
                >
                  Apply Now
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </LocaleLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {data.related_courses.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Related Courses" title="More options for you" align="left" />
            <CardSlider className="mt-8" controlsLabel="related courses">
              {data.related_courses.map((item) => (
                <CourseCard key={item.id} course={item} locale={locale} />
              ))}
            </CardSlider>
          </div>
        </section>
      ) : null}
    </main>
  );
}
