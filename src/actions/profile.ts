"use server";

import { apiFetch } from "@/lib/api/request";
import { isApiError } from "@/lib/api/errors";
import type { ActionState } from "@/actions/auth";
import type { LocaleCode } from "@/lib/api/types";

function localeFromFormData(formData: FormData): LocaleCode {
  return String(formData.get("locale") ?? "en") === "bn" ? "bn" : "en";
}

export async function updateProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await apiFetch("/student/profile", {
      method: "POST",
      locale,
      auth: true,
      body: formData,
    });
    return { ok: true, message: "Profile updated." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Profile update failed." };
  }
}

export async function updateProfileDetailsAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await apiFetch("/student/profile/details", {
      method: "PATCH",
      locale,
      auth: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gender: formData.get("gender") || null,
        date_of_birth: formData.get("date_of_birth") || null,
        mobile_number: formData.get("mobile_number") || null,
        father_name: formData.get("father_name") || null,
        father_mobile: formData.get("father_mobile") || null,
        mother_name: formData.get("mother_name") || null,
        mother_mobile: formData.get("mother_mobile") || null,
        bio: formData.get("bio") || null,
      }),
    });
    return { ok: true, message: "Details updated." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Update failed." };
  }
}

export async function updatePublicUrlAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await apiFetch("/student/profile/public-url", {
      method: "PATCH",
      locale,
      auth: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_url: String(formData.get("public_url") ?? "") }),
    });
    return { ok: true, message: "Public URL updated." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Update failed." };
  }
}

export async function updateAddressAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await apiFetch("/student/profile/address", {
      method: "PUT",
      locale,
      auth: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        house_number: formData.get("house_number") || null,
        street: formData.get("street") || null,
        city: String(formData.get("city") ?? ""),
        post_office: formData.get("post_office") || null,
        zip_code: formData.get("zip_code") || null,
        country: String(formData.get("country") ?? ""),
      }),
    });
    return { ok: true, message: "Address updated." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Update failed." };
  }
}

export async function updatePasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  try {
    await apiFetch("/student/profile/password", {
      method: "PUT",
      locale,
      auth: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: String(formData.get("current_password") ?? ""),
        password: String(formData.get("password") ?? ""),
        password_confirmation: String(formData.get("password_confirmation") ?? ""),
      }),
    });
    return { ok: true, message: "Password updated. Please sign in again." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Update failed." };
  }
}
