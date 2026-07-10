"use client";

import { useActionState } from "react";
import { type ActionState } from "@/actions/auth";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

export function ProfileSectionForm({
  locale,
  title,
  fields,
  action,
}: {
  locale: AppLocale;
  title: string;
  fields: Array<{ name: string; label: string; type?: string; defaultValue?: string | null }>;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  return (
    <form action={formAction} className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-bold text-slate-900">{field.label}</label>
          <input id={field.name} name={field.name} defaultValue={field.defaultValue ?? ""} type={field.type ?? "text"} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        </div>
      ))}
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white">
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
