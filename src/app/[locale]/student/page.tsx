import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { StudentStats } from "@/components/student/student-stats";
import { CourseCard } from "@/components/public/course-card";
import { getStudentDashboard } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dashboard = await getStudentDashboard(locale);

  return (
    <main className="space-y-6">
      <SectionTitle kicker="Dashboard" title={`Welcome back, ${dashboard.user.name}`} subtitle="Track your enrolled courses, batches, mentors, and invoices in one workspace." align="left" />
      <StudentStats stats={dashboard.stats} />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Upcoming Classes</h2>
          <div className="mt-4 space-y-3">
            {dashboard.upcoming_schedules.length ? dashboard.upcoming_schedules.map((schedule) => (
              <div key={schedule.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="font-bold text-slate-950">{schedule.topic}</div>
                <div className="mt-1 text-sm text-slate-500">{schedule.class_date ?? "TBA"} · {schedule.batch?.name ?? "Batch"}</div>
              </div>
            )) : <p className="text-sm text-slate-500">No upcoming class found.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Recent Batches</h2>
            <div className="mt-4 space-y-3">
              {dashboard.recent_batches.length ? dashboard.recent_batches.map((batch) => (
                <div key={batch.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-bold text-slate-950">{batch.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{batch.course?.title ?? "Course"}</div>
                </div>
              )) : <p className="text-sm text-slate-500">No batch enrolled.</p>}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Recent Invoices</h2>
            <div className="mt-4 space-y-3">
              {dashboard.recent_orders.length ? dashboard.recent_orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-bold text-slate-950">#INV-{order.id}</div>
                  <div className="mt-1 text-sm text-slate-500">{order.course?.title ?? "Course"} · {order.status}</div>
                </div>
              )) : <p className="text-sm text-slate-500">No invoice found.</p>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
