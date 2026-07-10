import { apiFetch } from "./request";

export function fetchPrivate<T>(path: string, locale: "en" | "bn", init: RequestInit = {}) {
  return apiFetch<T>(path, { ...init, locale, auth: true });
}
