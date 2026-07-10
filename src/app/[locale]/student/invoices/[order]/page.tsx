import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getStudentInvoice } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/formatting";

export default async function StudentInvoiceDetailPage({ params }: { params: Promise<{ locale: string; order: string }> }) {
  const { locale, order } = await params;
  if (!isLocale(locale)) notFound();
  const invoice = await getStudentInvoice(locale, order);
  return (
    <main>
      <SectionTitle kicker="Invoice" title={`Invoice #${invoice.id}`} subtitle={invoice.course?.title ?? undefined} align="left" />
      <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>Status: {invoice.status}</div>
        <div className="mt-2">Amount: {formatCurrency(invoice.amount, locale)}</div>
        <a href={`/api/student/invoices/${invoice.id}/download`} className="mt-4 inline-flex rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white">
          Download PDF
        </a>
      </div>
    </main>
  );
}
