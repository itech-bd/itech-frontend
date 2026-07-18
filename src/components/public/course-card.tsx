import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, MonitorPlay } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { AppLocale } from "@/lib/i18n/routing";
import type { CourseSummary } from "@/lib/api/types";
import { resolveMediaUrl } from "@/lib/media";

export function CourseCard({ course, locale }: { course: CourseSummary; locale: AppLocale }) {
  const thumbnail = resolveMediaUrl(course.thumbnail_url);
  const firstBatch = course.batches?.[0];
  const lowest =
    course.pricing?.online_discount_price ??
    course.pricing?.offline_discount_price ??
    course.pricing?.discount_price ??
    course.pricing?.old_price ??
    null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
      <LocaleLink locale={locale} href={`/courses/${course.slug ?? course.id}`} className="focus-ring block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">
              <span>{course.title}</span>
            </div>
          )}
          <div className="absolute left-3 top-3 rounded bg-white/95 px-3 py-1.5 text-xs font-extrabold text-[color:var(--brand-primary-dark)] shadow-sm">
            {course.track ?? "Professional Skill"}
          </div>
          {lowest ? (
            <div className="absolute bottom-3 right-3 rounded bg-[color:var(--text-heading)] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
              {formatCurrency(lowest, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/courses/${course.slug ?? course.id}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {course.title}
          </LocaleLink>
        </h3>

        <div className="mt-3 grid gap-2 text-xs font-semibold">
          {firstBatch?.start_date ? (
            <div className="flex items-center gap-2 text-[color:var(--text-body)]">
              <CalendarDays aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-primary)]" />
              Starts {formatDate(firstBatch.start_date, locale)}
            </div>
          ) : null}
          {firstBatch?.class_time ? (
            <div className="flex items-center gap-2 text-[color:var(--text-body)]">
              <Clock3 aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-secondary)]" />
              {firstBatch.class_days.join(", ") || "Class days"} at {firstBatch.class_time}
            </div>
          ) : null}
          {course.enrolled_batches_count ? (
            <div className="flex items-center gap-2 text-[color:var(--text-body)]">
              <MonitorPlay aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-accent)]" />
              {course.enrolled_batches_count} enrolled batches
            </div>
          ) : null}
        </div>
        {course.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--text-body)]">{course.description}</p> : null}

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[color:var(--border-default)] pt-4 text-xs font-black">
          <div className="rounded bg-[color:var(--surface-secondary)] px-3 py-2">
            <span className="text-[color:var(--text-muted)]">Offline Fee = </span>
            <span className="text-[color:var(--brand-secondary)]">{course.pricing?.offline_discount_price ? formatCurrency(course.pricing.offline_discount_price, locale) : "--"}</span>
          </div>
          <div className="rounded bg-[color:var(--surface-secondary)] px-3 py-2 text-right">
            <span className="text-[color:var(--text-muted)]">Online Fee = </span>
            <span className="text-[color:var(--brand-secondary)]">{lowest ? formatCurrency(lowest, locale) : "--"}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <LocaleLink
            locale={locale}
            href={`/courses/${course.slug ?? course.id}`}
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-[color:var(--brand-secondary)]/35 px-4 py-2 text-xs font-extrabold text-[color:var(--brand-secondary)] transition hover:bg-[color:var(--surface-tint)]"
          >
            Details
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href={`/checkout/courses/${course.slug ?? course.id}`}
            className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
          >
            Enroll Now
            <ArrowRight aria-hidden className="h-4 w-4" />
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}
