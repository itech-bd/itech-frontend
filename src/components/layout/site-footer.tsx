import { Mail, MapPin, Phone } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { AppLocale } from "@/lib/i18n/routing";
import type { PublicBootstrap } from "@/lib/api/types";

function setting(settings: PublicBootstrap["settings"], key: string) {
  const value = settings[key];
  return value && value !== "#" ? value : null;
}

export function SiteFooter({
  bootstrap,
  locale,
}: {
  bootstrap: PublicBootstrap;
  locale: AppLocale;
}) {
  const settings = bootstrap.settings;
  const logoUrl = setting(settings, "site_logo_url");
  const description =
    setting(settings, "footer_brand_description") ??
    "Career-focused technology and creative skills training with practical projects and mentor support.";
  const phone = setting(settings, "site_phone");
  const email = setting(settings, "site_email");
  const address = setting(settings, "site_address");
  const socialLinks = [
    ["Facebook", setting(settings, "footer_facebook_url")],
    ["LinkedIn", setting(settings, "footer_linkedin_url")],
    ["YouTube", setting(settings, "footer_youtube_url")],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <footer className="mt-16 border-t border-[color:var(--brand-secondary)]/20 bg-[linear-gradient(180deg,#fff8ef_0%,#fff2de_100%)] text-[color:var(--text-body)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.35fr_.95fr] lg:items-start">
          <div>
            <BrandLogo logoUrl={logoUrl} />
            <p className="mt-5 max-w-md text-sm leading-7">{description}</p>
            {socialLinks.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="focus-ring inline-flex min-h-10 items-center rounded-lg border border-[color:var(--border-default)] px-3 py-2 text-xs font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h2 className="text-xl font-black text-[color:var(--text-heading)]">Useful links</h2>
            <div className="mt-5 grid gap-x-8 gap-y-3 text-sm font-bold sm:grid-cols-2 lg:grid-cols-3">
              {bootstrap.footer_navigation.map((link) => (
                <LocaleLink
                  key={link.href + link.label}
                  locale={locale}
                  href={link.href}
                  className="focus-ring rounded-lg py-1 transition hover:text-[color:var(--brand-primary)]"
                >
                  {link.label}
                </LocaleLink>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-[color:var(--text-heading)]">{setting(settings, "footer_contact_title") ?? "Contact info"}</h2>
            <div className="mt-5 grid gap-3 text-sm">
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="focus-ring flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3 font-bold text-[color:var(--text-heading)]">
                  <Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-primary)]" />
                  {phone}
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className="focus-ring flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3 font-bold text-[color:var(--text-heading)]">
                  <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-secondary)]" />
                  {email}
                </a>
              ) : null}
              {address ? (
                <p className="flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-3 leading-6">
                  <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" />
                  {address}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[color:var(--border-default)] pt-6 text-sm text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} iTechBD Ltd. {setting(settings, "footer_copyright") ?? "All rights reserved."}</p>
          <div className="flex flex-wrap gap-4 font-bold">
            <LocaleLink href="/privacy" locale={locale} className="focus-ring transition hover:text-[color:var(--brand-primary)]">
              Privacy
            </LocaleLink>
            <LocaleLink href="/terms" locale={locale} className="focus-ring transition hover:text-[color:var(--brand-primary)]">
              Terms
            </LocaleLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
