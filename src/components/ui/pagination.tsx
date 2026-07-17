import { LocaleLink } from "./link";
import type { AppLocale } from "@/lib/i18n/routing";
import type { Pagination } from "@/lib/api/types";

export function PaginationNav({
  locale,
  pagination,
  basePath,
  searchParams,
}: {
  locale: AppLocale;
  pagination: Pagination;
  basePath: string;
  searchParams: Record<string, string | number | undefined>;
}) {
  if (pagination.last_page <= 1) return null;

  const current = pagination.current_page;
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const query = params.toString();
    return `${basePath}${query ? `?${query}` : ""}`;
  };

  const pages = Array.from({ length: Math.min(pagination.last_page, 5) }, (_, index) => {
    let page = current - 2 + index;
    if (page < 1) page = index + 1;
    if (page > pagination.last_page) page = pagination.last_page - (4 - index);
    return page;
  }).filter((value, index, arr) => value >= 1 && value <= pagination.last_page && arr.indexOf(value) === index);

  return (
    <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Pagination">
      <LocaleLink
        locale={locale}
        href={buildHref(Math.max(1, current - 1))}
        className="focus-ring rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-2 text-sm font-bold text-[color:var(--text-body)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
      >
        Prev
      </LocaleLink>
      {pages.map((page) => (
        <LocaleLink
          key={page}
          locale={locale}
          href={buildHref(page)}
          className={
            page === current
              ? "focus-ring rounded-lg bg-[color:var(--brand-primary)] px-4 py-2 text-sm font-bold text-white"
              : "focus-ring rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-2 text-sm font-bold text-[color:var(--text-body)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
          }
        >
          {page}
        </LocaleLink>
      ))}
      <LocaleLink
        locale={locale}
        href={buildHref(Math.min(pagination.last_page, current + 1))}
        className="focus-ring rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-2 text-sm font-bold text-[color:var(--text-body)] transition hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
      >
        Next
      </LocaleLink>
    </nav>
  );
}
