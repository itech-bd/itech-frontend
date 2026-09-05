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
  compact = false,
}: {
  bootstrap: PublicBootstrap;
  locale: AppLocale;
  compact?: boolean;
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
    <footer className={`${compact ? "mt-0" : "mt-16"} border-t border-[color:var(--brand-secondary)]/20 bg-[linear-gradient(180deg,#fff8ef_0%,#fff2de_100%)] text-[color:var(--text-body)]`}>
      <div className={`mx-auto w-full max-w-7xl px-4 ${compact ? "pb-24 pt-4 lg:px-5 lg:py-4" : "py-12 lg:px-8 lg:py-16"}`}>
        <div className={`grid ${compact ? "gap-4 lg:grid-cols-[1fr_1.2fr_.95fr]" : "gap-10 lg:grid-cols-[1.05fr_1.35fr_.95fr]"} lg:items-start`}>
          <div>
            <BrandLogo logoUrl={logoUrl} compact={compact} />
            <p className={`${compact ? "mt-3 text-xs leading-6" : "mt-5 text-sm leading-7"} max-w-md`}>{description}</p>
            {socialLinks.length ? (
              <div className={`${compact ? "mt-3" : "mt-5"} flex flex-wrap gap-2`}>
                {socialLinks.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className={`${compact ? "min-h-8 px-2.5 py-1.5 text-[11px]" : "min-h-10 px-3 py-2 text-xs"} focus-ring inline-flex items-center rounded-lg border border-[color:var(--border-default)] font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]`}
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
            <h2 className={`${compact ? "text-base" : "text-xl"} font-black text-[color:var(--text-heading)]`}>Useful links</h2>
            <div className={`${compact ? "mt-3 gap-x-5 gap-y-2 text-xs" : "mt-5 gap-x-8 gap-y-3 text-sm"} grid font-bold sm:grid-cols-2 lg:grid-cols-3`}>
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
            <h2 className={`${compact ? "text-base" : "text-xl"} font-black text-[color:var(--text-heading)]`}>{setting(settings, "footer_contact_title") ?? "Contact info"}</h2>
            <div className={`${compact ? "mt-3 gap-2 text-xs" : "mt-5 gap-3 text-sm"} grid`}>
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={`${compact ? "p-2" : "p-3"} focus-ring flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] font-bold text-[color:var(--text-heading)]`}>
                  <Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-primary)]" />
                  {phone}
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className={`${compact ? "p-2" : "p-3"} focus-ring flex gap-3 rounded-lg bg-[color:var(--surface-secondary)] font-bold text-[color:var(--text-heading)]`}>
                  <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-secondary)]" />
                  {email}
                </a>
              ) : null}
              {address ? (
                <p className={`${compact ? "p-2 leading-5" : "p-3 leading-6"} flex gap-3 rounded-lg bg-[color:var(--surface-secondary)]`}>
                  <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-accent)]" />
                  {address}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className={`${compact ? "mt-4 gap-2 pt-3 text-xs" : "mt-10 gap-4 pt-6 text-sm"} flex flex-col border-t border-[color:var(--border-default)] text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between`}>
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
