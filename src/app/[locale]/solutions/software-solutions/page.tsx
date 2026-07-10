import { notFound } from "next/navigation";
import { CmsPage } from "@/components/public/cms-page";
import { getPublicPage } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function SoftwareSolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicPage(locale, "software-solutions");
  return <CmsPage locale={locale} data={data} heading="Software Solutions" fallbackDescription="<p>Software solutions and custom development services.</p>" />;
}
