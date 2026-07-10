import Image from "next/image";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { NewsSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/formatting";

export function NewsCard({ news, locale }: { news: NewsSummary; locale: AppLocale }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-orange)]/40 hover:shadow-xl hover:shadow-[color:var(--brand-primary)]/10">
      <LocaleLink locale={locale} href={`/news/${news.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[color:var(--brand-primary)] via-[color:var(--brand-red)] to-[color:var(--brand-orange)]">
          {news.image_url ? (
            <Image src={news.image_url} alt={news.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-xl font-black text-white">iTechBD Update</div>
          )}
          {news.published_at ? (
            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[color:var(--brand-primary)]">
              {formatDate(news.published_at, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>
      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-slate-950">
          <LocaleLink locale={locale} href={`/news/${news.slug}`} className="hover:text-[color:var(--brand-primary)]">
            {news.title}
          </LocaleLink>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{news.excerpt ?? ""}</p>
      </div>
    </article>
  );
}
