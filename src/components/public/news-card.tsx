import Image from "next/image";
import { ArrowRight, Newspaper } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { NewsSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/formatting";
import { resolveMediaUrl } from "@/lib/media";

export function NewsCard({ news, locale }: { news: NewsSummary; locale: AppLocale }) {
  const image = resolveMediaUrl(news.image_url);

  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/35">
      <LocaleLink locale={locale} href={`/news/${news.slug}`} className="focus-ring block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))]">
          {image ? (
            <Image src={image} alt={news.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="brand-grid flex h-full items-center justify-center p-8 text-center text-xl font-black text-white">
              <Newspaper aria-hidden className="mr-2 h-6 w-6" />
              iTechBD Update
            </div>
          )}
          {news.published_at ? (
            <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-extrabold text-[color:var(--brand-primary-dark)]">
              {formatDate(news.published_at, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-black leading-snug text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/news/${news.slug}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {news.title}
          </LocaleLink>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--text-body)]">{news.excerpt ?? ""}</p>
        <LocaleLink
          locale={locale}
          href={`/news/${news.slug}`}
          className="focus-ring mt-auto inline-flex min-h-10 items-center gap-2 pt-5 text-sm font-extrabold text-[color:var(--brand-primary)]"
        >
          Read update
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}
