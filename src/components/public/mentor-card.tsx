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
    <article className="group overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-white text-center shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
      <div className="h-20 bg-[linear-gradient(90deg,var(--brand-primary-deep)_0%,var(--brand-primary)_34%,var(--brand-red)_62%,var(--brand-secondary)_100%)]" />
      <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="focus-ring -mt-14 block">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-lg bg-white p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.2)]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded bg-white">
            {profileImage ? (
              <div className="relative h-full w-full overflow-hidden rounded bg-[color:var(--surface-secondary)]">
                <Image src={profileImage} alt={mentor.name} fill className="object-cover object-center transition duration-500 group-hover:scale-105" unoptimized />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded bg-[color:var(--brand-primary-light)] text-2xl font-black text-[color:var(--brand-primary)]">
                {initials || <UserRound aria-hidden className="h-8 w-8" />}
              </div>
            )}
          </div>
        </div>
      </LocaleLink>

      <div className="p-5 pt-4">
        <h3 className="text-base font-black uppercase text-[color:var(--text-heading)]">
          <LocaleLink locale={locale} href={`/mentors/${mentor.slug ?? mentor.id}`} className="focus-ring hover:text-[color:var(--brand-primary)]">
            {mentor.name}
          </LocaleLink>
        </h3>
        <p className="mx-auto mt-1 min-h-10 max-w-48 text-xs font-bold leading-5 text-[color:var(--brand-secondary)]">{mentor.topic ?? "Professional Mentor"}</p>
        <LocaleLink
          locale={locale}
          href={`/mentors/${mentor.slug ?? mentor.id}`}
          className="focus-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[color:var(--brand-secondary)]/35 px-4 py-2 text-xs font-extrabold text-[color:var(--brand-secondary)] transition hover:bg-[color:var(--brand-secondary)] hover:text-white"
        >
          Details
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}
