export function StudentStats({
  stats,
}: {
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
    { label: "My Courses", value: stats.courses },
    { label: "My Batches", value: stats.batches },
    { label: "Paid Invoices", value: stats.paid_invoices },
    { label: "Total Paid", value: stats.paid_amount },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</div>
          <div className="mt-2 text-2xl font-black text-slate-950">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
