import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: locale === "bn" ? "ইমেইল যাচাই" : "Verify Email" };
}

export default async function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <AuthPageShell title="Verify your email" description="If your verification link expired, request a new one here.">
      <ResendVerificationForm locale={locale} />
    </AuthPageShell>
  );
}
