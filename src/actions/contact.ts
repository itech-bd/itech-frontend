"use server";

import { submitContact } from "@/lib/api/site";
import { isApiError } from "@/lib/api/errors";
import type { ActionState } from "@/actions/auth";
import type { LocaleCode } from "@/lib/api/types";

export async function contactAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = (String(formData.get("locale") ?? "en") === "bn" ? "bn" : "en") as LocaleCode;

  try {
    await submitContact(locale, {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    });
    return { ok: true, message: "Message sent successfully." };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Message failed." };
  }
}
