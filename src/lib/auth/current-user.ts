import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { me } from "@/lib/api/site";
import { ApiError } from "@/lib/api/errors";
import { authCookieName } from "@/lib/auth/cookies";
import { isStudentPanelUser } from "@/lib/auth/login-redirect";
import type { LocaleCode } from "@/lib/api/types";

export const getOptionalCurrentUser = cache(async (locale: LocaleCode) => {
  if (!(await cookies()).get(authCookieName())?.value) {
    return null;
  }

  try {
    const user = await me(locale);
    return isStudentPanelUser(user) ? user : null;
  } catch (error) {
    if (error instanceof ApiError) {
      return null;
    }

    throw error;
  }
});
