import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "পাসওয়ার্ড রিসেট" : "Reset Password" };
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : "";
  const email = typeof query.email === "string" ? query.email : "";
  return (
    <AuthPageShell title="Set a new password" description="Choose a strong password to secure your account.">
      <ResetPasswordForm locale={locale} token={token} email={email} />
    </AuthPageShell>
  );
}
