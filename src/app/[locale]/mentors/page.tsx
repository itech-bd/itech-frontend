import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Search, UsersRound } from "lucide-react";
import { MentorCard } from "@/components/public/mentor-card";
import { PaginationNav } from "@/components/ui/pagination";
import { PageHero } from "@/components/ui/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublicMentors } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatNumber } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: "Mentors | iTechBD Ltd" };
}

export default async function MentorsPage({
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
  const mentors = await listPublicMentors(locale, { search, page, per_page: 12 });

  return (
    <main>
      <PageHero
        locale={locale}
        kicker="Mentors"
        title="Learn from industry practitioners"
        subtitle="Meet experienced instructors, explore their expertise, and find the courses they guide."
        primaryHref="/courses"
        primaryLabel="Browse courses"
        secondaryHref="/contact"
        secondaryLabel="Contact team"
      >
        <div className="surface-card p-5">
          <UsersRound aria-hidden className="h-8 w-8 text-[color:var(--brand-primary)]" />
          <p className="mt-4 text-sm font-bold text-[color:var(--text-muted)]">Published mentors</p>
          <div className="mt-1 text-4xl font-black text-[color:var(--text-heading)]">{formatNumber(mentors.pagination.total, locale)}</div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <form className="surface-card p-4">
            <label htmlFor="mentor-search" className="block text-sm font-extrabold text-[color:var(--text-heading)]">Search mentors</label>
            <div className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-white px-3">
              <Search aria-hidden className="h-4 w-4 text-[color:var(--text-muted)]" />
              <input id="mentor-search" name="search" defaultValue={search} placeholder="Name, expertise, or topic" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none" />
              <button type="submit" className="focus-ring rounded-lg bg-[color:var(--brand-primary)] px-4 py-2 text-sm font-extrabold text-white">Search</button>
            </div>
          </form>

          {mentors.items.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mentors.items.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-8" title="No mentors found" message="Try another search keyword." />
          )}
          {mentors.items.length ? <PaginationNav locale={locale} pagination={mentors.pagination} basePath="/mentors" searchParams={{ search }} /> : null}
        </div>
      </section>
    </main>
  );
}
