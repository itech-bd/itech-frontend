import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getCheckoutPreview } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { checkoutAction } from "@/actions/checkout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; course: string }> }): Promise<Metadata> {
  const { locale, course } = await params;
  if (!isLocale(locale)) notFound();
  return { title: course };
}

export default async function CheckoutCoursePage({ params }: { params: Promise<{ locale: string; course: string }> }) {
  const { locale, course } = await params;
  if (!isLocale(locale)) notFound();
  const preview = await getCheckoutPreview(locale, course);
  const action = checkoutAction.bind(null, locale, course);

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
        <SectionTitle kicker="Checkout" title={preview.course.title} subtitle="Select your preferred batch and complete your admission request." align="left" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <CheckoutForm action={action} preview={preview} locale={locale} />
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Batch options</h2>
            <div className="mt-4 space-y-3">
              {preview.batches.map((batch) => (
                <div key={batch.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-bold text-slate-950">{batch.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{batch.start_date ?? "TBA"} · {batch.class_time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
