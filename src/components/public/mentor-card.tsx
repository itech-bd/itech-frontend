import Image from "next/image";
import { ArrowRight, UserRound } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { MentorSummary } from "@/lib/api/types";
import { resolveMediaUrl } from "@/lib/media";

export function MentorCard({ mentor, locale }: { mentor: MentorSummary; locale: AppLocale }) {
  const profileImage = resolveMediaUrl(mentor.profile_image_url);
  const initials = mentor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <article className="surface-card group p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-primary)]/35">
      <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="focus-ring block">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] p-[3px]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
            {profileImage ? (
              <div className="relative h-full w-full overflow-hidden rounded-lg bg-[color:var(--surface-secondary)]">
                <Image src={profileImage} alt={mentor.name} fill className="object-cover object-center transition duration-500 group-hover:scale-105" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-[color:var(--brand-primary-light)] text-2xl font-black text-[color:var(--brand-primary)]">
                {initials || <UserRound aria-hidden className="h-8 w-8" />}
              </div>
            )}
          </div>
        </div>
      </LocaleLink>

      <div className="mt-5">
        <h3 className="text-lg font-black text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {mentor.name}
          </LocaleLink>
        </h3>
        <p className="mt-1 min-h-[2.5rem] text-sm leading-5 text-[color:var(--text-body)]">{mentor.topic ?? "Professional Mentor"}</p>
        <LocaleLink
          locale={locale}
          href={`/mentors/${mentor.slug ?? mentor.id}`}
          className="focus-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[color:var(--brand-primary)]/20 px-4 py-2 text-xs font-extrabold text-[color:var(--brand-primary)] transition hover:bg-[color:var(--brand-primary)] hover:text-white"
        >
          View profile
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}
