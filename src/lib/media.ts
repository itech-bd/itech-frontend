const assetBase =
  process.env.NEXT_PUBLIC_LARAVEL_ASSET_URL ??
  process.env.NEXT_PUBLIC_LARAVEL_API_URL ??
  process.env.LARAVEL_API_URL ??
  "";
const storageMediaEnabled = process.env.NEXT_PUBLIC_LARAVEL_STORAGE_MEDIA !== "disabled";

function cleanBase(value: string) {
  return value.replace(/\/$/, "");
}

export function resolveMediaUrl(value: string | null | undefined) {
  if (!value) return null;

  if (value.startsWith("/storage/") && assetBase) {
    if (!storageMediaEnabled) return null;
    return `${cleanBase(assetBase)}${value}`;
  }

  try {
    const url = new URL(value);
    if ((url.hostname === "localhost" || url.hostname === "127.0.0.1") && url.pathname.startsWith("/storage/") && assetBase) {
      if (!storageMediaEnabled) return null;
      return `${cleanBase(assetBase)}${url.pathname}${url.search}`;
    }
  } catch {
    return value;
  }

  return value;
}

export function resolveBrandLogoUrl(value: string | null | undefined) {
  return resolveMediaUrl(value) ?? (assetBase ? `${cleanBase(assetBase)}/brand/itechbd-logo.png` : null);
}
