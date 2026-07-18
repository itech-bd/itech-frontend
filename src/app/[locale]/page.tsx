import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Code2,
  Megaphone,
  MonitorPlay,
  Network,
  Palette,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { getPublicHome } from "@/lib/api/site";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";
import { SectionTitle } from "@/components/ui/section-title";
import { MentorCard } from "@/components/public/mentor-card";
import { BatchCard } from "@/components/public/batch-card";
import { LocaleLink } from "@/components/ui/link";
import { EmptyState } from "@/components/ui/empty-state";
import { CTASection } from "@/components/ui/cta-section";
import { CardSlider } from "@/components/ui/card-slider";
import { resolveMediaUrl } from "@/lib/media";
import { formatNumber } from "@/lib/formatting";
import type { BatchSummary, CourseSummary, PublicHome } from "@/lib/api/types";

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

type HomeBatch = BatchSummary & {
  course?: CourseSummary | null;
};

function priceLabel(course: CourseSummary) {
  const price =
    course.pricing?.online_discount_price ??
    course.pricing?.offline_discount_price ??
    course.pricing?.discount_price ??
    course.pricing?.old_price ??
    null;

  return price ? `BDT ${Number(price).toLocaleString("en-US")}` : "Contact office";
}

function countLabel(value: number, locale: AppLocale) {
  return value > 0 ? `${formatNumber(value, locale)}+` : "0";
}

function parseDateParts(value: string | null | undefined) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month: month - 1, day };
}

function parseClock(value: string | null | undefined) {
  if (!value) return { hours: 0, minutes: 0 };
  const match = value.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!match) return { hours: 0, minutes: 0 };

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const meridiem = match[3]?.toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) {
    return { hours: 0, minutes: 0 };
  }

  if (meridiem) {
    hours %= 12;
    if (meridiem === "PM") hours += 12;
  }

  return { hours: Math.min(Math.max(hours, 0), 23), minutes };
}

function batchStartAt(batch: BatchSummary) {
  const parts = parseDateParts(batch.start_date);
  if (!parts) return null;
  const clock = parseClock(batch.class_time);
  return new Date(parts.year, parts.month, parts.day, clock.hours, clock.minutes);
}

function batchEndAt(batch: BatchSummary) {
  const parts = parseDateParts(batch.end_date);
  if (!parts) return null;
  return new Date(parts.year, parts.month, parts.day, 23, 59, 59, 999);
}

function mergeBatch(target: Map<number, HomeBatch>, batch: BatchSummary, course?: CourseSummary | null) {
  const existing = target.get(batch.id);
  target.set(batch.id, {
    ...existing,
    ...batch,
    course: batch.course ?? existing?.course ?? course ?? null,
  });
}

function collectHomeBatches(data: PublicHome) {
  const batches = new Map<number, HomeBatch>();

  (data.ongoing_batches ?? []).forEach((batch) => mergeBatch(batches, batch));
  data.upcoming_batches.forEach((batch) => mergeBatch(batches, batch));
  data.popular_courses.forEach((course) => {
    course.batches?.forEach((batch) => mergeBatch(batches, batch, course));
  });

  return Array.from(batches.values());
}

function splitHomeBatches(data: PublicHome) {
  const now = new Date();
  const ongoing: HomeBatch[] = [];
  const upcoming: HomeBatch[] = [];

  collectHomeBatches(data).forEach((batch) => {
    const status = batch.status.toLowerCase();
    const startAt = batchStartAt(batch);
    const endAt = batchEndAt(batch);

    if (status === "completed" || (endAt && endAt.getTime() < now.getTime())) {
      return;
    }

    if (!startAt) {
      (status === "running" ? ongoing : upcoming).push(batch);
      return;
    }

    if (startAt.getTime() > now.getTime()) {
      upcoming.push({ ...batch, status: "upcoming" });
      return;
    }

    ongoing.push({ ...batch, status: "running" });
  });

  const startTime = (batch: BatchSummary) => batchStartAt(batch)?.getTime() ?? 0;

  return {
    ongoingBatches: ongoing.sort((a, b) => startTime(b) - startTime(a)),
    upcomingBatches: upcoming.sort((a, b) => startTime(a) - startTime(b)),
  };
}

function HomeStats({
  data,
  mentorCount,
  ongoingBatchCount,
  upcomingBatchCount,
  locale,
}: {
  data: PublicHome;
  mentorCount: number;
  ongoingBatchCount: number;
  upcomingBatchCount: number;
  locale: AppLocale;
}) {
  const stats = [
    {
      label: "Ongoing Courses",
      value: ongoingBatchCount,
      icon: BookOpenCheck,
    },
    {
      label: "Upcoming Courses",
      value: upcomingBatchCount,
      icon: CalendarDays,
    },
    {
      label: "Practical Classes",
      value: data.stats.classes,
      icon: MonitorPlay,
    },
    {
      label: "Skilled Mentors",
      value: mentorCount || data.stats.mentors,
      icon: UsersRound,
    },
  ];

  return (
    <section className="border-y border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group rounded-xl border border-[color:var(--border-default)] bg-white px-5 py-5 text-center shadow-[0_16px_35px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/35"
              >
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary)] transition group-hover:bg-[color:var(--brand-secondary)] group-hover:text-white">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
                <div className="mt-3 text-3xl font-black tracking-tight text-[color:var(--text-heading)] sm:text-4xl">
                  {countLabel(item.value, locale)}
                </div>
                <div className="mt-1 text-sm font-black text-[color:var(--text-heading)]">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function resolveTracks(data: PublicHome) {
  if (data.course_tracks.length) return data.course_tracks;

  const grouped = new Map<string, number[]>();
  data.popular_courses.forEach((course) => {
    const name = course.track || "Professional Courses";
    grouped.set(name, [...(grouped.get(name) ?? []), course.id]);
  });

  return Array.from(grouped, ([name, course_ids]) => ({ name, course_ids }));
}

