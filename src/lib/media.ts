const fallbackBrandLogo = "/brand/itechbd-logo.png";
const mediaDirectoryPrefixes = [
  "courses/",
  "favicon/",
  "frontend/",
  "home/",
  "logo/",
  "news/",
  "profile-images/",
  "uploads/",
];

function cleanBase(value: string) {
  return value.replace(/\/$/, "");
}

function assetBase() {
  return cleanBase(
    process.env.NEXT_PUBLIC_LARAVEL_ASSET_URL ??
      process.env.NEXT_PUBLIC_LARAVEL_API_URL ??
      process.env.LARAVEL_API_URL ??
      "",
  );
}

function storageMediaEnabled() {
  return process.env.NEXT_PUBLIC_LARAVEL_STORAGE_MEDIA !== "disabled";
}

function toMediaProxyPath(pathname: string) {
  const normalized = pathname.replace(/^\/+/, "");
  if (normalized.startsWith("storage/")) {
    return `/media/${normalized.slice("storage/".length)}`;
  }
  if (normalized.startsWith("media/")) {
    return `/${normalized}`;
  }
  return `/media/${normalized}`;
}

function isLaravelMediaPath(pathname: string) {
  const normalized = pathname.replace(/^\/+/, "");
  return normalized.startsWith("storage/") || normalized.startsWith("media/");
}

function isKnownRelativeMediaPath(value: string) {
  const normalized = value.replace(/^\/+/, "");
  return mediaDirectoryPrefixes.some((prefix) => normalized.startsWith(prefix));
}

function fromConfiguredAssetBase(pathname: string, suffix = "") {
  const base = assetBase();
  if (!storageMediaEnabled()) return null;
  if (!base) return `${toMediaProxyPath(pathname)}${suffix}`;
  return `${base}${toMediaProxyPath(pathname)}${suffix}`;
}

export function resolveMediaUrl(value: string | null | undefined) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (isLaravelMediaPath(trimmed)) {
    return fromConfiguredAssetBase(trimmed);
  }

  try {
    const url = new URL(trimmed);
    if (isLaravelMediaPath(url.pathname)) {
      return fromConfiguredAssetBase(url.pathname, `${url.search}${url.hash}`);
    }
  } catch {
    if (isKnownRelativeMediaPath(trimmed)) {
      return fromConfiguredAssetBase(trimmed);
    }

    return trimmed;
  }

  return trimmed;
}

export function resolveBrandLogoUrl(value: string | null | undefined) {
  return resolveMediaUrl(value) ?? fallbackBrandLogo;
}
