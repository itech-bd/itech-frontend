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
          <label htmlFor={field} className="block text-sm font-bold text-slate-900">{field.replace("_", " ")}</label>
          <input id={field} name={field} type={field.includes("password") ? "password" : field === "email" ? "email" : "text"} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          {state.errors?.[field] ? <p className="mt-2 text-sm text-rose-600">{state.errors[field][0]}</p> : null}
        </div>
      ))}
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded-2xl bg-[color:var(--brand-orange)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-red)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
