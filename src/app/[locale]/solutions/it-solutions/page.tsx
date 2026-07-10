import { notFound } from "next/navigation";
import { CmsPage } from "@/components/public/cms-page";
import { getPublicPage } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function ItSolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicPage(locale, "it-solutions");
  return <CmsPage locale={locale} data={data} heading="IT Solutions" fallbackDescription="<p>IT support, consulting, and infrastructure services.</p>" />;
}
