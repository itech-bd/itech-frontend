export function ReviewCard({ name, designation, quote, rating }: { name: string; designation?: string | null; quote: string; rating: number }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-1 text-[color:var(--brand-orange)]">
        {Array.from({ length: rating }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">“{quote}”</p>
      <div className="mt-5 font-black text-slate-950">{name}</div>
      {designation ? <div className="text-sm text-slate-500">{designation}</div> : null}
    </article>
  );
}
