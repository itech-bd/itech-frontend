import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Download, FileText, GraduationCap, WalletCards } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { StudentCard, StudentInfoItem, StudentPageHeader, StudentStatusBadge } from "@/components/student/student-panel-ui";
import { getStudentInvoice } from "@/lib/api/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentInvoiceDetailPage({ params }: { params: Promise<{ locale: string; order: string }> }) {
  const { locale, order } = await params;
  if (!isLocale(locale)) notFound();
  const invoice = await getStudentInvoice(locale, order);

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Invoice"
        title={`Invoice #${invoice.id}`}
        description="A clean record of your course admission payment and batch selection."
        action={
          <LocaleLink
            locale={locale}
            href="/student/invoices"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-white px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            All invoices
          </LocaleLink>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <StudentCard className="bg-[linear-gradient(135deg,var(--text-heading),var(--brand-primary-deep))] text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/80">
                <FileText aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />
                Receipt summary
              </div>
              <h2 className="mt-6 text-4xl font-black">{formatCurrency(invoice.amount, locale)}</h2>
              <p className="mt-2 text-sm font-semibold text-white/70">{invoice.course?.title ?? "Course"}</p>
            </div>
            <StudentStatusBadge status={invoice.status} />
          </div>
          <a
            href={`/api/student/invoices/${invoice.id}/download`}
            className="focus-ring mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
          >
            <Download aria-hidden className="h-4 w-4" />
            Download PDF
          </a>
        </StudentCard>

        <StudentCard>
          <h2 className="text-2xl font-black text-[color:var(--text-heading)]">Invoice details</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StudentInfoItem icon={<FileText aria-hidden className="h-4 w-4" />} label="Invoice no" value={`#INV-${invoice.id}`} />
            <StudentInfoItem icon={<WalletCards aria-hidden className="h-4 w-4" />} label="Amount" value={formatCurrency(invoice.amount, locale)} />
            <StudentInfoItem icon={<GraduationCap aria-hidden className="h-4 w-4" />} label="Course" value={invoice.course?.title ?? "Course"} />
            <StudentInfoItem icon={<CalendarDays aria-hidden className="h-4 w-4" />} label="Created" value={formatDate(invoice.created_at, locale)} />
          </div>
          <div className="mt-5 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] p-4">
            <div className="text-xs font-black uppercase tracking-[0.12em] text-[color:var(--text-muted)]">Batch</div>
            <div className="mt-2 text-lg font-black text-[color:var(--text-heading)]">{invoice.batch?.name ?? "Batch not selected"}</div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">Batch type: {invoice.batch_type ?? "not selected"}</div>
          </div>
        </StudentCard>
      </section>
    </main>
  );
}
