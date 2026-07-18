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
    <form action={formAction} className="space-y-4 rounded-[1.5rem] border border-[color:var(--border-default)]/80 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <h3 className="text-xl font-black text-[color:var(--text-heading)]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">Update this section whenever your information changes.</p>
      </div>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-black text-[color:var(--text-heading)]">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              defaultValue={field.defaultValue ?? ""}
              rows={4}
              className="focus-ring mt-2 w-full rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]"
            />
          ) : (
            <input id={field.name} name={field.name} defaultValue={field.defaultValue ?? ""} type={field.type ?? "text"} className="focus-ring mt-2 w-full rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]" />
          )}
        </div>
      ))}
      {state.message ? <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="focus-ring rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
