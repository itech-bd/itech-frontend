import Image from "next/image";
import { LocaleLink } from "@/components/ui/link";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { AppLocale } from "@/lib/i18n/routing";
import type { CourseSummary } from "@/lib/api/types";

export function CourseCard({ course, locale }: { course: CourseSummary; locale: AppLocale }) {
  const lowest =
    course.pricing?.online_discount_price ??
    course.pricing?.offline_discount_price ??
    course.pricing?.discount_price ??
    course.pricing?.old_price ??
    null;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-orange)]/40 hover:shadow-xl hover:shadow-[color:var(--brand-primary)]/10">
      <LocaleLink locale={locale} href={`/courses/${course.slug ?? course.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[color:var(--brand-primary)] via-[#4b4bb1] to-[color:var(--brand-orange)]">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-2xl font-black text-white">
              {course.title}
            </div>
          )}
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[color:var(--brand-primary)] shadow-sm">
            {course.track ?? "Professional Skill"}
          </div>
          {lowest ? (
            <div className="absolute bottom-4 right-4 rounded-full bg-[color:var(--brand-red)] px-3 py-1 text-xs font-extrabold text-white shadow-lg">
              {formatCurrency(lowest, locale)}
            </div>
          ) : null}
        </div>
      </LocaleLink>

      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-slate-950">
          <LocaleLink locale={locale} href={`/courses/${course.slug ?? course.id}`} className="hover:text-[color:var(--brand-primary)]">
            {course.title}
          </LocaleLink>
        </h3>
        {course.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{course.description}</p> : null}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <div className="font-semibold text-slate-500">{course.batches?.[0]?.start_date ? formatDate(course.batches[0].start_date, locale) : "Batch updates soon"}</div>
          <LocaleLink locale={locale} href={`/checkout/courses/${course.slug ?? course.id}`} className="rounded-full bg-[color:var(--brand-orange)] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[color:var(--brand-red)]">
            Enroll
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}
