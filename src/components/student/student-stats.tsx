import { BookOpenCheck, CalendarDays, CheckCircle2, FileText, WalletCards } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatting";

export function StudentStats({
  stats,
  locale = "en",
}: {
  locale?: string;
  stats: {
    courses: number;
    batches: number;
    approved_batches: number;
    pending_batches: number;
    paid_invoices: number;
    paid_amount: number;
  };
}) {
  const cards = [
    {
      label: "My Courses",
      value: formatNumber(stats.courses, locale),
      helper: "Enrolled learning paths",
      icon: BookOpenCheck,
      tint: "bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]",
    },
    {
      label: "My Batches",
      value: formatNumber(stats.batches, locale),
      helper: `${formatNumber(stats.approved_batches, locale)} approved, ${formatNumber(stats.pending_batches, locale)} pending`,
      icon: CalendarDays,
      tint: "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary)]",
    },
    {
      label: "Paid Invoices",
      value: formatNumber(stats.paid_invoices, locale),
      helper: "Completed payments",
      icon: FileText,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Paid",
      value: formatCurrency(stats.paid_amount, locale),
      helper: "Lifetime admission fees",
      icon: WalletCards,
      tint: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="group rounded-[1.4rem] border border-[color:var(--border-default)]/80 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]">
            <div className="flex items-start justify-between gap-3">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tint}`}>
                <Icon aria-hidden className="h-5 w-5" />
              </div>
              <CheckCircle2 aria-hidden className="h-5 w-5 text-emerald-500 opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="mt-5 text-2xl font-black text-[color:var(--text-heading)]">{card.value}</div>
            <div className="mt-1 text-sm font-black text-[color:var(--text-heading)]">{card.label}</div>
            <div className="mt-2 text-xs font-semibold leading-5 text-[color:var(--text-muted)]">{card.helper}</div>
          </div>
        );
      })}
    </div>
  );
}
