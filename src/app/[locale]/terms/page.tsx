import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPage } from "@/components/public/cms-page";
import { getPublicPage } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "শর্তাবলী" : "Terms" };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicPage(locale, "terms");
  return <CmsPage locale={locale} data={data} heading={locale === "bn" ? "শর্তাবলী" : "Terms"} fallbackDescription="<p>Terms and conditions are published here.</p>" />;
}
