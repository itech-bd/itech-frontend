"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction, type ActionState } from "@/actions/auth";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

export function LoginForm({ locale }: { locale: AppLocale }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.ok, state.redirectTo]);

  const next = searchParams.get("next") ?? `/${locale}/student`;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-slate-900">Email</label>
        <input id="email" name="email" type="email" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        {state.errors?.email ? <p className="mt-2 text-sm text-rose-600">{state.errors.email[0]}</p> : null}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-slate-900">Password</label>
        <input id="password" name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        {state.errors?.password ? <p className="mt-2 text-sm text-rose-600">{state.errors.password[0]}</p> : null}
      </div>
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-deep)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