function TrackShowcase({ data, locale }: { data: PublicHome; locale: AppLocale }) {
  const tracks = resolveTracks(data).slice(0, 6);
  if (!tracks.length) return null;

  const icons = [Megaphone, Palette, Code2, Network, Clapperboard, ShieldCheck];
  const tones = [
    "bg-[#fff1e8] text-[color:var(--brand-secondary)]",
    "bg-[#eef4ff] text-[color:var(--brand-primary)]",
    "bg-[#fff7de] text-[#b76a00]",
    "bg-[#ecfbff] text-[#087ea4]",
    "bg-[#fff0f0] text-[#d73821]",
    "bg-[#eefcf3] text-[#178553]",
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7f0_0%,#fff_78%)] py-12 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(255,122,26,0.16),transparent_66%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            kicker="Skill Tracks"
            title="Explore career-ready tracks"
            subtitle="Explore skill areas that match your career goal and learning plan."
            align="left"
          />
          <LocaleLink
            locale={locale}
            href="/courses"
            className="focus-ring inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-[color:var(--brand-secondary)]/35 bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--brand-secondary)] shadow-sm transition hover:bg-[color:var(--brand-secondary)] hover:text-white"
          >
            Browse all courses
            <ChevronRight aria-hidden className="h-4 w-4" />
          </LocaleLink>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -left-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[color:var(--brand-secondary)] bg-white text-[color:var(--brand-secondary)] shadow-[var(--shadow-card)] lg:grid">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <div aria-hidden className="absolute -right-5 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--brand-secondary)] text-white shadow-[var(--shadow-card)] lg:grid">
            <ChevronRight className="h-5 w-5" />
          </div>

          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {tracks.map((track, index) => {
              const Icon = icons[index % icons.length];
              return (
                <LocaleLink
                  key={track.name}
                  locale={locale}
                  href={`/courses?track=${encodeURIComponent(track.name)}`}
                  className="focus-ring group flex min-h-44 min-w-[15rem] snap-start flex-col items-center justify-center rounded-2xl border border-white bg-white p-6 text-center shadow-[0_16px_35px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/35"
                >
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${tones[index % tones.length]} transition duration-300 group-hover:scale-110`}>
                    <Icon aria-hidden className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-black leading-tight text-[color:var(--text-heading)]">{track.name}</h3>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[color:var(--brand-secondary)]">
                    {countLabel(track.course_ids.length, locale)} course{track.course_ids.length === 1 ? "" : "s"}
                  </p>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApplyForm({ courses, locale }: { courses: CourseSummary[]; locale: AppLocale }) {
  return (
    <form action={`/${locale}/register`} className="rounded-lg bg-white p-5 text-[color:var(--text-heading)] shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-6">
      <h2 className="text-2xl font-black">Apply for a course</h2>
      <p className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">Get instant access to upcoming training courses</p>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
          Select Course
          <select name="course" className="min-h-11 rounded-lg border border-[color:var(--border-default)] bg-white px-3 text-sm font-semibold text-[color:var(--text-body)] outline-none focus:border-[color:var(--brand-primary)]">
            <option value="">--Select Course--</option>
            {courses.map((course) => (
              <option key={course.id} value={course.slug ?? course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
          Select Batch
          <select name="batch" className="min-h-11 rounded-lg border border-[color:var(--border-default)] bg-white px-3 text-sm font-semibold text-[color:var(--text-body)] outline-none focus:border-[color:var(--brand-primary)]">
            <option value="">--Select Batch--</option>
            {courses.flatMap((course) =>
              (course.batches ?? []).map((batch) => (
                <option key={`${course.id}-${batch.id}`} value={batch.id}>
                  {batch.name}
                </option>
              )),
            )}
          </select>
        </label>

        <div className="rounded-lg bg-[color:var(--surface-secondary)] px-3 py-3 text-xs font-bold text-[color:var(--text-muted)]">
          Course Type
          <div className="mt-1 text-sm font-black text-[color:var(--brand-primary)]">Online / Offline admission available</div>
        </div>

        <label className="sr-only" htmlFor="apply-name">Your name</label>
        <input id="apply-name" name="name" placeholder="Write Your Name" className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]" />

        <label className="sr-only" htmlFor="apply-email">Your email</label>
        <input id="apply-email" name="email" type="email" placeholder="Write Your Email" className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]" />

        <label className="sr-only" htmlFor="apply-phone">Mobile number</label>
        <input id="apply-phone" name="phone" placeholder="Write Your Mobile Number" className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]" />

        <button type="submit" className="focus-ring mt-1 min-h-12 rounded-lg bg-[color:var(--brand-secondary)] px-5 text-sm font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)]">
          APPLY NOW
        </button>
      </div>
    </form>
  );
}

function HeroPromo({ locale, courses }: { locale: AppLocale; courses: CourseSummary[] }) {
  const heroImage = resolveMediaUrl("/media/home/itechbd-hero.webp");

  return (
    <div className="rounded-lg bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-5">
      <div className="relative aspect-[16/8.7] overflow-hidden rounded-lg bg-[color:var(--brand-primary-light)]">
        {heroImage ? (
          <Image src={heroImage} alt="iTechBD professional training" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 760px" priority unoptimized />
        ) : null}
      </div>
      <div className="px-2 py-7 text-center">
        <h1 className="text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">Build practical IT skills with iTechBD</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-body)]">
          Explore career-focused computer training, hands-on classes, expert mentors, and updated learning resources designed for students and professionals.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <LocaleLink locale={locale} href="/courses" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-4 py-2 text-sm font-black text-white">
            <BookOpenCheck aria-hidden className="h-4 w-4" />
            Courses
          </LocaleLink>
          <LocaleLink locale={locale} href="/solutions/it-solutions" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--surface-secondary)] px-4 py-2 text-sm font-black text-[color:var(--text-heading)]">
            <CheckCircle2 aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
            Services
          </LocaleLink>
          <LocaleLink locale={locale} href="/news" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--brand-primary-light)] px-4 py-2 text-sm font-black text-[color:var(--brand-primary)]">
            <CalendarDays aria-hidden className="h-4 w-4" />
            News & Updates
          </LocaleLink>
        </div>
      </div>
      <div className="grid gap-3 border-t border-[color:var(--border-default)] pt-4 sm:grid-cols-2">
        {courses.slice(0, 2).map((course) => (
          <LocaleLink key={course.id} locale={locale} href={`/courses/${course.slug ?? course.id}`} className="focus-ring rounded-lg bg-[color:var(--surface-secondary)] p-3 text-left">
            <div className="line-clamp-1 text-xs font-black text-[color:var(--brand-primary)]">{course.track ?? "Professional Skill"}</div>
            <div className="mt-1 line-clamp-1 text-sm font-black text-[color:var(--text-heading)]">{course.title}</div>
            <div className="mt-1 text-xs font-bold text-[color:var(--brand-secondary)]">{priceLabel(course)}</div>
          </LocaleLink>
        ))}
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

  const backedUpMentors = data.mentors.filter((mentor) => !mentor.profile_image_url?.includes("3UhGbshwTkgdD37Gg1dG4aMHoTw1gTeGuVO4CUjm"));
  const { ongoingBatches, upcomingBatches } = splitHomeBatches(data);

  return (
    <main>
      <section className="hero-pattern relative overflow-hidden bg-[color:var(--brand-primary)] py-8 text-white sm:py-10">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 px-4 lg:grid-cols-[1.5fr_.9fr] lg:px-8">
          <div className="min-w-0">
            <HeroPromo locale={locale} courses={data.popular_courses} />
          </div>
          <div className="min-w-0">
            <ApplyForm courses={data.popular_courses} locale={locale} />
          </div>
        </div>
      </section>

      <HomeStats
        data={data}
        mentorCount={backedUpMentors.length}
        ongoingBatchCount={ongoingBatches.length}
        upcomingBatchCount={upcomingBatches.length}
        locale={locale}
      />

      <TrackShowcase data={data} locale={locale} />

      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <SectionTitle kicker="Training Programs" title="Ongoing Courses" subtitle="Courses with batches that have already started and are currently active." />
          {ongoingBatches.length ? (
            <CardSlider className="mt-9" controlsLabel="ongoing courses">
              {ongoingBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} locale={locale} />
              ))}
            </CardSlider>
          ) : (
            <EmptyState className="mt-8" title="No ongoing courses" message="Started courses will appear here when a new batch begins." />
          )}
        </div>
      </section>

      {upcomingBatches.length ? (
        <section className="bg-[color:var(--surface-secondary)] py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Next Batches" title="Upcoming Courses" subtitle="Plan ahead and reserve your seat before the next batch begins." />
            <CardSlider className="mt-9" controlsLabel="upcoming courses">
              {upcomingBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} locale={locale} />
              ))}
            </CardSlider>
          </div>
        </section>
      ) : null}

      {backedUpMentors.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Expert Mentors" title="Meet Our Expert Mentors" subtitle="Learn from experienced instructors who guide learners through practical, career-focused training." />
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {backedUpMentors.slice(0, 8).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        locale={locale}
        title="Find the right course for your career goal"
        description="Browse active courses, check available batches, or talk to the team before you apply."
        primaryHref="/courses"
        primaryLabel="Browse Courses"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
      />
    </main>
  );
}
