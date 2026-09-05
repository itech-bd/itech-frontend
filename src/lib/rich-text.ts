const entityMap: Record<string, string> = {
  amp: "&",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  apos: "'",
};

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (match, entity: string) => {
    const normalized = entity.toLowerCase();

    if (normalized.startsWith("#x")) {
      const codePoint = Number.parseInt(normalized.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalized.startsWith("#")) {
      const codePoint = Number.parseInt(normalized.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return entityMap[normalized] ?? match;
  });
}

export function richTextToPlainText(value: string | null | undefined) {
  if (!value) return "";

  return decodeHtmlEntities(value)
    .replace(/\\([<>])/g, "$1")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\binternal-guid-[a-z0-9-]+\b/gi, " ")
    .replace(/\b(?:id|dir|class|style)=["'][^"']*["']/gi, " ")
    .replace(/[<>]/g, " ")
    .replace(/["']\s*>/g, " ")
    .replace(/\s+>/g, " ")
    .replace(/>\s+/g, " ")
    .replace(/\\/g, "")
    .replace(/&(?:#\d+|#x[\da-f]+|[a-z]+);/gi, (match) => decodeHtmlEntities(match))
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const clipped = value.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
  return clipped ? `${clipped}...` : value.slice(0, maxLength).trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function courseSummaryText(value: string | null | undefined, fallback: string, maxLength = 280) {
  const text = richTextToPlainText(value)
    .replace(/\bTotal Classes:\s*\d+[\s\S]*$/i, "")
    .trim();

  return truncateText(text || fallback, maxLength);
}

export function coursePlainSummary(
  value: string | null | undefined,
  title: string,
  fallback: string,
  maxLength = 280,
) {
  const titlePattern = new RegExp(`^${escapeRegExp(title)}\\s*`, "i");
  const summary = courseSummaryText(value, fallback, maxLength + title.length + 8)
    .replace(titlePattern, "")
    .trim();

  return truncateText(summary || fallback, maxLength);
}

export function extractTotalClasses(value: string | null | undefined) {
  const match = richTextToPlainText(value).match(/\bTotal Classes:\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}
