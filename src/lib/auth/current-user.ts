import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { me } from "@/lib/api/site";
import { ApiError } from "@/lib/api/errors";
import { authCookieName } from "@/lib/auth/cookies";
import type { LocaleCode } from "@/lib/api/types";

export const getOptionalCurrentUser = cache(async (locale: LocaleCode) => {
  if (!(await cookies()).get(authCookieName())?.value) {
    return null;
  }

  try {
    return await me(locale);
  } catch (error) {
    if (error instanceof ApiError) {
      return null;
    }

    throw error;
  }
});
