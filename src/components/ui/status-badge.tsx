import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  const normalized = (status ?? "").toLowerCase();
  const palette =
    normalized === "paid" || normalized === "approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : normalized === "pending" || normalized === "upcoming"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : normalized === "running"
          ? "bg-sky-50 text-sky-700 border-sky-200"
          : normalized === "cancelled" || normalized === "inactive"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]", palette, className)}>
      {status ?? "unknown"}
    </span>
  );
}
