"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { ApplyForm, courseOptionValue } from "@/components/public/apply-form";
import { LocaleLink } from "@/components/ui/link";
import type { AuthUser, BatchSummary, CourseSummary } from "@/lib/api/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";
import { coursePlainSummary, extractTotalClasses } from "@/lib/rich-text";

type HomeHeroApplyProps = {
  courses: CourseSummary[];
  locale: AppLocale;
  currentUser?: AuthUser | null;
};

function hasPrice(value: number | null | undefined) {
  return value !== null && value !== undefined;
}

function courseModeLabels(course: CourseSummary) {
  const labels: string[] = [];

  if (hasPrice(course.pricing?.online_discount_price) || hasPrice(course.pricing?.online_old_price)) {
    labels.push("Online Course");
  }

  if (hasPrice(course.pricing?.offline_discount_price) || hasPrice(course.pricing?.offline_old_price)) {
    labels.push("Offline Course");
  }

  return labels.length ? labels : ["Admission Open"];
}

function primaryCourseMode(course: CourseSummary): "online" | "offline" | "general" {
  if (hasPrice(course.pricing?.online_discount_price) || hasPrice(course.pricing?.online_old_price)) return "online";
  if (hasPrice(course.pricing?.offline_discount_price) || hasPrice(course.pricing?.offline_old_price)) return "offline";
  return "general";
}

function preferredBatch(course: CourseSummary) {
  const batches = course.batches ?? [];
  return batches.find((batch) => batch.status.toLowerCase() !== "completed") ?? batches[0] ?? null;
}

function courseDescription(course: CourseSummary) {
  return coursePlainSummary(
    course.description,
    course.title,
    `Build practical ${course.title} skills through mentor-guided classes, real practice, and career-focused training support.`,
  );
}

function monthDuration(batch: BatchSummary | null) {
  if (!batch?.start_date || !batch.end_date) return "3 Months";

  const startAt = new Date(batch.start_date);
  const endAt = new Date(batch.end_date);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
    return "3 Months";
  }

  const months = Math.max(1, Math.round((endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  return `${months} Month${months === 1 ? "" : "s"}`;
}

function priceBreakdown(course: CourseSummary) {
  const mode = primaryCourseMode(course);
  const pricing = course.pricing;
  const regular =
    mode === "online"
      ? pricing?.online_old_price ?? pricing?.old_price ?? null
      : mode === "offline"
        ? pricing?.offline_old_price ?? pricing?.old_price ?? null
        : pricing?.old_price ?? null;
  const discounted =
    mode === "online"
      ? pricing?.online_discount_price ?? pricing?.discount_price ?? regular
      : mode === "offline"
        ? pricing?.offline_discount_price ?? pricing?.discount_price ?? regular
        : pricing?.discount_price ?? regular;
  const save = hasPrice(regular) && hasPrice(discounted) && regular > discounted ? regular - discounted : null;

  return {
    regular: regular ?? discounted ?? null,
    discounted: discounted ?? regular ?? null,
    save,
  };
}

function takaLabel(value: number | null | undefined) {
  return hasPrice(value) ? `৳ ${Number(value).toLocaleString("en-US")}` : "--";
}

function HeroImage({
  course,
}: {
  course: CourseSummary | null;
}) {
  const defaultImage = resolveMediaUrl("/media/home/itechbd-hero.webp");
  const courseImage = resolveMediaUrl(course?.thumbnail_url) ?? defaultImage;

  return (
    <div className="relative aspect-[16/8.7] min-h-[14rem] overflow-hidden rounded-t-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] sm:min-h-0">
      {courseImage ? (
        <Image
          src={courseImage}
          alt={course ? course.title : "iTechBD professional training"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 760px"
          priority
          unoptimized
        />
      ) : (
        <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">
          {course?.title ?? "iTechBD"}
        </div>
      )}

      {course ? (
        <div className="absolute left-5 bottom-20 inline-flex items-center rounded-lg bg-[color:var(--brand-secondary)] px-4 py-2 text-sm font-black text-white shadow-lg sm:bottom-24">
          {courseModeLabels(course)[0]}
        </div>
      ) : null}
    </div>
  );
}

function DefaultHeroContent({
  locale,
}: {
  locale: AppLocale;
}) {
  return (
    <>
      <div className="px-2 py-6 text-center sm:py-7">
        <h1 className="text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">
          Build practical IT skills with iTechBD
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-body)]">
          Explore career-focused computer training, hands-on classes, expert mentors, and updated learning resources designed for students and professionals.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <LocaleLink
            locale={locale}
            href="/courses"
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-4 py-2 text-sm font-black text-white"
          >
            <BookOpenCheck aria-hidden className="h-4 w-4" />
            Courses
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href="/solutions/it-solutions"
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--surface-secondary)] px-4 py-2 text-sm font-black text-[color:var(--text-heading)]"
          >
            <CheckCircle2 aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
            Services
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href="/news"
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--brand-primary-light)] px-4 py-2 text-sm font-black text-[color:var(--brand-primary)]"
          >
            <CalendarDays aria-hidden className="h-4 w-4" />
            News & Updates
          </LocaleLink>
        </div>
      </div>

    </>
  );
}

