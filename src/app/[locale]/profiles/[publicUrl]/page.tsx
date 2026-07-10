import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublicProfile } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; publicUrl: string }> }): Promise<Metadata> {
  const { locale, publicUrl } = await params;
  if (!isLocale(locale)) notFound();
  return { title: publicUrl };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ locale: string; publicUrl: string }> }) {
  const { locale, publicUrl } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getPublicProfile(locale, publicUrl);

  return (
    <main className="py-14">
      <div className="mx-auto w-full max-w-5xl px-4 lg:px-8">
        <SectionTitle kicker="Public Profile" title={data.user.name} subtitle={data.details ? "Profile is configured and visible publicly." : "Public profile is available."} align="left" />
      </div>
    </main>
  );
}
