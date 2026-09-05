import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Code2, Globe2, MessageCircle, Network, ServerCog, ShieldCheck, Sparkles } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { getPublicBootstrap } from "@/lib/api/site";
import type { NavItem } from "@/lib/api/types";
import { isLocale } from "@/lib/i18n/routing";

type SolutionMeta = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  description: string;
  points: string[];
  accentClass: string;
};

const fallbackSolutions: NavItem[] = [
  { key: "software-solutions", label: "Software Solutions", href: "/solutions/software-solutions" },
  { key: "it-solutions", label: "IT Solutions", href: "/solutions/it-solutions" },
  { key: "web-hosting-solutions", label: "Web Hosting Solutions", href: "/solutions/web-hosting-solutions" },
];

const solutionMeta: Record<string, SolutionMeta> = {
  "software-solutions": {
    icon: Code2,
    description: "Custom web apps, business systems, and practical tools designed around your workflow.",
    points: ["Workflow-focused builds", "Admin dashboards", "Business automation"],
    accentClass: "bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]",
  },
  "it-solutions": {
    icon: Network,
    description: "Technical support, infrastructure planning, and reliable setup for growing teams.",
    points: ["IT consulting", "Device and network support", "Operational guidance"],
    accentClass: "bg-emerald-50 text-emerald-700",
  },
  "web-hosting-solutions": {
    icon: ServerCog,
    description: "Hosting, deployment, domain support, backups, and uptime-minded web operations.",
    points: ["Managed hosting", "Deployment support", "Backup planning"],
    accentClass: "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary-dark)]",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: "Solutions | iTechBD Ltd",
    description: "Explore iTechBD software, IT, and web hosting solution services.",
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const bootstrap = await getPublicBootstrap(locale);
  const solutions = bootstrap.navigation.find((item) => item.key === "solutions")?.children ?? fallbackSolutions;

  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="brand-grid absolute inset-0 opacity-45" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--surface-tint)] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">
              <Sparkles aria-hidden className="h-4 w-4" />
              Solutions
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[color:var(--text-heading)] sm:text-4xl lg:text-5xl">
              Practical digital support for your next step
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-body)] sm:text-base">
              Choose the service area that fits your need, from custom software to IT support and dependable web hosting.
            </p>
          </div>
          <div className="grid max-w-sm gap-2 rounded-lg border border-[color:var(--border-default)] bg-white/86 p-4 shadow-[var(--shadow-card)]">
            <div className="text-3xl font-black text-[color:var(--text-heading)]">{solutions.length}</div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">Service paths</div>
            <p className="text-sm leading-6 text-[color:var(--text-body)]">Quick access to every solution category.</p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--brand-secondary)]/20 bg-[color:var(--surface-tint)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--brand-secondary-dark)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-secondary)]" />
                Service Areas
              </div>
              <h2 className="mt-3 text-2xl font-black leading-tight text-[color:var(--text-heading)] sm:text-3xl">
                Explore our solutions
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--text-body)]">
              Each solution page has more detail about services, support, and how the team can help.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {solutions.map((solution, index) => {
              const meta = solutionMeta[solution.key] ?? solutionMeta[fallbackSolutions[index % fallbackSolutions.length].key];
              const Icon = meta.icon;

              return (
                <LocaleLink
                  key={solution.key}
                  locale={locale}
                  href={solution.href}
                  className="focus-ring group flex min-h-full flex-col rounded-lg border border-[color:var(--border-default)] bg-white p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/35 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${meta.accentClass}`}>
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-[color:var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--brand-secondary)]" />
                  </div>
                  <h2 className="mt-4 text-xl font-black leading-tight text-[color:var(--text-heading)]">{solution.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--text-body)]">{meta.description}</p>
                  <div className="mt-4 grid gap-1.5">
                    {meta.points.map((point) => (
                      <span key={point} className="inline-flex items-center gap-2 text-xs font-bold text-[color:var(--text-heading)]">
                        <CheckCircle2 aria-hidden className="h-3.5 w-3.5 shrink-0 text-[color:var(--brand-primary)]" />
                        {point}
                      </span>
                    ))}
                  </div>
                </LocaleLink>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <Globe2 aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />
              <span className="text-xs font-black text-[color:var(--text-heading)] sm:text-sm">Business-ready delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
              <span className="text-xs font-black text-[color:var(--text-heading)] sm:text-sm">Reliable support process</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ServerCog aria-hidden className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-black text-[color:var(--text-heading)] sm:text-sm">Practical technical guidance</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="brand-grid grid gap-4 rounded-lg bg-[color:var(--text-heading)] p-5 text-white shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">
                <MessageCircle aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
                Need help?
              </div>
              <h2 className="mt-3 text-2xl font-black leading-tight">Need the right solution for your team?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/76">
                Tell us what you are building or fixing, and we will help you choose the best service path.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <LocaleLink
                locale={locale}
                href="/contact"
                className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-secondary)] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
              >
                Contact Us
                <ArrowRight aria-hidden className="h-4 w-4" />
              </LocaleLink>
              <LocaleLink
                locale={locale}
                href="/courses"
                className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-white hover:text-[color:var(--text-heading)]"
              >
                Explore Courses
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
