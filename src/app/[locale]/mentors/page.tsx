import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { MentorCard } from "@/components/public/mentor-card";
import { PaginationNav } from "@/components/ui/pagination";
import { listPublicMentors } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "মেন্টর" : "Mentors" };
}

export default async function MentorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search : "";
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const mentors = await listPublicMentors(locale, { search, page, per_page: 12 });

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionTitle kicker="Mentors" title="Learn from industry practitioners" subtitle="Search the mentor directory loaded from the API." align="left" />
        <form className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="mentor-search" className="block text-sm font-extrabold text-slate-900">Search mentors</label>
          <input id="mentor-search" name="search" defaultValue={search} className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        </form>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.items.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} locale={locale} />
          ))}
        </div>
        <PaginationNav locale={locale} pagination={mentors.pagination} basePath="/mentors" searchParams={{ search }} />
      </div>
    </main>
  );
}
