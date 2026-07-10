import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "পাসওয়ার্ড ভুলে গেছি" : "Forgot Password" };
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <AuthPageShell title="Reset your password" description="Enter your email and we will send a reset link if the account exists.">
      <ForgotPasswordForm locale={locale} />
    </AuthPageShell>
  );
}
