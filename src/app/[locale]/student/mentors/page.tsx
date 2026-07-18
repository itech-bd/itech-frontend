import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Search, UserRound, UsersRound } from "lucide-react";
import { PaginationNav } from "@/components/ui/pagination";
import { LocaleLink } from "@/components/ui/link";
import { StudentEmptyState, StudentPageHeader } from "@/components/student/student-panel-ui";
import { listStudentMentors } from "@/lib/api/site";
import type { MentorSummary } from "@/lib/api/types";
import { formatNumber } from "@/lib/formatting";
import { isLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

export default async function StudentMentorsPage({
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
  const mentors = await listStudentMentors(locale, { search, page, per_page: 9 });

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="My Mentors"
        title="People guiding your learning"
        description="Mentors connected with your approved batches are shown here for quick access."
        action={
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--brand-primary-light)] px-4 py-3 text-sm font-black text-[color:var(--brand-primary-dark)]">
            <UsersRound aria-hidden className="h-4 w-4" />
            {formatNumber(mentors.pagination.total, locale)} mentor{mentors.pagination.total === 1 ? "" : "s"}
          </div>
        }
      />

      <form className="rounded-[1.5rem] border border-white/80 bg-white/85 p-3 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-4">
        <label htmlFor="mentor-search" className="sr-only">Search mentors</label>
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4">
          <Search aria-hidden className="h-4 w-4 text-[color:var(--text-muted)]" />
          <input
            id="mentor-search"
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search mentor name or topic"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold text-[color:var(--text-heading)] outline-none placeholder:text-[color:var(--text-muted)]"
          />
          <button type="submit" className="rounded-xl bg-[color:var(--brand-primary)] px-4 py-2 text-xs font-extrabold text-white">
            Search
          </button>
        </div>
      </form>

      {mentors.items.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mentors.items.map((mentor) => (
            <StudentMentorCard key={mentor.id} mentor={mentor} locale={locale} />
          ))}
        </div>
      ) : (
        <StudentEmptyState title="No mentors found" message="Approved batch mentors will appear here when they are assigned to your class." />
      )}

      <PaginationNav locale={locale} pagination={mentors.pagination} basePath="/student/mentors" searchParams={{ search }} />
    </main>
  );
}

function StudentMentorCard({ mentor, locale }: { mentor: MentorSummary; locale: "en" | "bn" }) {
  const profileImage = resolveMediaUrl(mentor.profile_image_url);
  const initials = mentor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border-default)] bg-white text-center shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:border-[color:var(--brand-secondary)]/45">
      <div className="h-20 bg-[linear-gradient(90deg,var(--brand-primary-deep)_0%,var(--brand-primary)_34%,var(--brand-red)_62%,var(--brand-secondary)_100%)]" />
      <div className="-mt-14">
        <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.18)]">
          {profileImage ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-[color:var(--surface-secondary)]">
              <Image src={profileImage} alt={mentor.name} fill className="object-cover object-center" sizes="128px" unoptimized />
            </div>
          ) : (
            <div className="grid h-full w-full place-items-center rounded-xl bg-[color:var(--brand-primary-light)] text-2xl font-black text-[color:var(--brand-primary)]">
              {initials || <UserRound aria-hidden className="h-8 w-8" />}
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-lg font-black uppercase text-[color:var(--text-heading)]">{mentor.name}</h2>
        <p className="mx-auto mt-1 min-h-10 max-w-56 text-sm font-bold leading-5 text-[color:var(--brand-secondary)]">{mentor.topic ?? "Professional Mentor"}</p>
        <LocaleLink
          locale={locale}
          href={`/mentors/${mentor.slug ?? mentor.id}`}
          className="focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--brand-secondary)]/35 px-5 py-3 text-sm font-extrabold text-[color:var(--brand-secondary)] transition hover:bg-[color:var(--brand-secondary)] hover:text-white"
        >
          View profile
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LocaleLink>
      </div>
    </article>
  );
}
