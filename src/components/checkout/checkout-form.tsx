"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type ActionState } from "@/actions/auth";

const initialState: ActionState = { ok: false };

export function CheckoutForm({
  action,
  preview,
  locale,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  preview: {
    batches: Array<{ id: number; name: string; start_date: string | null; end_date: string | null; class_time: string | null; class_days: string[] }>;
    requires_batch_type: boolean;
  };
  locale: "en" | "bn";
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.ok, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="batch_id" className="block text-sm font-bold text-slate-900">Select batch</label>
        <select id="batch_id" name="batch_id" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <option value="">Choose a batch</option>
          {preview.batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
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
      <button type="submit" disabled={pending} className="rounded-2xl bg-[color:var(--brand-orange)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-red)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Processing..." : "Place order"}
      </button>
    </form>
  );
}
