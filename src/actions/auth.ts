"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { login, logout, register, forgotPassword, resetPassword, resendVerification } from "@/lib/api/site";
import { authCookieName, authCookieOptions } from "@/lib/auth/cookies";
import { isApiError } from "@/lib/api/errors";
import type { LocaleCode } from "@/lib/api/types";

export type ActionState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  errors?: Record<string, string[]>;
  mustVerify?: boolean;
};

function localeFromFormData(formData: FormData): LocaleCode {
  const locale = String(formData.get("locale") ?? "en");
  return locale === "bn" ? "bn" : "en";
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    const result = await login(locale, {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      issue_token: true,
      device_name: "nextjs-web",
    });

    if (!result.access_token) {
      return { ok: false, message: "Login failed." };
    }

    (await cookies()).set(authCookieName(), result.access_token, authCookieOptions());
    return {
      ok: true,
      message: "Login successful.",
      redirectTo: String(formData.get("next") ?? `/${locale}/student`),
    };
  } catch (error) {
    if (isApiError(error)) {
      return { ok: false, message: error.message, errors: error.errors };
    }
    return { ok: false, message: "Login failed." };
  }
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    const result = await register(locale, {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      password_confirmation: String(formData.get("password_confirmation") ?? ""),
    });

    return {
      ok: true,
      message: "Registration successful. Please verify your email.",
      mustVerify: result.verification_required,
    };
  } catch (error) {
    if (isApiError(error)) {
      return { ok: false, message: error.message, errors: error.errors };
    }
    return { ok: false, message: "Registration failed." };
  }
}

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    const email = String(formData.get("email") ?? "");
    await forgotPassword(locale, email);
    return { ok: true, message: "Password reset email sent." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Request failed." };
  }
}

export async function resetPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await resetPassword(locale, {
      token: String(formData.get("token") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      password_confirmation: String(formData.get("password_confirmation") ?? ""),
    });
    return { ok: true, message: "Password has been reset." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Reset failed." };
  }
}

export async function resendVerificationAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await resendVerification(locale, String(formData.get("email") ?? ""));
    return { ok: true, message: "Verification email sent." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Request failed." };
  }
}

export async function logoutAction(locale: LocaleCode) {
  try {
    await logout(locale);
  } catch {
    // Logout should still clear the local cookie even if the API token is gone.
  }

  (await cookies()).delete(authCookieName());
  redirect(`/${locale}/login`);
}
