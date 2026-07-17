import type { ReactNode } from "react";
import { BadgeCheck, GraduationCap, ShieldCheck } from "lucide-react";

export function AuthPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="py-14 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
        <div className="rounded-lg bg-[color:var(--text-heading)] p-6 text-white shadow-[var(--shadow-soft)] sm:p-8">
          <div className="brand-grid rounded-lg border border-white/12 p-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-extrabold uppercase text-white/84">
              <GraduationCap aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
              iTechBD Ltd
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/78 sm:text-base">{description}</p>
            <div className="mt-8 grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <BadgeCheck aria-hidden className="h-5 w-5 text-[color:var(--brand-secondary)]" />
                Course enrollment and batch tracking
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck aria-hidden className="h-5 w-5 text-[color:var(--brand-secondary)]" />
                Secure student dashboard access
              </div>
            </div>
          </div>
        </div>
        <div className="surface-card p-5 lg:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
