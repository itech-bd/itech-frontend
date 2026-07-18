import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StudentPageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-secondary)]/20 bg-[color:var(--surface-tint)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[color:var(--brand-secondary-dark)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-secondary)]" />
          {kicker}
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">
          {title}
        </h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-body)] sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StudentCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[1.5rem] border border-[color:var(--border-default)]/80 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]", className)}>
      {children}
    </div>
  );
}

export function StudentStatusBadge({ status }: { status: string | null | undefined }) {
  const normalized = (status ?? "active").toLowerCase();
  const style =
    normalized === "approved" || normalized === "paid" || normalized === "running"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : normalized === "pending" || normalized === "upcoming"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : normalized === "cancelled" || normalized === "completed"
          ? "bg-slate-100 text-slate-600 ring-slate-200"
          : "bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary-dark)] ring-[color:var(--brand-primary-light)]";

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ring-1", style)}>
      {normalized.replace(/_/g, " ")}
    </span>
  );
}

export function StudentInfoItem({
  icon,
  label,
  value,
  className,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-[color:var(--border-default)]/70 bg-[color:var(--surface-secondary)] p-4", className)}>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-extrabold text-[color:var(--text-heading)]">{value}</div>
    </div>
  );
}

export function StudentEmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--border-default)] bg-white/75 p-8 text-center">
      <h3 className="text-lg font-black text-[color:var(--text-heading)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--text-body)]">{message}</p>
    </div>
  );
}
