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
        <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--brand-primary)]/15 bg-[color:var(--brand-primary-light)] px-3 py-2 text-xs font-bold uppercase text-[color:var(--brand-primary-dark)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-secondary)]" />
          {kicker}
        </div>
      ) : null}
      <h2 className="max-w-3xl text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-body)] sm:text-base">{subtitle}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
