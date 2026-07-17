import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Quote } from "lucide-react";
import { ReviewCard } from "@/components/public/review-card";
import { PageHero } from "@/components/ui/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationNav } from "@/components/ui/pagination";
import { listPublicReviews } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatNumber } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: "Reviews | iTechBD Ltd" };
}

export default async function ReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const reviews = await listPublicReviews(locale, { page, per_page: 12 });

  return (
    <main>
      <PageHero
        locale={locale}
        kicker="Success Stories"
        title="What learners say"
        subtitle="Approved reviews are loaded directly from the API. Video testimonials will appear here when the backend provides them."
        primaryHref="/courses"
        primaryLabel="Browse courses"
        secondaryHref="/contact"
        secondaryLabel="Talk to us"
      >
        <div className="surface-card p-5">
          <Quote aria-hidden className="h-8 w-8 text-[color:var(--brand-primary)]" />
          <p className="mt-4 text-sm font-bold text-[color:var(--text-muted)]">Approved reviews</p>
          <div className="mt-1 text-4xl font-black text-[color:var(--text-heading)]">{formatNumber(reviews.pagination.total, locale)}</div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          {reviews.items.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {reviews.items.map((review) => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </div>
          ) : (
            <EmptyState title="No reviews published" message="Approved learner feedback will appear here once it is published." />
          )}
          {reviews.items.length ? <PaginationNav locale={locale} pagination={reviews.pagination} basePath="/reviews" searchParams={{}} /> : null}
        </div>
      </section>
    </main>
  );
}
