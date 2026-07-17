import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  GraduationCap,
  Megaphone,
  MonitorPlay,
  Network,
  Palette,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { getPublicHome } from "@/lib/api/site";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";
import { SectionTitle } from "@/components/ui/section-title";
import { CourseCard } from "@/components/public/course-card";
import { MentorCard } from "@/components/public/mentor-card";
import { NewsCard } from "@/components/public/news-card";
import { ReviewCard } from "@/components/public/review-card";
import { BatchCard } from "@/components/public/batch-card";
import { LocaleLink } from "@/components/ui/link";
import { EmptyState } from "@/components/ui/empty-state";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CTASection } from "@/components/ui/cta-section";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import { resolveMediaUrl } from "@/lib/media";
import type { CourseSummary, PublicHome } from "@/lib/api/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: "Home | iTechBD Ltd",
    description: "Career-focused IT and creative skills training with mentor guidance, practical projects, and upcoming batches.",
  };
}

function section(data: PublicHome, key: string) {
  return data.page.sections.find((item) => item.key === key);
}

function sectionsByPrefix(data: PublicHome, prefix: string) {
  return data.page.sections.filter((item) => item.key.startsWith(prefix));
}

function firstParagraph(html: string | null | undefined) {
  if (!html) return "";
  const match = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/i);
  return sanitizeCmsHtml(match?.[0] ?? html);
}

function trackIcon(track: string) {
  const lower = track.toLowerCase();
  if (lower.includes("graphic") || lower.includes("design")) return Palette;
  if (lower.includes("marketing") || lower.includes("seo")) return Megaphone;
  if (lower.includes("network") || lower.includes("hardware")) return Network;
  if (lower.includes("server") || lower.includes("hosting")) return Server;
  if (lower.includes("web") || lower.includes("software") || lower.includes("development")) return Code2;
  return BookOpenCheck;
}

