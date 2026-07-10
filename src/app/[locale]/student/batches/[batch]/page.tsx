import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getStudentBatch } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentBatchDetailPage({ params }: { params: Promise<{ locale: string; batch: string }> }) {
  const { locale, batch } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getStudentBatch(locale, batch);
  return (
    <main>
      <SectionTitle kicker="Batch" title={data.batch.name} subtitle={data.batch.course?.title ?? undefined} align="left" />
      <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>Status: {data.enrollment.status}</div>
        <div className="mt-2">Access: {data.schedule_access ? "Approved" : "Pending"}</div>
        {data.schedule_access ? (
          <div className="mt-4 space-y-3">
            {data.schedules.map((schedule) => (
              <div key={schedule.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-bold text-slate-950">{schedule.topic}</div>
                <div className="mt-1 text-sm text-slate-500">{schedule.class_date ?? "TBA"}</div>
                {schedule.live_class_link ? <a href={schedule.live_class_link} className="mt-2 inline-flex text-sm font-bold text-[color:var(--brand-primary)]">Live class link</a> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
