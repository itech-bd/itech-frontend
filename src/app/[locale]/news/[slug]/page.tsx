import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { NewsCard } from "@/components/public/news-card";
import { PageHero } from "@/components/ui/page-hero";
import { getPublicNews } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import { resolveMediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `${slug} | iTechBD Ltd` };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicNews(locale, slug);
  const image = resolveMediaUrl(data.news.image_url);

  return (
    <main>
      <PageHero
        locale={locale}
        kicker={data.news.published_at ? formatDate(data.news.published_at, locale) : "News"}
        title={data.news.title}
        subtitle={data.news.excerpt ?? undefined}
        primaryHref="/news"
        primaryLabel="All updates"
        secondaryHref="/contact"
        secondaryLabel="Contact team"
      >
        <div className="surface-card overflow-hidden p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
            {image ? (
              <Image src={image} alt={data.news.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" priority />
            ) : (
              <div className="brand-grid grid h-full place-items-center text-white">
                <Newspaper aria-hidden className="h-14 w-14" />
              </div>
            )}
          </div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
          <article className="site-prose surface-card p-5 sm:p-7" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(data.news.body) }} />
        </div>
      </section>

      {data.related_news.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <SectionTitle kicker="Related News" title="More updates" align="left" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {data.related_news.map((item) => (
                <NewsCard key={item.id} news={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
