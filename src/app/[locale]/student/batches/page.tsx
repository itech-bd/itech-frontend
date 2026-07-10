import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { PaginationNav } from "@/components/ui/pagination";
import { listStudentBatches } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/formatting";

export default async function StudentBatchesPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const status = typeof query.status === "string" ? (query.status as "pending" | "approved") : undefined;
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const batches = await listStudentBatches(locale, { status, page, per_page: 12 });

  return (
    <main>
      <SectionTitle kicker="My Batches" title="Batch progress" subtitle="Pending and approved batches are shown here." align="left" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {batches.items.map((batch) => (
          <div key={batch.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="font-black text-slate-950">{batch.name}</div>
            <div className="mt-1 text-sm text-slate-500">{batch.course?.title ?? "Course"} · {formatDate(batch.start_date, locale)}</div>
            <div className="mt-2 text-sm text-slate-500">Status: {batch.enrollment?.status ?? batch.status}</div>
          </div>
        ))}
      </div>
      <PaginationNav locale={locale} pagination={batches.pagination} basePath="/student/batches" searchParams={{ status }} />
    </main>
  );
}
