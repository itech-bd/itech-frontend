import { apiFetch } from "./request";

export function fetchPublic<T>(path: string, locale: "en" | "bn", init: RequestInit = {}) {
  return apiFetch<T>(path, { ...init, locale, noStore: false });
}
