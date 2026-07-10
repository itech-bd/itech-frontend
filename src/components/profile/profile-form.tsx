"use client";

import { useActionState } from "react";
import { type ActionState } from "@/actions/auth";
import { updateProfileAction } from "@/actions/profile";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

export function ProfileForm({
  locale,
  user,
}: {
  locale: AppLocale;
  user: { name: string; email: string };
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);
  return (
    <form action={formAction} className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-900">Name</label>
          <input id="name" name="name" defaultValue={user.name} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-900">Email</label>
          <input id="email" name="email" defaultValue={user.email} type="email" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="profile_image" className="block text-sm font-bold text-slate-900">Profile image</label>
        <input id="profile_image" name="profile_image" type="file" accept="image/*" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
      </div>
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white">
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
