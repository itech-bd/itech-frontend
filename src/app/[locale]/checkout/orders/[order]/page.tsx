import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getCheckoutOrder } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { formatCurrency } from "@/lib/formatting";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; order: string }> }): Promise<Metadata> {
  const { locale, order } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `Order ${order}` };
}

export default async function CheckoutOrderPage({ params }: { params: Promise<{ locale: string; order: string }> }) {
  const { locale, order } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getCheckoutOrder(locale, order);
  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
        <SectionTitle kicker="Order" title={`Order #${data.id}`} subtitle={data.course?.title ?? undefined} align="left" />
        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div>Status: {data.status}</div>
          <div className="mt-2">Amount: {formatCurrency(data.amount, locale)}</div>
        </div>
      </div>
    </main>
  );
}
