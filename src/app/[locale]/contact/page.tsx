import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPage } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { SectionTitle } from "@/components/ui/section-title";
import { ContactForm } from "@/components/public/contact-form";
import { sanitizeCmsHtml } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "যোগাযোগ" : "Contact" };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicPage(locale, "contact");
  const hero = data.page.sections[0];
  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <SectionTitle kicker="Contact" title={hero?.title ?? (locale === "bn" ? "যোগাযোগ" : "Contact")} subtitle={hero?.content ? undefined : "Reach the team by form, phone, or email."} align="left" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.95fr]">
          <div className="site-prose rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(hero?.content ?? "<p>Reach the team by form, phone, or email.</p>") }} />
          <ContactForm locale={locale} />
        </div>
      </div>
    </main>
  );
}
