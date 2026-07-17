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
        <label htmlFor="email" className="block text-sm font-bold text-[color:var(--text-heading)]">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="focus-ring mt-2 min-h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-semibold" />
        {state.errors?.email ? <p className="mt-2 text-sm font-semibold text-[color:var(--error)]">{state.errors.email[0]}</p> : null}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-[color:var(--text-heading)]">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="focus-ring mt-2 min-h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-semibold" />
        {state.errors?.password ? <p className="mt-2 text-sm font-semibold text-[color:var(--error)]">{state.errors.password[0]}</p> : null}
      </div>
      {state.message ? <p className={`rounded-lg px-3 py-2 text-sm font-bold ${state.ok ? "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary-dark)]" : "bg-red-50 text-[color:var(--error)]"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="focus-ring min-h-11 w-full rounded-lg bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
