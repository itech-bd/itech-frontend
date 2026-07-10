"use server";

import { storeCheckoutOrder } from "@/lib/api/site";
import { isApiError } from "@/lib/api/errors";
import type { ActionState } from "@/actions/auth";
import type { LocaleCode } from "@/lib/api/types";

export async function checkoutAction(
  locale: LocaleCode,
  course: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const result = await storeCheckoutOrder(locale, course, {
      batch_id: formData.get("batch_id") ? Number(formData.get("batch_id")) : null,
      batch_type: formData.get("batch_type") === "online" || formData.get("batch_type") === "offline" ? (formData.get("batch_type") as "online" | "offline") : null,
    });

    return {
      ok: true,
      message: "Checkout saved.",
      redirectTo: `/checkout/orders/${result.id}`,
    };
  } catch (error) {
    if (isApiError(error)) return { ok: false, message: error.message, errors: error.errors };
    return { ok: false, message: "Checkout failed." };
  }
}
