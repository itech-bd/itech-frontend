import { notFound } from "next/navigation";
import { ArrowRight, FileText, WalletCards } from "lucide-react";
import { PaginationNav } from "@/components/ui/pagination";
import { LocaleLink } from "@/components/ui/link";
import { StudentCard, StudentEmptyState, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { listStudentInvoices } from "@/lib/api/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentInvoicesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const status = typeof query.status === "string" ? (query.status as "pending" | "paid" | "cancelled") : undefined;
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const invoices = await listStudentInvoices(locale, { status, page, per_page: 10 });
  const totalVisible = invoices.items.reduce((sum, invoice) => sum + Number(invoice.amount ?? 0), 0);

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Invoices"
        title="Your payment records"
        description="Review course payments, invoice status, and download receipts whenever you need them."
        action={
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
            <WalletCards aria-hidden className="h-4 w-4" />
            {formatCurrency(totalVisible, locale)}
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterLink locale={locale} href="/student/invoices" active={!status} label="All invoices" />
        <FilterLink locale={locale} href="/student/invoices?status=paid" active={status === "paid"} label="Paid" />
        <FilterLink locale={locale} href="/student/invoices?status=pending" active={status === "pending"} label="Pending" />
        <FilterLink locale={locale} href="/student/invoices?status=cancelled" active={status === "cancelled"} label="Cancelled" />
      </div>

      {invoices.items.length ? (
        <div className="grid gap-4">
          {invoices.items.map((invoice) => (
            <StudentCard key={invoice.id} className="transition hover:-translate-y-0.5 hover:border-[color:var(--brand-secondary)]/40">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
                    <FileText aria-hidden className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-[color:var(--text-heading)]">#INV-{invoice.id}</h2>
                      <StudentStatusBadge status={invoice.status} />
                    </div>
                    <p className="mt-1 text-sm font-bold text-[color:var(--text-body)]">{invoice.course?.title ?? "Course"}</p>
                    <p className="mt-1 text-xs font-semibold text-[color:var(--text-muted)]">
                      {invoice.batch?.name ?? "Batch not selected"} - {formatDate(invoice.created_at, locale)}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-[color:var(--surface-secondary)] px-4 py-3 lg:text-right">
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">Amount</div>
                  <div className="mt-1 text-xl font-black text-[color:var(--text-heading)]">{formatCurrency(invoice.amount, locale)}</div>
                </div>
                <LocaleLink
                  locale={locale}
                  href={`/student/invoices/${invoice.id}`}
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
                >
                  Details
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </LocaleLink>
              </div>
            </StudentCard>
          ))}
        </div>
      ) : (
        <StudentEmptyState title="No invoices found" message="Invoices will appear here after you apply or complete a payment." />
      )}

      <PaginationNav locale={locale} pagination={invoices.pagination} basePath="/student/invoices" searchParams={{ status }} />
    </main>
  );
}

function FilterLink({ locale, href, active, label }: { locale: "en" | "bn"; href: string; active: boolean; label: string }) {
  return (
    <LocaleLink
      locale={locale}
      href={href}
      className={
        active
          ? "focus-ring rounded-full bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-black text-white"
          : "focus-ring rounded-full border border-[color:var(--border-default)] bg-white px-4 py-2 text-xs font-black text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
      }
    >
      {label}
    </LocaleLink>
  );
}
