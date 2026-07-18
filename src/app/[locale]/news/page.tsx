import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Newspaper, Search } from "lucide-react";
import { NewsCard } from "@/components/public/news-card";
import { PaginationNav } from "@/components/ui/pagination";
import { PageHero } from "@/components/ui/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublicNews } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatNumber } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: "News | iTechBD Ltd" };
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
    <main>
      <PageHero
        locale={locale}
        kicker="News"
        title="Latest announcements"
        subtitle="Stay updated with announcements, events, and institute news."
        primaryHref="/courses"
        primaryLabel="Browse courses"
        secondaryHref="/contact"
        secondaryLabel="Contact team"
      >
        <div className="surface-card p-5">
          <Newspaper aria-hidden className="h-8 w-8 text-[color:var(--brand-primary)]" />
          <p className="mt-4 text-sm font-bold text-[color:var(--text-muted)]">Published updates</p>
          <div className="mt-1 text-4xl font-black text-[color:var(--text-heading)]">{formatNumber(news.pagination.total, locale)}</div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <form className="surface-card p-4">
            <label htmlFor="news-search" className="block text-sm font-extrabold text-[color:var(--text-heading)]">Search news</label>
            <div className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-white px-3">
              <Search aria-hidden className="h-4 w-4 text-[color:var(--text-muted)]" />
              <input id="news-search" name="search" defaultValue={search} placeholder="Search announcement" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none" />
              <button type="submit" className="focus-ring rounded-lg bg-[color:var(--brand-primary)] px-4 py-2 text-sm font-extrabold text-white">Search</button>
            </div>
          </form>
          {news.items.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {news.items.map((item) => (
                <NewsCard key={item.id} news={item} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-8" title="No updates found" message="Try another keyword or clear the search field." />
          )}
          {news.items.length ? <PaginationNav locale={locale} pagination={news.pagination} basePath="/news" searchParams={{ search }} /> : null}
        </div>
      </section>
    </main>
  );
}
