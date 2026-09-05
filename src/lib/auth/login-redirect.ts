import type { LocaleCode } from "@/lib/api/types";

const backendPanelRoles = new Set(["admin", "mentor"]);
const studentPanelRoles = new Set(["student"]);

type AccountIdentity = {
  type?: string | null;
  roles?: string[] | null;
};

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

export function isStudentPanelUser(user: AccountIdentity | null | undefined) {
  const roles = user?.roles ?? [];
  const accountType = user?.type?.toLowerCase() ?? "";

  if (accountType === "admin" || accountType === "mentor" || shouldUseBackendPanel(roles)) {
    return false;
  }

  return accountType === "student" || roles.some((role) => studentPanelRoles.has(role.toLowerCase()));
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
  if (loginHandoffUrl || shouldUseBackendPanel(roles)) {
    return loginHandoffUrl || backendDashboardUrl;
  }

  return safeInternalPath(next, `/${locale}/student`);
}
