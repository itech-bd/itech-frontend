import { Quote, Star } from "lucide-react";

export function ReviewCard({
  name,
  designation,
  quote,
  rating,
}: {
  name: string;
  designation?: string | null;
  quote: string;
  rating: number;
}) {
  const stars = Math.max(0, Math.min(5, rating));

  return (
    <article className="surface-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 text-[color:var(--warning)]" aria-label={`${stars} out of 5 stars`}>
          {Array.from({ length: stars }).map((_, index) => (
            <Star key={index} aria-hidden className="h-4 w-4 fill-current" />
          ))}
        </div>
        <Quote aria-hidden className="h-6 w-6 text-[color:var(--brand-primary)]/25" />
      </div>
      <p className="mt-4 text-sm leading-7 text-[color:var(--text-body)]">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 font-black text-[color:var(--text-heading)]">{name}</div>
      {designation ? <div className="text-sm text-[color:var(--text-muted)]">{designation}</div> : null}
    </article>
  );
}
