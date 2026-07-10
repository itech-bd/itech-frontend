import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { NewsCard } from "@/components/public/news-card";
import { PaginationNav } from "@/components/ui/pagination";
import { listPublicNews } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "সংবাদ" : "News" };
}

export default async function NewsPage({
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
  const news = await listPublicNews(locale, { search, page, per_page: 9 });

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionTitle kicker="News" title="Latest announcements" subtitle="Published news from the API appears automatically." align="left" />
        <form className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="news-search" className="block text-sm font-extrabold text-slate-900">Search news</label>
          <input id="news-search" name="search" defaultValue={search} className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        </form>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {news.items.map((item) => (
            <NewsCard key={item.id} news={item} locale={locale} />
          ))}
        </div>
        <PaginationNav locale={locale} pagination={news.pagination} basePath="/news" searchParams={{ search }} />
      </div>
    </main>
  );
}
