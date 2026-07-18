import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, MonitorPlay, UsersRound } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { AppLocale } from "@/lib/i18n/routing";
import type { BatchSummary, CourseSummary } from "@/lib/api/types";
import { resolveMediaUrl } from "@/lib/media";

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
  const thumbnail = resolveMediaUrl(linkedCourse?.thumbnail_url);
  const price =
    linkedCourse?.pricing?.online_discount_price ??
    linkedCourse?.pricing?.offline_discount_price ??
    linkedCourse?.pricing?.discount_price ??
    linkedCourse?.pricing?.old_price ??
    null;
  const href = linkedCourse ? `/courses/${linkedCourse.slug ?? linkedCourse.id}` : "/courses";
  const checkoutHref = linkedCourse ? `/checkout/courses/${linkedCourse.slug ?? linkedCourse.id}` : "/courses";
  const statusTone =
    batch.status.toLowerCase() === "running"
      ? "bg-[#e9fff2] text-[#11864c]"
      : "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary-dark)]";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
      <LocaleLink locale={locale} href={href} className="focus-ring block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={linkedCourse?.title ?? batch.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">
              <span>{linkedCourse?.title ?? batch.name}</span>
            </div>
          )}
          <div className="absolute left-3 top-3 rounded bg-white/95 px-3 py-1.5 text-xs font-extrabold text-[color:var(--brand-primary-dark)] shadow-sm">
            {linkedCourse?.track ?? "Professional Skill"}
          </div>
          <div className={`absolute right-3 top-3 rounded px-3 py-1.5 text-xs font-extrabold shadow-sm ${statusTone}`}>
            {batch.status}
          </div>
          {price ? (
            <div className="absolute bottom-3 right-3 rounded bg-[color:var(--text-heading)] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
              {formatCurrency(price, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={href} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {linkedCourse?.title ?? batch.name}
          </LocaleLink>
        </h3>
        <p className="line-clamp-1 text-xs font-extrabold text-[color:var(--brand-primary)]">{batch.name}</p>

        <div className="mt-3 grid gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2 text-[color:var(--text-body)]">
            <CalendarDays aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-primary)]" />
            Starts {batch.start_date ? formatDate(batch.start_date, locale) : "Announced soon"}
          </div>
          <div className="flex items-center gap-2 text-[color:var(--text-body)]">
            <Clock3 aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-secondary)]" />
            {batch.class_days.join(", ") || "Class days"} at {batch.class_time || "Contact office"}
          </div>
          <div className="flex items-center gap-2 text-[color:var(--text-body)]">
            <UsersRound aria-hidden className="h-3.5 w-3.5 text-[color:var(--brand-accent)]" />
            {batch.mentors?.length ? `${batch.mentors.length} mentor${batch.mentors.length === 1 ? "" : "s"} assigned` : "Mentors assigned soon"}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[color:var(--border-default)] pt-4 text-xs font-black">
          <div className="rounded bg-[color:var(--surface-secondary)] px-3 py-2">
            <span className="text-[color:var(--text-muted)]">Offline Fee = </span>
            <span className="text-[color:var(--brand-secondary)]">{linkedCourse?.pricing?.offline_discount_price ? formatCurrency(linkedCourse.pricing.offline_discount_price, locale) : "--"}</span>
          </div>
          <div className="rounded bg-[color:var(--surface-secondary)] px-3 py-2 text-right">
            <span className="text-[color:var(--text-muted)]">Online Fee = </span>
            <span className="text-[color:var(--brand-secondary)]">{price ? formatCurrency(price, locale) : "--"}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <LocaleLink
            locale={locale}
            href={href}
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-[color:var(--brand-secondary)]/35 px-4 py-2 text-xs font-extrabold text-[color:var(--brand-secondary)] transition hover:bg-[color:var(--surface-tint)]"
          >
            Details
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href={checkoutHref}
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
