import type { ReactNode } from "react";

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
    <main className="py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(46,49,146,0.96),rgba(25,27,82,0.98))] p-8 text-white shadow-2xl shadow-[color:var(--brand-primary)]/20">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em]">
            iTechBD Ltd
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight">{title}</h1>
          <p className="mt-4 max-w-md text-white/80">{description}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
