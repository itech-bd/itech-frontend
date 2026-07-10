import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { PaginationNav } from "@/components/ui/pagination";
import { listStudentInvoices } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/formatting";

export default async function StudentInvoicesPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const status = typeof query.status === "string" ? (query.status as "pending" | "paid" | "cancelled") : undefined;
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const invoices = await listStudentInvoices(locale, { status, page, per_page: 12 });
  return (
    <main>
      <SectionTitle kicker="Invoices" title="Your invoices" subtitle="Filter paid, pending, or cancelled orders." align="left" />
      <div className="mt-8 grid gap-4">
        {invoices.items.map((invoice) => (
          <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <div className="font-black text-slate-950">#INV-{invoice.id}</div>
              <div className="mt-1 text-sm text-slate-500">{invoice.course?.title ?? "Course"}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{invoice.status}</div>
              <div className="mt-1 text-lg font-black text-slate-950">{formatCurrency(invoice.amount, locale)}</div>
            </div>
          </div>
        ))}
      </div>
      <PaginationNav locale={locale} pagination={invoices.pagination} basePath="/student/invoices" searchParams={{ status }} />
    </main>
  );
}
