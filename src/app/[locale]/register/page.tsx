import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LogIn } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { LocaleLink } from "@/components/ui/link";
import { isLocale, type AppLocale } from "@/lib/i18n/routing";

type RegisterSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function queryValue(value: string | string[] | undefined) {
  const trimmed = firstValue(value)?.trim();
  return trimmed || undefined;
}

function registerDefaults(query: RegisterSearchParams) {
  return {
    name: queryValue(query.name),
    email: queryValue(query.email),
    mobile_number: queryValue(query.mobile_number) ?? queryValue(query.phone),
  };
}

function admissionNextPath(locale: AppLocale, query: RegisterSearchParams) {
  const course = queryValue(query.course);
  if (!course) return null;

  const params = new URLSearchParams();
  const batchId = queryValue(query.batch_id) ?? queryValue(query.batch);
  const batchType = queryValue(query.batch_type);

  if (batchId) params.set("batch_id", batchId);
  if (batchType === "online" || batchType === "offline") {
    params.set("batch_type", batchType);
  }

  const queryString = params.toString();
  return `/${locale}/checkout/courses/${encodeURIComponent(course)}${queryString ? `?${queryString}` : ""}`;
}

function ExistingStudentShortcut({ locale, nextPath }: { locale: AppLocale; nextPath: string }) {
  return (
    <div className="mb-6 border-b border-[color:var(--border-default)] pb-5">
      <div className="text-sm font-black text-[color:var(--text-heading)]">Already registered?</div>
      <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">
        Sign in once and this admission request will continue with the selected course and batch.
      </p>
      <LocaleLink
        locale={locale}
        href={`/login?next=${encodeURIComponent(nextPath)}`}
        className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-primary-dark)]"
      >
        <LogIn aria-hidden className="h-4 w-4" />
        Sign in and continue
      </LocaleLink>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: "Register | iTechBD Ltd" };
}

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RegisterSearchParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const nextPath = admissionNextPath(locale, query);

  return (
    <AuthPageShell title="Create your account" description="Register as a student to join courses and track your progress.">
      {nextPath ? <ExistingStudentShortcut locale={locale} nextPath={nextPath} /> : null}
      <RegisterForm locale={locale} defaults={registerDefaults(query)} />
    </AuthPageShell>
  );
}
