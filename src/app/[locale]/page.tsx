import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicHome, listStudentCourseCatalog } from "@/lib/api/site";
import { getOptionalCurrentUser } from "@/lib/auth/current-user";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";
import { HomeHeroApply } from "@/components/public/home-hero-apply";
import { HomeBatchCard, HomeCarouselDots, HomeMentorCard, HomeSectionTitle } from "@/components/public/home-section-cards";
import { EmptyState } from "@/components/ui/empty-state";
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

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [data, currentUser] = await Promise.all([
    getPublicHome(locale),
    getOptionalCurrentUser(locale),
  ]);
  const isStudent = currentUser?.type === "student" || currentUser?.roles.some((role) => role.toLowerCase() === "student") || false;
  const studentCatalog = isStudent ? await listStudentCourseCatalog(locale, { per_page: 50 }) : null;
  const applyCourses = studentCatalog?.items ?? data.popular_courses;

  const backedUpMentors = data.mentors.filter((mentor) => !mentor.profile_image_url?.includes("3UhGbshwTkgdD37Gg1dG4aMHoTw1gTeGuVO4CUjm"));
  const { ongoingBatches, upcomingBatches } = splitHomeBatches(data);

  return (
    <main>
      <section className="hero-pattern relative overflow-hidden bg-[color:var(--brand-primary)] py-5 text-white sm:py-6">
        <HomeHeroApply
          courses={applyCourses}
          locale={locale}
          currentUser={isStudent ? currentUser : null}
        />
      </section>

      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <HomeSectionTitle
            kicker="Training Programs"
            title="Ongoing Courses"
            subtitle="Courses currently running with available batches."
          />
          {ongoingBatches.length ? (
            <>
              <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {ongoingBatches.slice(0, 6).map((batch) => (
                  <HomeBatchCard key={batch.id} batch={batch} locale={locale} />
                ))}
              </div>
              {ongoingBatches.length > 3 ? <HomeCarouselDots /> : null}
            </>
          ) : (
            <EmptyState className="mt-8" title="No ongoing courses" message="Started courses will appear here when a new batch begins." />
          )}
        </div>
      </section>

      <section className="bg-[color:var(--surface-secondary)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <HomeSectionTitle
            kicker="Next Batches"
            title="Upcoming Courses"
            subtitle="Choose an upcoming batch and reserve your enrollment before seats are filled."
          />
          {upcomingBatches.length ? (
            <div className={upcomingBatches.length === 1 ? "mx-auto mt-8 w-full max-w-sm" : "mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"}>
              {upcomingBatches.slice(0, 3).map((batch) => (
                <HomeBatchCard key={batch.id} batch={batch} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState className="mx-auto mt-8 max-w-xl" title="No upcoming courses" message="Upcoming batches will appear here after they are scheduled." />
          )}
        </div>
      </section>

      {backedUpMentors.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <HomeSectionTitle
              kicker="Expert Mentors"
              title="Meet Our Expert Mentors"
              subtitle="Learn from experienced instructors who guide learners through practical, career-focused training."
            />
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {backedUpMentors.slice(0, 8).map((mentor) => (
                <HomeMentorCard key={mentor.id} mentor={mentor} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
