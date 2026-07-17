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
  return { title: "About | iTechBD Ltd" };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicPage(locale, "about");
  return (
    <CmsPage
      locale={locale}
      data={data}
      heading="About"
      fallbackDescription="<p>Learn more about iTechBD Ltd, our mission, and how we help learners build practical skills.</p>"
    />
  );
}
