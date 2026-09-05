"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type ActionState } from "@/actions/auth";
import { LocaleLink } from "@/components/ui/link";
import type { CheckoutPreview } from "@/lib/api/types";

const initialState: ActionState = { ok: false };

export function CheckoutForm({
  action,
  preview,
  locale,
  defaultBatchId = "",
  defaultBatchType = "",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  preview: CheckoutPreview;
  locale: "en" | "bn";
  defaultBatchId?: string;
  defaultBatchType?: "online" | "offline" | "";
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();
  const joinedBatches = preview.joined_batches ?? [];
  const joinedByBatch = new Map(joinedBatches.map((batch) => [batch.batch_id, batch]));
  const hasSelectableBatch = preview.batches.length === 0 || preview.batches.some((batch) => !joinedByBatch.has(batch.id));
  const courseKey = preview.course.slug ?? preview.course.id;
  const batchTypeOptions = availableBatchTypeOptions(preview);
  const singleBatchType = batchTypeOptions.length === 1 ? batchTypeOptions[0] : null;
  const selectedDefaultBatchType = batchTypeOptions.some((option) => option.value === defaultBatchType) ? defaultBatchType : "";

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.ok, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      {joinedBatches.length ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          <p>
            You already have {joinedBatches.some((batch) => batch.status === "approved") ? "an approved enrollment" : "a pending admission request"} for this course.
          </p>
          <LocaleLink locale={locale} href={`/student/courses/${courseKey}`} className="mt-2 inline-flex font-black text-amber-900 underline">
            View course status
          </LocaleLink>
        </div>
      ) : null}
      <div>
        <label htmlFor="batch_id" className="block text-sm font-bold text-slate-900">Select batch</label>
        <select id="batch_id" name="batch_id" defaultValue={defaultBatchId} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <option value="">Choose a batch</option>
          {preview.batches.map((batch) => {
            const joined = joinedByBatch.get(batch.id);

            return (
              <option key={batch.id} value={batch.id} disabled={Boolean(joined)}>
                {batch.name}{joined ? ` (${joined.status})` : ""}
              </option>
            );
          })}
        </select>
        {!hasSelectableBatch ? (
          <p className="mt-2 text-sm font-semibold text-amber-700">
            All available batches are already connected with your account.
          </p>
        ) : null}
      </div>
      {batchTypeOptions.length > 1 ? (
        <div>
          <label htmlFor="batch_type" className="block text-sm font-bold text-slate-900">Batch type</label>
          <select id="batch_type" name="batch_type" defaultValue={selectedDefaultBatchType} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <option value="">Choose type</option>
            {batchTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      ) : singleBatchType ? (
        <div>
          <input type="hidden" name="batch_type" value={singleBatchType.value} />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-sm font-bold text-slate-900">Admission type</div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-extrabold text-slate-950">{singleBatchType.label}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">Only available option</span>
            </div>
          </div>
        </div>
      ) : null}
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending || !hasSelectableBatch} className="rounded-2xl bg-[color:var(--brand-orange)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-red)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Processing..." : "Place order"}
      </button>
    </form>
  );
}

type BatchType = "online" | "offline";

function availableBatchTypeOptions(preview: CheckoutPreview) {
  const types = preview.available_batch_types?.length
    ? preview.available_batch_types
    : fallbackAvailableBatchTypes(preview);

  return Array.from(new Set(types)).map((type) => ({
    value: type,
    label: type === "online" ? "Online" : "Offline",
  }));
}

function fallbackAvailableBatchTypes(preview: CheckoutPreview): BatchType[] {
  const pricing = preview.course.pricing;
  if (!pricing) return [];

  const types: BatchType[] = [];
  if (hasPrice(pricing.online_old_price) || hasPrice(pricing.online_discount_price)) {
    types.push("online");
  }
  if (hasPrice(pricing.offline_old_price) || hasPrice(pricing.offline_discount_price)) {
    types.push("offline");
  }

  return types;
}

function hasPrice(value: number | null | undefined) {
  return value !== null && value !== undefined;
}
