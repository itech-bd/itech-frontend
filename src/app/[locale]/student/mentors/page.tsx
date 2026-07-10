import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { PaginationNav } from "@/components/ui/pagination";
import { listStudentMentors } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentMentorsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search : "";
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const mentors = await listStudentMentors(locale, { search, page, per_page: 12 });
  return (
    <main>
      <SectionTitle kicker="Mentors" title="Your mentors" subtitle="Mentors associated with your approved batches." align="left" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mentors.items.map((mentor) => (
          <div key={mentor.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="font-black text-slate-950">{mentor.name}</div>
            <div className="mt-1 text-sm text-slate-500">{mentor.topic ?? "Mentor"}</div>
          </div>
        ))}
      </div>
      <PaginationNav locale={locale} pagination={mentors.pagination} basePath="/student/mentors" searchParams={{ search }} />
    </main>
  );
}
