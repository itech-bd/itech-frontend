"use client";

import { useActionState } from "react";
import { registerAction, type ActionState } from "@/actions/auth";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

export function RegisterForm({ locale }: { locale: AppLocale }) {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {(["name", "email", "password", "password_confirmation"] as const).map((field) => (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-bold capitalize text-[color:var(--text-heading)]">{field.replace("_", " ")}</label>
          <input
            id={field}
            name={field}
            type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
            autoComplete={field === "email" ? "email" : field === "name" ? "name" : "new-password"}
            required
            className="focus-ring mt-2 min-h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-semibold"
          />
          {state.errors?.[field] ? <p className="mt-2 text-sm font-semibold text-[color:var(--error)]">{state.errors[field][0]}</p> : null}
        </div>
      ))}
      {state.message ? <p className={`rounded-lg px-3 py-2 text-sm font-bold ${state.ok ? "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary-dark)]" : "bg-red-50 text-[color:var(--error)]"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="focus-ring min-h-11 w-full rounded-lg bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
