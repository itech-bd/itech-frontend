"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/actions/auth";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

export function ResetPasswordForm({ locale, token, email }: { locale: AppLocale; token: string; email: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-slate-900">New password</label>
        <input id="password" name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
      </div>
      <div>
        <label htmlFor="password_confirmation" className="block text-sm font-bold text-slate-900">Confirm password</label>
        <input id="password_confirmation" name="password_confirmation" type="password" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
      </div>
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-deep)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Updating..." : "Reset password"}
      </button>
    </form>
  );
}
