import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { ReviewCard } from "@/components/public/review-card";
import { listPublicReviews } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "রিভিউ" : "Reviews" };
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const reviews = await listPublicReviews(locale, { page: 1, per_page: 12 });

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <SectionTitle kicker="Reviews" title="What learners say" align="left" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.items.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      </div>
    </main>
  );
}
