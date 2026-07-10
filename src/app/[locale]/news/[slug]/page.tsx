import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { NewsCard } from "@/components/public/news-card";
import { getPublicNews } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { sanitizeCmsHtml } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return { title: slug };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicNews(locale, slug);

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
        <SectionTitle kicker="News" title={data.news.title} subtitle={data.news.excerpt ?? undefined} align="left" />
        <article className="site-prose mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(data.news.body) }} />
        {data.related_news.length ? (
          <section className="mt-14">
            <SectionTitle kicker="Related News" title="More updates" align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {data.related_news.map((item) => (
                <NewsCard key={item.id} news={item} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
