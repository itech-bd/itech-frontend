import type { LocaleCode } from "@/lib/api/types";

const backendPanelRoles = new Set(["admin", "mentor"]);

function safeInternalPath(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim() ?? "";
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return fallback;
}

export function shouldUseBackendPanel(roles: string[]) {
  return roles.some((role) => backendPanelRoles.has(role.toLowerCase()));
}

export function resolveLoginRedirect({
  roles,
  loginHandoffUrl,
  backendDashboardUrl,
  next,
  locale,
}: {
  roles: string[];
  loginHandoffUrl?: string | null;
  backendDashboardUrl: string;
  next?: string | null;
  locale: LocaleCode;
}) {
  if (shouldUseBackendPanel(roles)) {
    return loginHandoffUrl || backendDashboardUrl;
  }

  return safeInternalPath(next, `/${locale}/student`);
}