function SelectedHeroContent({
  course,
  locale,
}: {
  course: CourseSummary;
  locale: AppLocale;
}) {
  const batch = preferredBatch(course);
  const prices = priceBreakdown(course);
  const duration = monthDuration(batch);
  const totalClasses =
    (batch?.class_schedules_count && batch.class_schedules_count > 0 ? batch.class_schedules_count : null) ??
    extractTotalClasses(course.description) ??
    24;
  const classTime = batch?.class_time || "Flexible schedule";
  const courseHref = `/courses/${course.slug ?? course.id}`;

  return (
    <>
      <p className="text-[15px] leading-7 text-[color:var(--text-body)]">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <CalendarDays aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
          Duration: {duration}
        </span>
        <span className="mx-2 text-[color:var(--border-default)]">|</span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <GraduationCap aria-hidden className="h-4 w-4 text-[color:var(--text-heading)]" />
          Total Classes: {totalClasses}
        </span>
        <span className="mx-2 text-[color:var(--border-default)]">|</span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Timer aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
          Class Duration: 1.5 Hours
        </span>
        <span> | </span>
        {courseDescription(course)}
      </p>

      <div className="mt-5 grid gap-4 border-t border-[color:var(--border-default)] pt-5 sm:grid-cols-2">
        <div className="rounded-lg bg-[color:var(--surface-secondary)] px-5 py-4 sm:px-5 sm:py-5">
          <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
            Duration
          </div>
          <div className="mt-2 text-lg font-black text-[color:var(--text-heading)]">Flexible schedule</div>
          <div className="mt-4 flex items-center gap-2 text-lg font-black text-[color:var(--brand-red)]">
            <Clock3 aria-hidden className="h-5 w-5" />
            {classTime}
          </div>
        </div>

        <div className="rounded-lg bg-[#fff7ef] px-5 py-4 sm:px-5 sm:py-5">
          <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary)]">
            Course Price
          </div>
          <div className="mt-4 grid gap-3 text-sm font-bold">
            <div className="flex items-center justify-between gap-4 text-[color:var(--text-muted)]">
              <span>Regular Price</span>
              <span className="text-[color:var(--text-heading)]">{takaLabel(prices.regular)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[color:var(--success)]">
              <span>Save</span>
              <span>{takaLabel(prices.save)}</span>
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-[color:var(--brand-secondary)]/35 pt-4">
              <span className="text-[color:var(--text-muted)]">Discounted Price</span>
              <span className="text-3xl font-black text-[color:var(--brand-red)]">{takaLabel(prices.discounted)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-[color:var(--border-default)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-black text-emerald-700">
            <ShieldCheck aria-hidden className="h-4 w-4" />
            Practical training
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand-primary-light)] px-3.5 py-2 text-sm font-black text-[color:var(--brand-primary)]">
            <CheckCircle2 aria-hidden className="h-4 w-4" />
            Career focused
          </span>
        </div>
        <LocaleLink
          locale={locale}
          href={courseHref}
          className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black text-[color:var(--brand-red)] transition hover:bg-[#fff1e8]"
        >
          Course Details
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </>
  );
}

function HeroPreview({
  course,
  locale,
}: {
  course: CourseSummary | null;
  locale: AppLocale;
}) {
  return (
    <article className="overflow-hidden rounded-lg bg-white text-[color:var(--text-heading)] shadow-[0_18px_45px_rgba(0,0,0,0.16)] lg:h-full">
      <HeroImage course={course} />
      <div className="p-4">
        {course ? (
          <SelectedHeroContent course={course} locale={locale} />
        ) : (
          <DefaultHeroContent locale={locale} />
        )}
      </div>
    </article>
  );
}

export function HomeHeroApply({
  courses,
  locale,
  currentUser = null,
}: HomeHeroApplyProps) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const selectedCourseData = useMemo(
    () => courses.find((course) => courseOptionValue(course) === selectedCourse) ?? null,
    [courses, selectedCourse],
  );

  return (
    <div className="mx-auto grid w-full max-w-[1180px] items-start gap-5 px-4 lg:grid-cols-[1.5fr_.9fr] lg:items-stretch lg:px-6">
      <div className="min-w-0 lg:h-full">
        <HeroPreview course={selectedCourseData} locale={locale} />
      </div>
      <div className="min-w-0 lg:h-full">
        <ApplyForm
          courses={courses}
          locale={locale}
          currentUser={currentUser}
          selectedCourseValue={selectedCourse}
          onSelectedCourseChange={setSelectedCourse}
          className="lg:h-full"
        />
      </div>
    </div>
  );
}
