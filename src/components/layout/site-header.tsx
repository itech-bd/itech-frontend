"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Clock3, Mail, MapPin, Menu, Phone, UserRound, X } from "lucide-react";
import { LocaleLink } from "@/components/ui/link";
import { LocaleSwitcher } from "./locale-switcher";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { AppLocale } from "@/lib/i18n/routing";
import type { NavItem, PublicBootstrap } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function setting(settings: PublicBootstrap["settings"], key: string) {
  const value = settings[key];
  return value && value !== "#" ? value : null;
}

function NavItemLink({
  item,
  locale,
  onNavigate,
  className,
}: {
  item: NavItem;
  locale: AppLocale;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <LocaleLink
      locale={locale}
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "focus-ring inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-bold transition",
        className,
      )}
    >
      {item.label}
    </LocaleLink>
  );
}

export function SiteHeader({
  bootstrap,
  locale,
}: {
  bootstrap: PublicBootstrap;
  locale: AppLocale;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = bootstrap.navigation;
  const settings = bootstrap.settings;
  const phone = setting(settings, "site_phone");
  const email = setting(settings, "site_email");
  const address = setting(settings, "site_address");
  const logoUrl = setting(settings, "site_logo_url");

  const contactItems = useMemo(
    () => [
      phone ? { icon: Phone, label: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` } : null,
      email ? { icon: Mail, label: email, href: `mailto:${email}` } : null,
      { icon: Clock3, label: "Sat-Thu, 10:00 AM - 8:00 PM", href: null },
    ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; href: string | null }>,
    [phone, email],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-xl transition duration-300",
        scrolled ? "border-[color:var(--border-default)] shadow-[0_12px_30px_rgba(15,23,42,0.08)]" : "border-transparent",
      )}
    >
      <div className="hidden bg-[color:var(--text-heading)] text-white lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-8 py-2 text-xs font-semibold">
          <div className="flex min-w-0 items-center gap-5">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                  <span className="truncate">{item.label}</span>
                </>
              );
              return item.href ? (
                <a key={item.label} href={item.href} className="focus-ring inline-flex min-w-0 items-center gap-2 text-white/82 transition hover:text-white">
                  {content}
                </a>
              ) : (
                <span key={item.label} className="inline-flex min-w-0 items-center gap-2 text-white/72">
                  {content}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            {address ? (
              <span className="inline-flex max-w-xs items-center gap-2 truncate text-white/72">
                <MapPin aria-hidden className="h-3.5 w-3.5" />
                {address}
              </span>
            ) : null}
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      </div>

      <div className={cn("mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 lg:px-8", scrolled ? "h-16" : "h-20")}>
        <LocaleLink href="/" locale={locale} className="focus-ring flex min-w-0 items-center">
          <BrandLogo logoUrl={logoUrl} compact={scrolled} />
        </LocaleLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {nav.map((item) =>
            item.children?.length ? (
              <div key={item.key} className="group relative">
                <NavItemLink
                  item={item}
                  locale={locale}
                  className="text-[color:var(--text-body)] hover:bg-[color:var(--brand-primary-light)] hover:text-[color:var(--brand-primary)]"
                />
                <ChevronDown aria-hidden className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <div className="invisible absolute left-0 top-full z-20 w-72 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-lg border border-[color:var(--border-default)] bg-white p-2 shadow-[var(--shadow-soft)]">
                    {item.children.map((child) => (
                      <LocaleLink
                        key={child.key}
                        locale={locale}
                        href={child.href}
                        className="focus-ring block rounded-lg px-4 py-3 text-sm font-bold text-[color:var(--text-body)] transition hover:bg-[color:var(--brand-primary-light)] hover:text-[color:var(--brand-primary)]"
                      >
                        {child.label}
                      </LocaleLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavItemLink
                key={item.key}
                item={item}
                locale={locale}
                className="text-[color:var(--text-body)] hover:bg-[color:var(--brand-primary-light)] hover:text-[color:var(--brand-primary)]"
              />
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleLink
            href="/login"
            locale={locale}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg border border-[color:var(--border-default)] px-4 py-2 text-sm font-extrabold text-[color:var(--text-heading)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            <UserRound aria-hidden className="h-4 w-4" />
            Login
          </LocaleLink>
          {bootstrap.auth.registration_enabled ? (
            <LocaleLink
              href="/register"
              locale={locale}
              className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-4 py-2 text-sm font-extrabold text-white shadow-[var(--shadow-card)] transition hover:bg-[color:var(--brand-primary-dark)]"
            >
              Apply Now
              <ArrowRight aria-hidden className="h-4 w-4" />
            </LocaleLink>
          ) : null}
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-lg border border-[color:var(--border-default)] text-[color:var(--text-heading)] lg:hidden"
        >
          <Menu aria-hidden className="h-5 w-5" />
        </button>
      </div>

      <div id="mobile-navigation" className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-[color:var(--text-heading)]/45 transition-opacity", open ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-dvh w-[min(24rem,88vw)] flex-col bg-white shadow-[var(--shadow-soft)] transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border-default)] p-4">
            <BrandLogo logoUrl={logoUrl} compact />
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-[color:var(--border-default)] text-[color:var(--text-heading)]"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-2">
              {nav.map((item) => (
                <div key={item.key}>
                  <NavItemLink
                    item={item}
                    locale={locale}
                    onNavigate={() => setOpen(false)}
                    className="w-full justify-between bg-[color:var(--surface-secondary)] text-[color:var(--text-heading)]"
                  />
                  {item.children?.length ? (
                    <div className="mt-2 grid gap-2 pl-3">
                      {item.children.map((child) => (
                        <LocaleLink
                          key={child.key}
                          locale={locale}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="focus-ring rounded-lg px-4 py-3 text-sm font-bold text-[color:var(--text-body)] hover:bg-[color:var(--brand-primary-light)]"
                        >
                          {child.label}
                        </LocaleLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 rounded-lg bg-[color:var(--surface-secondary)] p-4 text-sm">
              {phone ? <a className="focus-ring flex items-center gap-2 font-bold text-[color:var(--text-heading)]" href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone aria-hidden className="h-4 w-4 text-[color:var(--brand-primary)]" />{phone}</a> : null}
              {email ? <a className="focus-ring flex items-center gap-2 font-bold text-[color:var(--text-heading)]" href={`mailto:${email}`}><Mail aria-hidden className="h-4 w-4 text-[color:var(--brand-secondary)]" />{email}</a> : null}
              <LocaleSwitcher locale={locale} />
            </div>
          </div>

          <div className="grid gap-3 border-t border-[color:var(--border-default)] p-4">
            <LocaleLink
              href="/courses"
              locale={locale}
              onClick={() => setOpen(false)}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white"
            >
              Browse Courses
            </LocaleLink>
            <LocaleLink
              href="/login"
              locale={locale}
              onClick={() => setOpen(false)}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--border-default)] px-5 py-3 text-sm font-extrabold text-[color:var(--text-heading)]"
            >
              Login
            </LocaleLink>
          </div>
        </aside>
      </div>
    </header>
  );
}
