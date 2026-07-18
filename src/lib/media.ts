const assetBase =
  process.env.NEXT_PUBLIC_LARAVEL_ASSET_URL ??
  process.env.NEXT_PUBLIC_LARAVEL_API_URL ??
  process.env.LARAVEL_API_URL ??
  "";
const storageMediaEnabled = process.env.NEXT_PUBLIC_LARAVEL_STORAGE_MEDIA !== "disabled";
const fallbackBrandLogo = "/brand/itechbd-logo.png";

function cleanBase(value: string) {
  return value.replace(/\/$/, "");
}

function toMediaProxyPath(pathname: string) {
  const normalized = pathname.replace(/^\/+/, "");
  if (normalized.startsWith("storage/")) {
    return `/media/${normalized.slice("storage/".length)}`;
  }
  return pathname;
}

export function resolveMediaUrl(value: string | null | undefined) {
  if (!value) return null;

  if ((value.startsWith("/storage/") || value.startsWith("/media/")) && assetBase) {
    if (!storageMediaEnabled) return null;
    return `${cleanBase(assetBase)}${toMediaProxyPath(value)}`;
  }

  try {
    const url = new URL(value);
    if (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      (url.pathname.startsWith("/storage/") || url.pathname.startsWith("/media/")) &&
      assetBase
    ) {
      if (!storageMediaEnabled) return null;
      return `${cleanBase(assetBase)}${toMediaProxyPath(url.pathname)}${url.search}`;
    }
  } catch {
    return value;
  }

  return value;
}

export function resolveBrandLogoUrl(value: string | null | undefined) {
  return resolveMediaUrl(value) ?? fallbackBrandLogo;
}
