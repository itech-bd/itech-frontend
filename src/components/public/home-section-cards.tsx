import Image from "next/image";
import { ArrowRight, BookOpenCheck, CalendarDays, Clock3, Mail, UserRound } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import type { BatchSummary, CourseSummary, MentorSummary } from "@/lib/api/types";
import { formatCurrency } from "@/lib/formatting";
import type { AppLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";
import { coursePlainSummary } from "@/lib/rich-text";

function feeValue(course: CourseSummary | null | undefined, type: "online" | "offline") {
  if (!course?.pricing) return null;

  if (type === "online") {
    return course.pricing.online_discount_price ?? course.pricing.online_old_price ?? course.pricing.discount_price ?? course.pricing.old_price ?? null;
  }

  return course.pricing.offline_discount_price ?? course.pricing.offline_old_price ?? course.pricing.discount_price ?? course.pricing.old_price ?? null;
}

function compactFee(value: number | null | undefined, locale: AppLocale) {
  return value === null || value === undefined ? "--" : formatCurrency(value, locale);
}

export function HomeSectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--brand-secondary)]">
        {kicker}
      </div>
      <h2 className="mt-2 text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-xs font-semibold leading-6 text-[color:var(--text-muted)] sm:text-sm">
        {subtitle}
      </p>
    </div>
  );
}

export function HomeBatchCard({
  batch,
  locale,
}: {
  batch: BatchSummary;
  locale: AppLocale;
}) {
  const course = batch.course ?? null;
  const thumbnail = resolveMediaUrl(course?.thumbnail_url);
  const title = course?.title ?? batch.name;
  const href = course ? `/courses/${course.slug ?? course.id}` : "/courses";
  const checkoutHref = course ? `/checkout/courses/${course.slug ?? course.id}` : "/courses";
  const description = coursePlainSummary(
    course?.description,
    title,
    `${title} course with practical lessons, mentor guidance, and career-focused project practice.`,
  );
  const onlineFee = feeValue(course, "online");
  const offlineFee = feeValue(course, "offline");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#e4edf8] bg-white shadow-[0_10px_28px_rgba(16,33,63,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/40">
      <LocaleLink locale={locale} href={href} className="focus-ring block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-6 text-center text-2xl font-black text-white">
              {title}
            </div>
          )}
        </div>
      </LocaleLink>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-11 text-sm font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={href} className="focus-ring hover:text-[color:var(--brand-primary)]">
            <BookOpenCheck aria-hidden className="mr-1.5 inline h-4 w-4 text-[color:var(--brand-primary)]" />
            {title}
          </LocaleLink>
        </h3>

        <div className="mt-3 grid gap-2 text-[11px] font-bold text-[color:var(--text-muted)] sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <CalendarDays aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-secondary)]" />
            Duration: Flexible
          </div>
          <div className="flex items-center gap-1.5 sm:justify-end">
            <Clock3 aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-secondary)]" />
            Class Time: {batch.class_time || "Contact"}
          </div>
        </div>

        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-xs font-semibold leading-6 text-[color:var(--text-body)]">
          {description}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[color:var(--border-default)] pt-4 text-[11px] font-black">
          <div className="rounded-lg bg-[color:var(--surface-secondary)] px-3 py-2">
            <span className="text-[color:var(--text-heading)]">Offline Fee = </span>
            <span className="text-[color:var(--brand-red)]">{compactFee(offlineFee, locale)}</span>
          </div>
          <div className="rounded-lg bg-[color:var(--surface-secondary)] px-3 py-2 text-right">
            <span className="text-[color:var(--text-heading)]">Online Fee = </span>
            <span className="text-[color:var(--brand-red)]">{compactFee(onlineFee, locale)}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <LocaleLink
            locale={locale}
            href={href}
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-[color:var(--brand-red)]/35 px-4 py-2 text-xs font-black text-[color:var(--brand-red)] transition hover:bg-[#fff2ef]"
          >
            Details
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href={checkoutHref}
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg bg-[color:var(--brand-red)] px-4 py-2 text-xs font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
          >
            Enroll Now
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}

export function HomeMentorCard({
  mentor,
  locale,
}: {
  mentor: MentorSummary;
  locale: AppLocale;
}) {
  const profileImage = resolveMediaUrl(mentor.profile_image_url);
  const initials = mentor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const topic = mentor.topic ?? "Professional Mentor";
  const badge = mentor.skills?.[0]?.name ?? topic;

  return (
    <article className="group overflow-hidden rounded-lg border border-[#e4edf8] bg-white text-center shadow-[0_10px_28px_rgba(16,33,63,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/40">
      <div className="h-14 bg-[linear-gradient(90deg,var(--brand-primary-deep)_0%,var(--brand-primary)_48%,var(--brand-secondary)_100%)]" />
      <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="focus-ring -mt-9 block">
        <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-lg border-4 border-white bg-[color:var(--surface-secondary)] shadow-[0_14px_26px_rgba(15,23,42,0.18)]">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={mentor.name}
              width={88}
              height={88}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <span className="grid h-full w-full place-items-center bg-[color:var(--brand-primary-light)] text-xl font-black text-[color:var(--brand-primary)]">
              {initials || <UserRound aria-hidden className="h-7 w-7" />}
            </span>
          )}
        </div>
      </LocaleLink>

      <div className="p-4 pt-3">
        <h3 className="line-clamp-1 text-sm font-black uppercase text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {mentor.name}
          </LocaleLink>
        </h3>
        <p className="mt-1 min-h-8 text-[11px] font-black leading-4 text-[color:var(--brand-secondary)]">
          {topic}
        </p>
        <div className="mx-auto mt-3 line-clamp-1 max-w-44 rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-[10px] font-black text-[color:var(--brand-primary)]">
          {badge}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold text-[color:var(--text-muted)]">
          <Mail aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-secondary)]" />
          Mentor profile
        </div>
        <LocaleLink
          locale={locale}
          href={`/mentors/${mentor.slug ?? mentor.id}`}
          className="focus-ring mt-3 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--brand-secondary)]/35 px-4 py-2 text-xs font-black text-[color:var(--brand-secondary)] transition hover:bg-[color:var(--brand-secondary)] hover:text-white"
        >
          Details
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </LocaleLink>
      </div>
    </article>
  );
}

export function HomeCarouselDots() {
  return (
    <div className="mt-6 flex justify-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[color:var(--brand-secondary)]" />
      <span className="h-2 w-2 rounded-full bg-[color:var(--border-default)]" />
    </div>
  );
}
