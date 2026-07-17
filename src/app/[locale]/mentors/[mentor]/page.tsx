import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { CourseCard } from "@/components/public/course-card";
import { PageHero } from "@/components/ui/page-hero";
import { getPublicMentor } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import { resolveMediaUrl } from "@/lib/media";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; mentor: string }> }): Promise<Metadata> {
  const { locale, mentor } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `${mentor} | iTechBD Ltd` };
}

export default async function MentorDetailPage({ params }: { params: Promise<{ locale: string; mentor: string }> }) {
  const { locale, mentor } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicMentor(locale, mentor);
  const profileImage = resolveMediaUrl(data.mentor.profile_image_url);

  return (
    <main>
      <PageHero
        locale={locale}
        kicker={data.mentor.topic ?? "Mentor"}
        title={data.mentor.name}
        subtitle={<div className="site-prose line-clamp-5" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(data.mentor.bio) }} />}
        primaryHref="/courses"
        primaryLabel="View courses"
        secondaryHref="/mentors"
        secondaryLabel="All mentors"
      >
        <div className="surface-card mx-auto max-w-sm p-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {profileImage ? (
              <Image src={profileImage} alt={data.mentor.name} fill className="object-cover" sizes="(max-width: 1024px) 80vw, 320px" priority />
            ) : (
              <div className="brand-grid grid h-full place-items-center text-white">
                <UserRound aria-hidden className="h-20 w-20" />
              </div>
            )}
          </div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
          <article className="site-prose surface-card p-5" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(data.mentor.bio) }} />
        </div>
      </section>

      {data.related_courses.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Related Courses" title="Courses connected with this mentor" align="left" />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.related_courses.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
