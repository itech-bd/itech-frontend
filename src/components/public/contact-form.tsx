"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { contactAction } from "@/actions/contact";
import { type ActionState } from "@/actions/auth";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off" },
] as const;

export function ContactForm({ locale }: { locale: AppLocale }) {
  const [state, formAction, pending] = useActionState(contactAction, initialState);

  return (
    <form action={formAction} className="surface-card space-y-4 p-5">
      <input type="hidden" name="locale" value={locale} />
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-bold text-[color:var(--text-heading)]">{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            aria-invalid={state.errors?.[field.name] ? "true" : "false"}
            aria-describedby={state.errors?.[field.name] ? `${field.name}-error` : undefined}
            className="focus-ring mt-2 min-h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]"
          />
          {state.errors?.[field.name] ? <p id={`${field.name}-error`} className="mt-2 text-sm font-semibold text-[color:var(--error)]">{state.errors[field.name][0]}</p> : null}
        </div>
      ))}
      <div>
        <label htmlFor="message" className="block text-sm font-bold text-[color:var(--text-heading)]">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={state.errors?.message ? "true" : "false"}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          className="focus-ring mt-2 w-full rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-3 text-sm font-semibold text-[color:var(--text-heading)]"
        />
        {state.errors?.message ? <p id="message-error" className="mt-2 text-sm font-semibold text-[color:var(--error)]">{state.errors.message[0]}</p> : null}
      </div>
      {state.message ? (
        <p className={`rounded-lg px-3 py-2 text-sm font-bold ${state.ok ? "bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary-dark)]" : "bg-red-50 text-[color:var(--error)]"}`}>
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send aria-hidden className="h-4 w-4" />
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
