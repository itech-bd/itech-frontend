import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/section-title";
import { getStudentProfile } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileSectionForm } from "@/components/profile/profile-section-form";
import { updateAddressAction, updatePasswordAction, updateProfileDetailsAction, updatePublicUrlAction } from "@/actions/profile";

export default async function StudentProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await getStudentProfile(locale);
  return (
    <main className="space-y-6">
      <SectionTitle kicker="Profile" title={profile.user.name} subtitle={profile.user.email} align="left" />
      <ProfileForm locale={locale} user={profile.user} />
      <ProfileSectionForm
        locale={locale}
        title="Personal details"
        action={updateProfileDetailsAction}
        fields={[
          { name: "gender", label: "Gender" },
          { name: "date_of_birth", label: "Date of birth", type: "date" },
          { name: "mobile_number", label: "Mobile number" },
          { name: "bio", label: "Bio" },
        ]}
      />
      <ProfileSectionForm
        locale={locale}
        title="Public URL"
        action={updatePublicUrlAction}
        fields={[{ name: "public_url", label: "Public URL" }]}
      />
      <ProfileSectionForm
        locale={locale}
        title="Address"
        action={updateAddressAction}
        fields={[
          { name: "house_number", label: "House number" },
          { name: "street", label: "Street" },
          { name: "city", label: "City" },
          { name: "post_office", label: "Post office" },
          { name: "zip_code", label: "Zip code" },
          { name: "country", label: "Country", defaultValue: "Bangladesh" },
        ]}
      />
      <ProfileSectionForm
        locale={locale}
        title="Password"
        action={updatePasswordAction}
        fields={[
          { name: "current_password", label: "Current password", type: "password" },
          { name: "password", label: "New password", type: "password" },
          { name: "password_confirmation", label: "Confirm password", type: "password" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">Educations</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {profile.educations.length ? profile.educations.map((item, index) => <div key={index}>{JSON.stringify(item)}</div>) : <div>No education added.</div>}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">Experiences</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {profile.experiences.length ? profile.experiences.map((item, index) => <div key={index}>{JSON.stringify(item)}</div>) : <div>No experience added.</div>}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">Skills</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {profile.skills.length ? profile.skills.map((item) => <div key={item.id}>{item.name} · {item.proficiency_level ?? "n/a"}</div>) : <div>No skills added.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
