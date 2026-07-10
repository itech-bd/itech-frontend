import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({
  kicker,
  title,
  subtitle,
  action,
  align = "center",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("flex flex-col gap-3", align === "left" ? "items-start text-left" : "items-center text-center")}>
      {kicker ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-orange)]/15 bg-[color:var(--brand-orange)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-orange)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-red)]" />
          {kicker}
        </div>
      ) : null}
      <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
