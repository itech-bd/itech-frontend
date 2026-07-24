import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  CirclePlay,
  Clock3,
  Link as LinkIcon,
  MonitorPlay,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { StudentCard, StudentEmptyState, StudentInfoItem, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { getStudentBatch } from "@/lib/api/site";
import type { StudentBatchDetail } from "@/lib/api/types";
import { formatDate, formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

export default async function StudentBatchDetailPage({ params }: { params: Promise<{ locale: string; batch: string }> }) {
  const { locale, batch } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getStudentBatch(locale, batch);
  const thumbnail = resolveMediaUrl(data.batch.course?.thumbnail_url);

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Batch Workspace"
        title={data.batch.name}
        description={data.batch.course?.title ?? "Your batch schedule and access details are organized here."}
        action={
          <LocaleLink
            locale={locale}
            href="/student/batches"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            All batches
          </LocaleLink>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <StudentCard className="overflow-hidden p-0">
          <div className="relative aspect-[16/9] bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {thumbnail ? (
              <Image src={thumbnail} alt={data.batch.course?.title ?? data.batch.name} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 45vw" unoptimized />
            ) : (
              <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">{data.batch.course?.title ?? data.batch.name}</div>
            )}
          </div>
        </StudentCard>

        <StudentCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)]">
                <CheckCircle2 aria-hidden className="h-4 w-4" />
                Enrollment
              </div>
              <h2 className="mt-4 text-2xl font-black text-[color:var(--text-heading)]">Access summary</h2>
            </div>
            <StudentStatusBadge status={data.enrollment.status ?? data.batch.status} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StudentInfoItem icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Start date" value={formatDate(data.batch.start_date, locale)} />
            <StudentInfoItem icon={<Clock3 aria-hidden className="h-4 w-4" />} label="Class time" value={data.batch.class_time ?? "TBA"} />
            <StudentInfoItem icon={<MonitorPlay aria-hidden className="h-4 w-4" />} label="Schedule access" value={data.schedule_access ? "Approved" : "Pending approval"} />
            <StudentInfoItem icon={<UsersRound aria-hidden className="h-4 w-4" />} label="Mentors" value={formatNumber(data.batch.mentors.length, locale)} />
          </div>

          {data.batch.live_class_link ? (
            <a
              href={data.batch.live_class_link}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
            >
              <LinkIcon aria-hidden className="h-4 w-4" />
              Open live class
            </a>
          ) : null}
        </StudentCard>
      </section>

      <section className="grid min-h-0 gap-5 xl:grid-cols-[1.2fr_.8fr] xl:items-start">
        <StudentCard className="min-h-0 xl:flex xl:max-h-[calc(100vh-8rem)] xl:flex-col xl:overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-[color:var(--brand-secondary-dark)]">Class schedule</div>
              <h2 className="mt-2 text-2xl font-black text-[color:var(--text-heading)]">Upcoming and recorded lessons</h2>
            </div>
            <div className="text-sm font-bold text-[color:var(--text-muted)]">{formatNumber(data.schedules.length, locale)} classes</div>
          </div>

          <div className="mt-5 min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-3">
            {data.schedule_access && data.schedules.length ? (
              <div className="relative">
                <div className="absolute left-10 top-3 hidden h-[calc(100%-1.5rem)] w-px bg-[color:var(--border-default)] md:block" />
                <div className="space-y-4">
                  {data.schedules.map((schedule, index) => (
                    <ScheduleTimelineCard
                      key={schedule.id}
                      schedule={schedule}
                      locale={locale}
                      index={index}
                      classTime={data.batch.class_time}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <StudentEmptyState title={data.schedule_access ? "No class schedule yet" : "Schedule pending"} message={data.schedule_access ? "Class schedules will appear here after they are published." : "Your class schedule will unlock after enrollment approval."} />
            )}
          </div>
        </StudentCard>

        <StudentCard>
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-tint)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-secondary-dark)]">
            <UsersRound aria-hidden className="h-4 w-4" />
            Batch mentors
          </div>
          <div className="mt-5 space-y-3">
            {data.batch.mentors.length ? (
              data.batch.mentors.map((mentor) => {
                const image = resolveMediaUrl(mentor.profile_image_url);
                return (
                  <div key={mentor.id} className="flex items-center gap-3 rounded-2xl border border-[color:var(--border-default)]/70 bg-white p-3">
                    <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
                      {image ? <Image src={image} alt={mentor.name} fill className="object-cover" sizes="48px" unoptimized /> : <UserRound aria-hidden className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black text-[color:var(--text-heading)]">{mentor.name}</div>
                      <div className="truncate text-xs font-semibold text-[color:var(--text-muted)]">{mentor.email ?? "Mentor"}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-6 text-[color:var(--text-muted)]">Mentor information will appear after assignment.</p>
            )}
          </div>
        </StudentCard>
      </section>
    </main>
  );
}

type BatchSchedule = StudentBatchDetail["schedules"][number];

function ScheduleTimelineCard({
  schedule,
  locale,
  index,
  classTime,
}: {
  schedule: BatchSchedule;
  locale: "en" | "bn";
  index: number;
  classTime: string | null;
}) {
  const month = formatScheduleDatePart(schedule.class_date, locale, { month: "short" });
  const day = formatScheduleDatePart(schedule.class_date, locale, { day: "2-digit" });
  const status = getScheduleStatus(schedule.class_date, locale);
  const liveLabel = status.kind === "completed" ? "Open live link" : "Join live class";

  return (
    <article className="relative grid gap-4 rounded-[1.35rem] border border-[color:var(--border-default)]/75 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.045)] transition hover:border-[color:var(--brand-primary)]/30 hover:bg-[color:var(--surface-secondary)] md:grid-cols-[5rem_minmax(0,1fr)_minmax(15rem,.34fr)] md:items-center">
      <div className="flex items-center gap-3 md:block">
        <div className="relative z-10 grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[color:var(--brand-primary-light)] text-center text-[color:var(--brand-primary)] ring-4 ring-white">
          <div>
            <div className="text-xs font-black uppercase">{month}</div>
            <div className="mt-1 text-3xl font-black leading-none text-[color:var(--text-heading)]">{day}</div>
          </div>
        </div>
        <div className="min-w-0 md:mt-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[color:var(--brand-primary)] ring-1 ring-[color:var(--border-default)]">
            Class {index + 1}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={status.className}>{status.label}</span>
          {classTime ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-[color:var(--text-muted)] ring-1 ring-[color:var(--border-default)]">
              <Clock3 aria-hidden className="h-3.5 w-3.5" />
              {classTime}
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 text-lg font-black leading-snug text-[color:var(--text-heading)]">{schedule.topic}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[color:var(--text-muted)]">
          <CalendarDays aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
          {formatDate(schedule.class_date, locale, { weekday: "long", year: "numeric", month: "short", day: "numeric", dateStyle: undefined })}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2">
        <ScheduleAction
          href={schedule.live_class_link}
          label={liveLabel}
          emptyLabel="Live link pending"
          tone="live"
          icon={<Video aria-hidden className="h-4 w-4" />}
        />
        <ScheduleAction
          href={schedule.recorded_video_link}
          label="Watch recording"
          emptyLabel="Recording not added"
          tone="recording"
          icon={<CirclePlay aria-hidden className="h-4 w-4" />}
        />
      </div>
    </article>
  );
}

function ScheduleAction({
  href,
  label,
  emptyLabel,
  tone,
  icon,
}: {
  href: string | null;
  label: string;
  emptyLabel: string;
  tone: "live" | "recording";
  icon: ReactNode;
}) {
  if (!href) {
    return (
      <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--border-default)] bg-white/70 px-4 py-2.5 text-xs font-black text-[color:var(--text-muted)]">
        <CircleDashed aria-hidden className="h-4 w-4" />
        {emptyLabel}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        tone === "live"
          ? "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-primary)] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[color:var(--brand-primary-dark)]"
          : "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-secondary)] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
      }
    >
      {icon}
      {label}
      <ArrowUpRight aria-hidden className="h-4 w-4" />
    </a>
  );
}

function getLocalDate(value: string | null | undefined) {
  if (!value) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatScheduleDatePart(
  value: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  const date = getLocalDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function getScheduleStatus(value: string | null | undefined, locale: string) {
  const date = getLocalDate(value);
  if (!date) {
    return {
      kind: "scheduled",
      label: "Scheduled",
      className: "rounded-full bg-[color:var(--surface-secondary)] px-3 py-1 text-xs font-black text-[color:var(--text-muted)]",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (days < 0) {
    return {
      kind: "completed",
      label: "Completed",
      className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600",
    };
  }

  if (days === 0) {
    return {
      kind: "today",
      label: "Today",
      className: "rounded-full bg-[color:var(--surface-tint)] px-3 py-1 text-xs font-black text-[color:var(--brand-secondary-dark)]",
    };
  }

  if (days === 1) {
    return {
      kind: "tomorrow",
      label: "Tomorrow",
      className: "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700",
    };
  }

  return {
    kind: "upcoming",
    label: `${new Intl.NumberFormat(locale).format(days)} days left`,
    className: "rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1 text-xs font-black text-[color:var(--brand-primary-dark)]",
  };
}