function HeroVisual({ courses, locale }: { courses: CourseSummary[]; locale: AppLocale }) {
  const featured = courses.slice(0, 2);

  return (
    <div className="relative min-h-[22rem] lg:min-h-[30rem]">
      <div className="absolute inset-x-6 top-4 h-52 rounded-lg border border-white/14 bg-white/10 shadow-[var(--shadow-soft)] backdrop-blur-md sm:inset-x-12 lg:top-10" />
      <div className="relative ml-auto grid max-w-md gap-4">
        {featured.map((course, index) => {
          const thumbnail = resolveMediaUrl(course.thumbnail_url);
          return (
            <LocaleLink
              key={course.id}
              locale={locale}
              href={`/courses/${course.slug ?? course.id}`}
              className="focus-ring group grid grid-cols-[6.5rem_1fr] gap-4 rounded-lg border border-white/16 bg-white p-3 text-[color:var(--text-heading)] shadow-[var(--shadow-soft)] transition hover:-translate-y-1"
              style={{ marginLeft: index === 1 ? "clamp(0rem, 5vw, 2rem)" : "0" }}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
                {thumbnail ? (
                  <Image src={thumbnail} alt={course.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="120px" priority={index === 0} />
                ) : (
                  <div className="grid h-full place-items-center text-white">
                    <GraduationCap aria-hidden className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="min-w-0 py-1">
                <div className="inline-flex rounded-lg bg-[color:var(--brand-primary-light)] px-2 py-1 text-[0.68rem] font-extrabold text-[color:var(--brand-primary-dark)]">
                  {course.track ?? "Professional Skill"}
                </div>
                <h3 className="mt-2 line-clamp-2 text-base font-black leading-snug">{course.title}</h3>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[color:var(--brand-primary)]">
                  View details
                  <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                </div>
              </div>
            </LocaleLink>
          );
        })}
        <div className="ml-8 rounded-lg border border-white/16 bg-[color:var(--brand-secondary)] p-5 text-white shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/16">
              <ShieldCheck aria-hidden className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white/78">Learning promise</div>
              <div className="text-xl font-black">Project-first training</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicHome(locale);

  const heroTitle = section(data, "hero_primary")?.title ?? "Learn with Experts";
  const heroHighlight = section(data, "hero_emphasis")?.title ?? "Build Real Projects";
  const heroText = firstParagraph(section(data, "hero_paragraph")?.content) || "Career-focused training with mentor guidance, weekly reviews, and portfolio-ready projects.";
  const primaryCta = section(data, "hero_cta_primary");
  const heroReasons = sectionsByPrefix(data, "hero_different_reason_").slice(0, 4);
  const skillTracks = data.course_tracks.length
    ? data.course_tracks.map((track) => ({ title: track.name, content: null as string | null, href: `/courses?track=${encodeURIComponent(track.name)}` }))
    : sectionsByPrefix(data, "home_skill_track_").map((item) => ({ title: item.title ?? item.key, content: item.content, href: "/courses" }));
  const aboutCards = sectionsByPrefix(data, "home_about_card_").slice(0, 3);
  const aboutIntro = firstParagraph(section(data, "home_about_subtitle")?.content);
  const stats = [
    { label: "Courses", value: data.stats.courses, icon: BookOpenCheck },
    { label: "Mentors", value: data.stats.mentors, icon: UsersRound },
    { label: "Batches", value: data.stats.batches, icon: CalendarDays },
    { label: "Students", value: data.stats.students, icon: GraduationCap },
    { label: "Classes", value: data.stats.classes, icon: MonitorPlay },
    { label: "Updates", value: data.stats.updates, icon: Megaphone },
  ];
  const process = [
    { title: "Learn from mentors", text: "Follow a guided path with practical class support.", icon: UsersRound },
    { title: "Practice with reviews", text: "Improve through weekly feedback and hands-on tasks.", icon: BadgeCheck },
    { title: "Build real projects", text: "Create portfolio-ready work tied to your track.", icon: Code2 },
    { title: "Prepare for career", text: "Get direction for jobs, freelancing, and interviews.", icon: BriefcaseBusiness },
  ];

  return (
    <main>
      <section className="hero-pattern relative overflow-hidden bg-[color:var(--text-heading)] text-white">
        <div className="mx-auto grid min-h-[34rem] w-full max-w-7xl gap-10 px-4 py-12 sm:py-16 lg:min-h-[40rem] lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:py-20">
          <div className="reveal-in max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/16 bg-white/10 px-3 py-2 text-xs font-bold uppercase text-white/86">
              <Sparkles aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
              Training Institute - Career-focused
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
              {heroTitle}
              <span className="block text-[color:var(--brand-secondary)]">{heroHighlight}</span>
            </h1>
            <div className="site-prose mt-5 max-w-2xl text-base leading-8 text-white/78 [&_p]:text-white/78" dangerouslySetInnerHTML={{ __html: heroText }} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LocaleLink
                locale={locale}
                href={primaryCta?.button_link ?? "/courses"}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-secondary-dark)]"
              >
                {primaryCta?.button_text ?? "Explore Courses"}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </LocaleLink>
              <LocaleLink
                locale={locale}
                href="/contact"
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-[color:var(--text-heading)]"
              >
                Speak with counselor
              </LocaleLink>
            </div>
            <form action={`/${locale}/courses`} className="mt-8 flex max-w-xl gap-2 rounded-lg border border-white/16 bg-white p-2 shadow-[var(--shadow-soft)]">
              <label htmlFor="home-course-search" className="sr-only">Search courses</label>
              <Search aria-hidden className="ml-2 mt-3 h-5 w-5 shrink-0 text-[color:var(--text-muted)]" />
              <input id="home-course-search" name="search" placeholder="Search course, track, or skill" className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[color:var(--text-heading)] outline-none placeholder:text-[color:var(--text-muted)]" />
              <button type="submit" className="focus-ring rounded-lg bg-[color:var(--brand-primary)] px-4 py-3 text-sm font-extrabold text-white">
                Search
              </button>
            </form>
          </div>
          <HeroVisual courses={data.popular_courses} locale={locale} />
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-6 lg:px-8">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-primary)] p-4 shadow-sm">
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

      {heroReasons.length ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {heroReasons.map((item) => (
                <article key={item.id} className="surface-card p-5">
                  <Target aria-hidden className="h-6 w-6 text-[color:var(--brand-secondary)]" />
                  <h2 className="mt-4 text-lg font-black text-[color:var(--text-heading)]">{item.title}</h2>
                  <div className="site-prose mt-2 text-sm [&_p]:leading-7" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(item.content) }} />
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <SectionTitle
            kicker="Skill Tracks"
            title={section(data, "home_skill_tracks_title")?.title ?? "Browse by career path"}
            subtitle="Choose the track that matches your goal, then filter active courses from the live API."
            align="left"
            action={
              <LocaleLink locale={locale} href="/courses" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg border border-[color:var(--border-default)] px-4 py-2 text-sm font-extrabold text-[color:var(--text-heading)] hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]">
                All courses
                <ArrowRight aria-hidden className="h-4 w-4" />
              </LocaleLink>
            }
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skillTracks.map((track) => {
              const Icon = trackIcon(track.title);
              return (
                <LocaleLink key={track.title} locale={locale} href={track.href} className="focus-ring surface-card group p-5 transition hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/35">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
                    <Icon aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[color:var(--text-heading)]">{track.title}</h3>
                  {track.content ? <div className="site-prose mt-2 line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(track.content) }} /> : null}
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[color:var(--brand-primary)]">
                    Explore
                    <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <SectionTitle kicker="Popular Courses" title="Choose a course and start learning" subtitle="Course cards are loaded from active Laravel API data, including current batches and pricing." align="left" />
          {data.popular_courses.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.popular_courses.slice(0, 6).map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-8" title="No courses available" message="Active courses will appear here when they are published from the backend." />
          )}
        </div>
      </section>

      {data.upcoming_batches.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Upcoming Batches" title="Admission is going on" subtitle="Time-sensitive batch information comes directly from the API." align="left" />
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {data.upcoming_batches.slice(0, 4).map((batch) => (
                <BatchCard key={batch.id} batch={batch} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:px-8">
          <div className="rounded-lg bg-[color:var(--text-heading)] p-6 text-white shadow-[var(--shadow-soft)]">
            <div className="brand-grid rounded-lg border border-white/12 p-6">
              <div className="inline-flex rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white/80">Why iTechBD</div>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{section(data, "home_about_title")?.title ?? "Why Choose iTechBD"}</h2>
              {aboutIntro ? <div className="site-prose mt-4 text-sm [&_p]:text-white/78" dangerouslySetInnerHTML={{ __html: aboutIntro }} /> : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {aboutCards.map((item) => (
              <article key={item.id} className="surface-card p-5">
                <BadgeCheck aria-hidden className="h-6 w-6 text-[color:var(--brand-secondary)]" />
                <h3 className="mt-4 text-lg font-black text-[color:var(--text-heading)]">{item.title}</h3>
                <div className="site-prose mt-2 text-sm" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(item.content) }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <SectionTitle kicker="Learning Process" title="From guided learning to portfolio outcomes" subtitle="A practical flow that reflects the mentor-led, project-first approach already described in the institute content." />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {process.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="surface-card relative p-5">
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
                      <Icon aria-hidden className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-black text-[color:var(--brand-secondary)]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[color:var(--text-heading)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--text-body)]">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {data.mentors.length ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Expert Mentors" title="Learn from industry practitioners" subtitle="Mentors are loaded from the API and linked to their profile pages." align="left" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.mentors.slice(0, 4).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.reviews.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Success Stories" title="What learners say" subtitle="Only approved reviews from the API are shown here." align="left" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {data.reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.latest_news.length ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="News & Updates" title="Latest announcements" subtitle="Published news from the API appears automatically." align="left" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {data.latest_news.map((news) => (
                <NewsCard key={news.id} news={news} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        locale={locale}
        title="Find the right course for your career goal"
        description="Browse active courses, check upcoming batches, or talk to the team before you apply."
        primaryHref="/courses"
        primaryLabel="Browse Courses"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />
    </main>
  );
}
