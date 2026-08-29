"use client";

import { useActionState } from "react";
import { registerAction, type ActionState } from "@/actions/auth";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

type RegisterDefaults = {
  name?: string;
  email?: string;
  mobile_number?: string;
};

const fields = [
  { name: "name", label: "name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "email", type: "email", autoComplete: "email", required: true },
  { name: "mobile_number", label: "mobile number", type: "tel", autoComplete: "tel", required: false },
  { name: "password", label: "password", type: "password", autoComplete: "new-password", required: true },
  { name: "password_confirmation", label: "password confirmation", type: "password", autoComplete: "new-password", required: true },
] as const;

export function RegisterForm({ locale, defaults = {} }: { locale: AppLocale; defaults?: RegisterDefaults }) {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-bold capitalize text-[color:var(--text-heading)]">{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            required={field.required}
            defaultValue={field.name in defaults ? defaults[field.name as keyof RegisterDefaults] : undefined}
            className="focus-ring mt-2 min-h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-semibold"
          />
          {state.errors?.[field.name] ? <p className="mt-2 text-sm font-semibold text-[color:var(--error)]">{state.errors[field.name][0]}</p> : null}
        </div>
      ))}
      {state.message ? <p className={`rounded-lg px-3 py-2 text-sm font-bold ${state.ok ? "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary-dark)]" : "bg-red-50 text-[color:var(--error)]"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="focus-ring min-h-11 w-full rounded-lg bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
