import { notFound } from "next/navigation";
import { CmsPage } from "@/components/public/cms-page";
import { getPublicPage } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function WebHostingSolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicPage(locale, "web-hosting-solutions");
  return <CmsPage locale={locale} data={data} heading="Web Hosting Solutions" fallbackDescription="<p>Hosting and deployment services for modern websites.</p>" />;
}
