import type { ReactNode } from "react";
import { CalendarDays, Clock, MonitorCheck, UsersRound } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { AppLocale } from "@/lib/i18n/routing";
import type { BatchSummary, CourseSummary } from "@/lib/api/types";

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[color:var(--brand-primary)]">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold text-[color:var(--text-muted)]">{label}</div>
        <div className="mt-0.5 truncate text-sm font-extrabold text-[color:var(--text-heading)]">{value}</div>
      </div>
    </div>
  );
}

export function BatchCard({
  batch,
  locale,
  course,
}: {
  batch: BatchSummary;
  locale: AppLocale;
  course?: CourseSummary | null;
}) {
  const linkedCourse = course ?? batch.course;
  const price =
    linkedCourse?.pricing?.online_discount_price ??
    linkedCourse?.pricing?.offline_discount_price ??
    linkedCourse?.pricing?.discount_price ??
    linkedCourse?.pricing?.old_price ??
    null;

  return (
    <article className="surface-card group p-5 transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/35">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex rounded-lg bg-[color:var(--brand-secondary)]/10 px-3 py-1.5 text-xs font-extrabold text-[color:var(--brand-secondary-dark)]">
            {batch.status}
          </div>
          <h3 className="mt-3 text-xl font-black leading-snug text-[color:var(--text-heading)]">{batch.name}</h3>
          {linkedCourse ? (
            <p className="mt-1 text-sm font-bold text-[color:var(--brand-primary)]">{linkedCourse.title}</p>
          ) : null}
        </div>
        {price ? (
          <div className="rounded-lg bg-[color:var(--brand-primary-light)] px-4 py-3 text-right">
            <div className="text-xs font-bold text-[color:var(--text-muted)]">Fee starts</div>
            <div className="font-black text-[color:var(--brand-primary-dark)]">{formatCurrency(price, locale)}</div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Starts" value={batch.start_date ? formatDate(batch.start_date, locale) : "Announced soon"} />
        <Detail icon={<Clock aria-hidden className="h-4 w-4" />} label="Class time" value={batch.class_time || "Contact office"} />
        <Detail icon={<MonitorCheck aria-hidden className="h-4 w-4" />} label="Class days" value={batch.class_days.join(", ") || "Flexible"} />
        <Detail icon={<UsersRound aria-hidden className="h-4 w-4" />} label="Mentors" value={batch.mentors?.length ? `${batch.mentors.length} assigned` : "Assigned soon"} />
      </div>

      {linkedCourse ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-[color:var(--border-default)] pt-5 sm:flex-row">
          <LocaleLink
            locale={locale}
            href={`/checkout/courses/${linkedCourse.slug ?? linkedCourse.id}`}
            className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[color:var(--brand-primary)] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
          >
            Apply now
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href={`/courses/${linkedCourse.slug ?? linkedCourse.id}`}
            className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[color:var(--border-default)] px-4 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            View course
          </LocaleLink>
        </div>
      ) : null}
    </article>
  );
}
