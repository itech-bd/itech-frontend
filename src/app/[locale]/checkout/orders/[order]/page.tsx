import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  FileText,
  GraduationCap,
  LayoutDashboard,
  WalletCards,
} from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { getCheckoutOrder } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; order: string }> }): Promise<Metadata> {
  const { locale, order } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `Admission request #${order}` };
}

export default async function CheckoutOrderPage({ params }: { params: Promise<{ locale: string; order: string }> }) {
  const { locale, order } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getCheckoutOrder(locale, order);
  const copy = orderStatusCopy(data.status);
  const courseTitle = data.course?.title ?? "Selected course";
  const batchName = data.batch?.name ?? "Batch not selected";

  return (
    <main className="bg-[linear-gradient(180deg,#f7fbff_0%,#fff8ef_100%)] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_26px_80px_rgba(15,23,42,0.10)]">
          <div className="relative bg-[linear-gradient(135deg,var(--brand-primary-deep),var(--brand-primary)_56%,var(--brand-secondary))] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/82">
                  <CheckCircle2 aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
                  {copy.kicker}
                </div>
                <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/76 sm:text-base">
                  {copy.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <LocaleLink
                    locale={locale}
                    href={`/student/invoices/${data.id}`}
                    className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
                  >
                    View invoice
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </LocaleLink>
                  <LocaleLink
                    locale={locale}
                    href="/student"
                    className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-[color:var(--brand-primary)]"
                  >
                    <LayoutDashboard aria-hidden className="h-4 w-4" />
                    Student dashboard
                  </LocaleLink>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/15 bg-white/12 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-white/66">Order total</span>
                  <StatusPill status={data.status} />
                </div>
                <div className="mt-5 text-4xl font-black">{formatCurrency(data.amount, locale)}</div>
                <div className="mt-2 text-sm font-semibold text-white/70">Invoice #INV-{data.id}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,.92fr)] lg:p-10">
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-[color:var(--text-heading)]">Admission summary</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SummaryItem
                  icon={<FileText aria-hidden className="h-4 w-4" />}
                  label="Invoice no"
                  value={`#INV-${data.id}`}
                />
                <SummaryItem
                  icon={<WalletCards aria-hidden className="h-4 w-4" />}
                  label="Amount"
                  value={formatCurrency(data.amount, locale)}
                />
                <SummaryItem
                  icon={<GraduationCap aria-hidden className="h-4 w-4" />}
                  label="Course"
                  value={courseTitle}
                  className="sm:col-span-2"
                />
                <SummaryItem
                  icon={<CalendarDays aria-hidden className="h-4 w-4" />}
                  label="Batch"
                  value={batchName}
                />
                <SummaryItem
                  icon={<Clock3 aria-hidden className="h-4 w-4" />}
                  label="Submitted"
                  value={formatDate(data.created_at, locale)}
                />
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] p-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <BadgeCheck aria-hidden className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-[color:var(--text-heading)]">What happens next</h2>
              <div className="mt-5 grid gap-3">
                {copy.steps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl bg-white p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--brand-primary-light)] text-xs font-black text-[color:var(--brand-primary)]">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold leading-6 text-[color:var(--text-body)]">{step}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <LocaleLink
            locale={locale}
            href="/student/courses"
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] shadow-sm transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <GraduationCap aria-hidden className="h-4 w-4" />
            My courses
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href="/student/invoices"
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] shadow-sm transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <FileText aria-hidden className="h-4 w-4" />
            All invoices
          </LocaleLink>
          <LocaleLink
            locale={locale}
            href="/student/explore-courses"
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[color:var(--text-heading)] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[color:var(--brand-primary-dark)] sm:col-span-2 lg:col-span-1"
          >
            <Compass aria-hidden className="h-4 w-4" />
            Explore more courses
          </LocaleLink>
        </div>
      </div>
    </main>
  );
}

function orderStatusCopy(status: string) {
  if (status === "paid") {
    return {
      kicker: "Admission confirmed",
      title: "Your course admission is confirmed.",
      description: "Payment is complete. You can now open your student dashboard, review your batch, and continue learning.",
      steps: [
        "Open My Courses to access your enrolled course and batch details.",
        "Check your upcoming class schedule from the student dashboard.",
        "Download your invoice anytime from the invoices page.",
      ],
    };
  }

  if (status === "cancelled") {
    return {
      kicker: "Order cancelled",
      title: "This admission request is cancelled.",
      description: "You can review the invoice record or submit a fresh admission request from Explore Courses.",
      steps: [
        "Review this invoice record if you need the order details.",
        "Browse available courses from Explore Courses.",
        "Submit a new admission request when you are ready.",
      ],
    };
  }

  return {
    kicker: "Request submitted",
    title: "Your admission request has been received.",
    description: "Your invoice has been created. The iTechBD team will review the request and confirm your admission status.",
    steps: [
      "Keep the invoice number for payment and admission reference.",
      "Track this request from your student invoices page.",
      "Once approved, the course and batch will appear in My Courses.",
    ],
  };
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const className =
    normalized === "paid"
      ? "bg-emerald-50 text-emerald-700"
      : normalized === "pending"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black capitalize", className)}>
      {normalized}
    </span>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-2xl border border-[color:var(--border-default)] bg-white p-4", className)}>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
        <span className="text-[color:var(--brand-primary)]">{icon}</span>
        {label}
      </div>
      <div className="mt-2 break-words text-base font-black text-[color:var(--text-heading)]">{value}</div>
    </div>
  );
}
