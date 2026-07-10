export function formatCurrency(
  amount: number | string | null | undefined,
  locale: string,
  currency = "BDT",
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (value === null || value === undefined || Number.isNaN(value)) {
    return currency === "BDT" ? "৳0" : "0";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(
  value: string | Date | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions = {},
) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(date);
}

export function formatNumber(value: number | string | null | undefined, locale: string) {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (numeric === null || numeric === undefined || Number.isNaN(numeric)) return "0";
  return new Intl.NumberFormat(locale).format(numeric);
}
