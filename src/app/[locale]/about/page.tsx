import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  Layers3,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { CourseCard } from "@/components/public/course-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CardSlider } from "@/components/ui/card-slider";
import { CTASection } from "@/components/ui/cta-section";
import { LocaleLink } from "@/components/ui/link";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublicPage } from "@/lib/api/site";
import type { PublicPageSection } from "@/lib/api/types";
import { formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { sanitizeCmsHtml } from "@/lib/sanitize";

type AboutIcon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: "About | iTechBD Ltd",
    description: "Learn about iTechBD Ltd, our practical IT training approach, mentors, and learning outcomes.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const currentLocale = locale;

  const data = await getPublicPage(currentLocale, "about");
  const sections = data.page.sections;
  const hero = findSection(sections, "hero");
  const intro = findSection(sections, "about_intro");
  const mission = findSection(sections, "about_mission");
  const vision = findSection(sections, "about_vision");
  const outcomes = findSection(sections, "about_stats_title");
  const cta = findSection(sections, "about_cta");
  const values = sections.filter((section) => section.key.startsWith("about_value_"));
  const outcomeStats = sections.filter((section) => section.key.startsWith("about_stat_"));
  const featuredCourses = data.featured_courses ?? [];

  const milestoneStats = data.stats
    ? [
        { label: "Courses", value: data.stats.courses, icon: BookOpenCheck },
        { label: "Batches", value: data.stats.batches, icon: CalendarDays },
        { label: "Practical Classes", value: data.stats.classes, icon: Award },
        { label: "Skilled Mentors", value: data.stats.mentors, icon: UsersRound },
      ]
    : [];

  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-secondary))]" />
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[color:var(--brand-primary-light)] blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-[color:var(--surface-tint)] blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--surface-tint)] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">
              <Sparkles aria-hidden className="h-4 w-4" />
              About iTechBD
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] text-[color:var(--text-heading)] sm:text-5xl lg:text-6xl">
              {hero?.title ?? "About Us"}
            </h1>
            <div
              className="site-prose mt-5 max-w-2xl text-base leading-8 text-[color:var(--text-body)]"
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(
                  hero?.content ??
                    "<p>Learn more about iTechBD Ltd, our mission, and how we help learners build practical skills.</p>",
                ),
              }}
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LocaleLink
                locale={currentLocale}
                href={cta?.button_link ?? "/courses"}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-secondary-dark)]"
              >
                {cta?.button_text ?? "Explore Courses"}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </LocaleLink>
              <LocaleLink
                locale={currentLocale}
                href="/contact"
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
              >
                Talk to us
              </LocaleLink>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-lg bg-[color:var(--brand-secondary)]/15 lg:block" />
            <div className="surface-card relative overflow-hidden p-5 sm:p-6">
              <div className="rounded-lg bg-[linear-gradient(135deg,var(--brand-primary-deep),var(--brand-primary))] p-5 text-white sm:p-7">
                <div className="inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-xs font-black uppercase tracking-[0.1em]">
                  <TrendingUp aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
                  Learning outcomes
                </div>
                <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                  {outcomes?.title ?? "Practical progress you can measure"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  {plainText(outcomes?.content) || "Skills you can demonstrate through guided practice."}
                </p>
              </div>
              {outcomeStats.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {outcomeStats.map((item, index) => {
                    const Icon = outcomeIcon(index);
                    return (
                      <div key={item.id} className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] p-4">
                        <Icon aria-hidden className="h-5 w-5 text-[color:var(--brand-primary)]" />
                        <h3 className="mt-3 text-lg font-black text-[color:var(--text-heading)]">{item.title}</h3>
                        {item.content ? (
                          <div
                            className="site-prose mt-1 text-sm leading-6"
                            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(item.content) }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {milestoneStats.length ? (
        <section className="-mt-8 pb-10">
          <div className="relative mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {milestoneStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="surface-card p-5 text-center transition hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary)]">
                    <Icon aria-hidden className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-3xl font-black text-[color:var(--text-heading)]">
                    <AnimatedCounter value={item.value} locale={currentLocale} suffix="+" />
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-[color:var(--text-heading)]">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_.95fr] lg:items-stretch">
            <article className="surface-card overflow-hidden p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand-primary-light)] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-primary-dark)]">
                <BadgeCheck aria-hidden className="h-4 w-4" />
                Our story
              </div>
              <h2 className="mt-5 text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">
                {intro?.title ?? "Who we are"}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--text-body)]">
                {sectionText(
                  intro,
                  "iTechBD helps learners build job-ready IT skills through structured modules, hands-on practice, and mentor guidance.",
                )}
              </p>
              <div className="mt-8 rounded-lg border border-[color:var(--brand-secondary)]/20 bg-[color:var(--surface-tint)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-[color:var(--brand-secondary)]">
                    <GraduationCap aria-hidden className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[color:var(--text-heading)]">Practical learning path</h3>
                    <p className="mt-1 text-sm leading-7 text-[color:var(--text-body)]">
                      Structured modules, hands-on projects, mentor feedback, and career-ready preparation in one clear journey.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              {[mission, vision].filter(isSection).map((item, index) => {
              const Icon = index === 0 ? Target : Route;
              return (
                <article key={item.id} className="surface-card p-6 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary)]">
                      <Icon aria-hidden className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">
                        {index === 0 ? "Purpose" : "Future focus"}
                      </p>
                      <h3 className="text-2xl font-black leading-tight text-[color:var(--text-heading)]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--text-body)]">{sectionText(item)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          </div>

          {values.length ? (
            <div className="surface-card mt-8 overflow-hidden">
              <div className="grid gap-4 border-b border-[color:var(--border-default)] bg-white p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--surface-tint)] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">
                    <Sparkles aria-hidden className="h-4 w-4" />
                    Learner benefits
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">
                    How iTechBD helps learners grow
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-body)] lg:justify-self-end">
                  Practical guidance, portfolio-focused projects, and career support are organized into a clear path so learners know what to do next.
                </p>
              </div>

              <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
                {values.map((item, index) => {
                  const Icon = valueIcon(item.key, index);
                  return (
                    <article key={item.id} className="border-b border-[color:var(--border-default)] bg-white p-6 transition hover:bg-[color:var(--surface-secondary)] md:border-r xl:[&:nth-child(3n)]:border-r-0">
                      <div className="flex items-start gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
                          <Icon aria-hidden className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[color:var(--text-heading)]">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[color:var(--text-body)]">{sectionText(item)}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {featuredCourses.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle
              kicker="Training Programs"
              title="Courses built around real outcomes"
              subtitle={`Choose from ${formatNumber(featuredCourses.length, currentLocale)} active programs with clear fees, schedules, and practical skill tracks.`}
            />
            <CardSlider className="mt-8" controlsLabel="training programs">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} locale={currentLocale} />
              ))}
            </CardSlider>
          </div>
        </section>
      ) : null}

      <CTASection
        locale={currentLocale}
        title={cta?.title ?? "Ready to start learning?"}
        description={plainText(cta?.content) || "Explore courses, pick a skill track, and start building your portfolio with mentor support."}
        primaryHref={cta?.button_link ?? "/courses"}
        primaryLabel={cta?.button_text ?? "Explore Courses"}
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />
    </main>
  );
}

function findSection(sections: PublicPageSection[], key: string) {
  return sections.find((section) => section.key === key);
}

function isSection(section: PublicPageSection | undefined): section is PublicPageSection {
  return Boolean(section);
}

function sectionText(section: PublicPageSection | undefined, fallback = "") {
  if (!section) return fallback;
  const improvedCopy: Record<string, string> = {
    about_intro:
      "iTechBD helps learners build job-ready IT skills through structured modules, hands-on practice, and mentor guidance. The focus is simple: learn clearly, practice consistently, and become confident enough for real work.",
    about_mission:
      "Our mission is to make skill development practical, organized, and outcome-focused, so every learner can build real projects and grow with confidence.",
    about_vision:
      "Our vision is to create a strong community of job-ready professionals and freelancers through portfolio-first learning and practical career preparation.",
    about_value_1:
      "Learn with experienced mentors through guided classes, reviews, and step-by-step support.",
    about_value_2:
      "Build practical assignments and projects that show what you can actually do.",
    about_value_3:
      "Get direction on CV preparation, interview practice, and choosing the right career path.",
    about_value_4:
      "Practice profile setup, proposal writing, and client communication for freelance work.",
    about_value_5:
      "Follow a clear roadmap with milestones, tasks, and regular progress checks.",
    about_value_6:
      "Stay consistent with peer support, check-ins, and a learning environment that keeps you moving.",
  };

  return improvedCopy[section.key] ?? plainText(section.content) ?? fallback;
}

function plainText(value: string | null | undefined) {
  if (!value) return "";
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&mdash;|&ndash;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function outcomeIcon(index: number): AboutIcon {
  return [GraduationCap, BriefcaseBusiness, CalendarDays, Award][index] ?? Sparkles;
}

function valueIcon(key: string, index: number): AboutIcon {
  const icons: Record<string, AboutIcon> = {
    about_value_1: UsersRound,
    about_value_2: Layers3,
    about_value_3: BriefcaseBusiness,
    about_value_4: Handshake,
    about_value_5: Route,
    about_value_6: ClipboardCheck,
  };

  return icons[key] ?? [UsersRound, Layers3, BriefcaseBusiness, Handshake, Route, ClipboardCheck][index] ?? Sparkles;
}
