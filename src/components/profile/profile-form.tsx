"use client";

import { useActionState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { type ActionState } from "@/actions/auth";
import { updateProfileAction } from "@/actions/profile";
import type { AppLocale } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

const initialState: ActionState = { ok: false };

export function ProfileForm({
  locale,
  user,
}: {
  locale: AppLocale;
  user: { name: string; email: string; profile_image_url?: string | null };
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);
  const profileImage = resolveMediaUrl(user.profile_image_url);

  return (
    <form action={formAction} className="space-y-5 rounded-[1.5rem] border border-[color:var(--border-default)]/80 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">
          {profileImage ? <Image src={profileImage} alt={user.name} fill className="object-cover" sizes="80px" unoptimized /> : <UserRound aria-hidden className="h-8 w-8" />}
        </div>
        <div>
          <h2 className="text-xl font-black text-[color:var(--text-heading)]">Basic profile</h2>
          <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">Keep your name, email, and profile photo up to date.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-black text-[color:var(--text-heading)]">Name</label>
          <input id="name" name="name" defaultValue={user.name} className="focus-ring mt-2 w-full rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-black text-[color:var(--text-heading)]">Email</label>
          <input id="email" name="email" defaultValue={user.email} type="email" className="focus-ring mt-2 w-full rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]" />
        </div>
      </div>
      <div>
        <label htmlFor="profile_image" className="block text-sm font-black text-[color:var(--text-heading)]">Profile image</label>
        <input id="profile_image" name="profile_image" type="file" accept="image/*" className="focus-ring mt-2 w-full rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]" />
      </div>
      {state.message ? <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{state.message}</p> : null}
      <button type="submit" disabled={pending} className="focus-ring rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
