import Image from "next/image";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { MentorSummary } from "@/lib/api/types";

export function MentorCard({ mentor, locale }: { mentor: MentorSummary; locale: AppLocale }) {
  const initials = mentor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <article className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[color:var(--brand-primary)]/10">
      <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="block">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-[color:var(--brand-primary)] via-[#6d3b8d] to-[color:var(--brand-orange)] p-[3px] shadow-lg shadow-slate-200/80">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-white p-[7px]">
            {mentor.profile_image_url ? (
              <div className="relative h-full w-full overflow-hidden rounded-[1.55rem] bg-slate-100">
                <Image src={mentor.profile_image_url} alt={mentor.name} fill className="object-contain object-center transition duration-500 group-hover:scale-105" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.55rem] bg-[color:var(--brand-primary)]/10 text-2xl font-black text-[color:var(--brand-primary)]">
                {initials || "M"}
              </div>
            )}
          </div>
        </div>
      </LocaleLink>

      <div className="mt-5 text-center">
        <h3 className="text-lg font-extrabold text-slate-950">
          <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="hover:text-[color:var(--brand-primary)]">
            {mentor.name}
          </LocaleLink>
        </h3>
        <p className="mt-1 min-h-[2.5rem] text-sm leading-5 text-slate-600">{mentor.topic ?? "Professional Mentor"}</p>
        <LocaleLink
          locale={locale}
          href={`/mentors/${mentor.slug ?? mentor.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-primary)]/15 px-4 py-2 text-xs font-extrabold text-[color:var(--brand-primary)] transition hover:bg-[color:var(--brand-primary)] hover:text-white"
        >
          View profile
        </LocaleLink>
      </div>
    </article>
  );
}
