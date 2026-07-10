import { LocaleLink } from "@/components/ui/link";
import { LocaleSwitcher } from "./locale-switcher";
import type { AppLocale } from "@/lib/i18n/routing";
import type { NavItem, PublicBootstrap } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function NavItemLink({
  item,
  locale,
  className,
}: {
  item: NavItem;
  locale: AppLocale;
  className?: string;
}) {
  return (
    <LocaleLink
      locale={locale}
      href={item.href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-bold transition",
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
  const nav = bootstrap.navigation;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="hidden border-b border-slate-100 bg-[color:var(--brand-primary)] text-white lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 text-xs font-medium lg:px-8">
          <div className="flex min-w-0 items-center gap-5">
            <span className="truncate">
              <span className="font-bold">iTechBD Ltd</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <LocaleLink href="/" locale={locale} className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--brand-primary)] text-white shadow-brand">
            i
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-slate-950">iTechBD Ltd</div>
            <div className="truncate text-xs font-semibold text-slate-500">Learning Platform</div>
          </div>
        </LocaleLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div key={item.key} className="group relative">
                <NavItemLink
                  item={item}
                  locale={locale}
                  className="text-slate-700 hover:bg-[color:var(--brand-primary)]/5 hover:text-[color:var(--brand-primary)]"
                />
                <div className="invisible absolute left-0 top-full z-20 w-72 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="translate-y-2 rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-[color:var(--brand-primary)]/10 transition duration-200 group-hover:translate-y-0">
                    {item.children.map((child) => (
                      <LocaleLink
                        key={child.key}
                        locale={locale}
                        href={child.href}
                        className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-[color:var(--brand-primary)]/5 hover:text-[color:var(--brand-primary)]"
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
                className="text-slate-700 hover:bg-[color:var(--brand-primary)]/5 hover:text-[color:var(--brand-primary)]"
              />
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleLink
            href="/login"
            locale={locale}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-extrabold text-slate-700 transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          >
            {bootstrap.auth.registration_enabled ? "Login" : "Account"}
          </LocaleLink>
          {bootstrap.auth.registration_enabled ? (
            <LocaleLink
              href="/register"
              locale={locale}
              className="rounded-full bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[color:var(--brand-orange)]/20 transition hover:bg-[color:var(--brand-red)]"
            >
              Register
            </LocaleLink>
          ) : null}
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
