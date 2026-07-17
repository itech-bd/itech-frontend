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
  const regular = course.pricing?.old_price ?? course.pricing?.online_old_price ?? course.pricing?.offline_old_price ?? null;

  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/35">
      <LocaleLink locale={locale} href={`/courses/${course.slug ?? course.id}`} className="focus-ring block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">
              <span>{course.title}</span>
            </div>
          )}
          <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-extrabold text-[color:var(--brand-primary-dark)] shadow-sm">
            {course.track ?? "Professional Skill"}
          </div>
          {lowest ? (
            <div className="absolute bottom-4 right-4 rounded-lg bg-[color:var(--text-heading)] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
              {formatCurrency(lowest, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/courses/${course.slug ?? course.id}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {course.title}
          </LocaleLink>
        </h3>
        {course.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--text-body)]">{course.description}</p> : null}

        <div className="mt-5 grid gap-2 text-sm">
          {firstBatch?.start_date ? (
            <div className="flex items-center gap-2 text-[color:var(--text-body)]">
              <CalendarDays aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
              Starts {formatDate(firstBatch.start_date, locale)}
            </div>
          ) : null}
          {firstBatch?.class_time ? (
            <div className="flex items-center gap-2 text-[color:var(--text-body)]">
              <Clock3 aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
              {firstBatch.class_days.join(", ") || "Class days"} at {firstBatch.class_time}
            </div>
          ) : null}
          {course.enrolled_batches_count ? (
            <div className="flex items-center gap-2 text-[color:var(--text-body)]">
              <MonitorPlay aria-hidden className="h-4 w-4 text-[color:var(--brand-accent)]" />
              {course.enrolled_batches_count} enrolled batches
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[color:var(--border-default)] pt-5">
          <div>
            {lowest ? <div className="text-lg font-black text-[color:var(--text-heading)]">{formatCurrency(lowest, locale)}</div> : null}
            {regular && lowest && regular > lowest ? (
              <div className="text-xs font-bold text-[color:var(--text-muted)] line-through">{formatCurrency(regular, locale)}</div>
            ) : (
              <div className="text-xs font-bold text-[color:var(--text-muted)]">{firstBatch ? "Next batch open" : "Batch updates soon"}</div>
            )}
          </div>
          <LocaleLink
            locale={locale}
            href={`/checkout/courses/${course.slug ?? course.id}`}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
          >
            Enroll
            <ArrowRight aria-hidden className="h-4 w-4" />
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}
