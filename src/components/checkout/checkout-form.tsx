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
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  preview: CheckoutPreview;
  locale: "en" | "bn";
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();
  const joinedBatches = preview.joined_batches ?? [];
  const joinedByBatch = new Map(joinedBatches.map((batch) => [batch.batch_id, batch]));
  const hasSelectableBatch = preview.batches.length === 0 || preview.batches.some((batch) => !joinedByBatch.has(batch.id));
  const courseKey = preview.course.slug ?? preview.course.id;

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
        <select id="batch_id" name="batch_id" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
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
      {preview.requires_batch_type ? (
        <div>
          <label htmlFor="batch_type" className="block text-sm font-bold text-slate-900">Batch type</label>
          <select id="batch_type" name="batch_type" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <option value="">Choose type</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      ) : null}
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending || !hasSelectableBatch} className="rounded-2xl bg-[color:var(--brand-orange)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-red)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Processing..." : "Place order"}
      </button>
    </form>
  );
}
