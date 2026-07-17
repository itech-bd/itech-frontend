import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPublicBootstrap, getPublicPage } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { SectionTitle } from "@/components/ui/section-title";
import { ContactForm } from "@/components/public/contact-form";
import { sanitizeCmsHtml } from "@/lib/sanitize";
import type { PublicBootstrap } from "@/lib/api/types";

function setting(settings: PublicBootstrap["settings"], key: string) {
  const value = settings[key];
  return value && value !== "#" ? value : null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: "Contact | iTechBD Ltd" };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [data, bootstrap] = await Promise.all([getPublicPage(locale, "contact"), getPublicBootstrap(locale)]);
  const hero = data.page.sections[0];
  const phone = setting(bootstrap.settings, "site_phone");
  const email = setting(bootstrap.settings, "site_email");
  const address = setting(bootstrap.settings, "site_address");
  const cards = [
    phone ? { label: "Phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}`, icon: Phone } : null,
    email ? { label: "Email", value: email, href: `mailto:${email}`, icon: Mail } : null,
    address ? { label: "Address", value: address, href: null, icon: MapPin } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string | null; icon: typeof Phone }>;

  return (
    <main>
      <PageHero
        locale={locale}
        kicker="Contact"
        title={hero?.title ?? "Contact the team"}
        subtitle={<div className="site-prose" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(hero?.content ?? "<p>Reach the team by form, phone, or email.</p>") }} />}
        primaryHref="/courses"
        primaryLabel="Browse courses"
        secondaryHref="/reviews"
        secondaryLabel="Student reviews"
      >
        <div className="surface-card p-5">
          <div className="grid gap-3">
            {cards.map((card) => {
              const Icon = card.icon;
              const content = (
                <>
                  <Icon aria-hidden className="h-5 w-5 shrink-0 text-[color:var(--brand-primary)]" />
                  <span>
                    <span className="block text-xs font-bold text-[color:var(--text-muted)]">{card.label}</span>
                    <span className="block font-black text-[color:var(--text-heading)]">{card.value}</span>
                  </span>
                </>
              );
              return card.href ? (
                <a key={card.label} href={card.href} className="focus-ring flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-4">
                  {content}
                </a>
              ) : (
                <div key={card.label} className="flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-4">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </PageHero>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <SectionTitle kicker="Get in Touch" title="Speak with our admission team" subtitle="Send your question and the team will respond through the existing Laravel contact endpoint." align="left" />
            <div className="mt-6 grid gap-3">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="surface-card flex gap-3 p-4">
                    <Icon aria-hidden className="mt-1 h-5 w-5 shrink-0 text-[color:var(--brand-secondary)]" />
                    <div>
                      <div className="text-sm font-bold text-[color:var(--text-muted)]">{card.label}</div>
                      {card.href ? (
                        <a href={card.href} className="focus-ring font-black text-[color:var(--text-heading)] hover:text-[color:var(--brand-primary)]">{card.value}</a>
                      ) : (
                        <p className="font-black leading-7 text-[color:var(--text-heading)]">{card.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <ContactForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
