"use server";

import { redirect } from "next/navigation";
import { storeCheckoutOrder } from "@/lib/api/site";
import { isApiError } from "@/lib/api/errors";
import type { ActionState } from "@/actions/auth";
import type { LocaleCode } from "@/lib/api/types";

function localeFromFormData(formData: FormData): LocaleCode {
  return formData.get("locale") === "bn" ? "bn" : "en";
}

function selectedBatchId(formData: FormData) {
  const value = formData.get("batch_id");
  return value ? Number(value) : null;
}

function selectedBatchType(formData: FormData) {
  const value = formData.get("batch_type");
  return value === "online" || value === "offline" ? value : null;
}

function checkoutPath(locale: LocaleCode, course: string, formData: FormData) {
  const params = new URLSearchParams();
  const batchId = selectedBatchId(formData);
  const batchType = selectedBatchType(formData);

  if (batchId) params.set("batch_id", String(batchId));
  if (batchType) params.set("batch_type", batchType);

  const queryString = params.toString();
  return `/${locale}/checkout/courses/${encodeURIComponent(course)}${queryString ? `?${queryString}` : ""}`;
}

export async function applyNowAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeFromFormData(formData);
  const course = String(formData.get("course") ?? "").trim();

  if (!course) {
    return {
      ok: false,
      message: "Please select a course.",
      errors: { course: ["Please select a course."] },
    };
  }

  let redirectTo: string;

  try {
    const result = await storeCheckoutOrder(locale, course, {
      batch_id: selectedBatchId(formData),
      batch_type: selectedBatchType(formData),
    });

    redirectTo = `/${locale}/checkout/orders/${result.id}`;
  } catch (error) {
    if (isApiError(error)) {
      if (error.code === "UNAUTHENTICATED") {
        redirectTo = `/${locale}/login?next=${encodeURIComponent(checkoutPath(locale, course, formData))}`;
      } else {
        return { ok: false, message: error.message, errors: error.errors };
      }
    } else {
      return { ok: false, message: "Admission request failed." };
    }
  }

  redirect(redirectTo);
}
