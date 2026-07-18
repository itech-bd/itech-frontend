import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, MonitorPlay, UsersRound } from "lucide-react";
import { PaginationNav } from "@/components/ui/pagination";
import { LocaleLink } from "@/components/ui/link";
import { StudentEmptyState, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { listStudentBatches } from "@/lib/api/site";
import type { BatchSummary } from "@/lib/api/types";
import { formatDate, formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

export default async function StudentBatchesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const status = typeof query.status === "string" ? (query.status as "pending" | "approved") : undefined;
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const batches = await listStudentBatches(locale, { status, page, per_page: 9 });

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="My Batches"
        title="Batch progress and schedule"
        description="Track your batch status, class time, mentors, and class schedule from one place."
        action={
          <div className="rounded-2xl bg-[color:var(--surface-tint)] px-4 py-3 text-sm font-black text-[color:var(--brand-secondary-dark)]">
            {formatNumber(batches.pagination.total, locale)} batch{batches.pagination.total === 1 ? "" : "es"}
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterLink locale={locale} href="/student/batches" active={!status} label="All batches" />
        <FilterLink locale={locale} href="/student/batches?status=approved" active={status === "approved"} label="Approved" />
        <FilterLink locale={locale} href="/student/batches?status=pending" active={status === "pending"} label="Pending" />
      </div>

      {batches.items.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {batches.items.map((batch) => (
            <StudentBatchCard key={batch.id} batch={batch} locale={locale} />
          ))}
        </div>
      ) : (
        <StudentEmptyState title="No batches found" message="Your approved or pending course batches will appear here after enrollment." />
      )}

      <PaginationNav locale={locale} pagination={batches.pagination} basePath="/student/batches" searchParams={{ status }} />
    </main>
  );
}

function FilterLink({ locale, href, active, label }: { locale: "en" | "bn"; href: string; active: boolean; label: string }) {
  return (
    <LocaleLink
      locale={locale}
      href={href}
      className={
        active
          ? "focus-ring rounded-full bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-black text-white"
          : "focus-ring rounded-full border border-[color:var(--border-default)] bg-white px-4 py-2 text-xs font-black text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
      }
    >
      {label}
    </LocaleLink>
  );
}

function StudentBatchCard({ batch, locale }: { batch: BatchSummary; locale: "en" | "bn" }) {
  const thumbnail = resolveMediaUrl(batch.course?.thumbnail_url);
  const href = `/student/batches/${batch.id}`;

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border-default)] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
      <div className="relative aspect-[16/8] bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
        {thumbnail ? (
          <Image src={thumbnail} alt={batch.course?.title ?? batch.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" unoptimized />
        ) : (
          <div className="brand-grid flex h-full items-center justify-center p-6 text-center text-xl font-black text-white">{batch.course?.title ?? batch.name}</div>
        )}
        <div className="absolute left-4 top-4">
          <StudentStatusBadge status={batch.enrollment?.status ?? batch.status} />
        </div>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 text-lg font-black text-[color:var(--text-heading)]">{batch.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm font-bold text-[color:var(--brand-primary)]">{batch.course?.title ?? "Course"}</p>

        <div className="mt-4 grid gap-3">
          <Info icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Starts" value={formatDate(batch.start_date, locale)} />
          <Info icon={<Clock3 aria-hidden className="h-4 w-4" />} label="Class time" value={batch.class_time ? `${batch.class_days.join(", ") || "Class days"} at ${batch.class_time}` : "TBA"} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={<MonitorPlay aria-hidden className="h-4 w-4" />} label="Classes" value={formatNumber(batch.class_schedules_count ?? 0, locale)} />
            <Info icon={<UsersRound aria-hidden className="h-4 w-4" />} label="Mentors" value={formatNumber(batch.mentors_count ?? batch.mentors?.length ?? 0, locale)} />
          </div>
        </div>

        <LocaleLink
          locale={locale}
          href={href}
          className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
        >
          View schedule
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[color:var(--surface-secondary)] p-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[color:var(--text-muted)]">
        <span className="text-[color:var(--brand-primary)]">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold text-[color:var(--text-heading)]">{value}</div>
    </div>
  );
}
