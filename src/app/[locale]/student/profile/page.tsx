import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BadgeCheck, BriefcaseBusiness, GraduationCap, Link as LinkIcon, ShieldCheck, Sparkles } from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileSectionForm } from "@/components/profile/profile-section-form";
import { StudentCard, StudentEmptyState, StudentPageHeader } from "@/components/student/student-panel-ui";
import { updateAddressAction, updatePasswordAction, updateProfileDetailsAction, updatePublicUrlAction } from "@/actions/profile";
import { getStudentProfile } from "@/lib/api/site";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await getStudentProfile(locale);
  const publicUrl = value(profile.details, "public_url");

  return (
    <main className="space-y-5">
      <StudentPageHeader
        kicker="Profile"
        title={profile.user.name}
        description="Manage your personal information, public profile, address, and account security."
        action={
          publicUrl ? (
            <a
              href={`/${locale}/profiles/${publicUrl}`}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-secondary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[color:var(--brand-secondary-dark)]"
            >
              <LinkIcon aria-hidden className="h-4 w-4" />
              Public profile
            </a>
          ) : null
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <ProfileForm locale={locale} user={profile.user} />
        <StudentCard className="bg-[linear-gradient(135deg,var(--text-heading),var(--brand-primary-deep))] text-white">
          <Sparkles aria-hidden className="h-6 w-6 text-[color:var(--brand-secondary)]" />
          <h2 className="mt-4 text-2xl font-black">Build a strong learner profile</h2>
          <p className="mt-3 text-sm leading-7 text-white/76">Keep your details accurate so certificates, invoices, mentor communication, and public profile information stay consistent.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <BadgeCheck aria-hidden className="h-5 w-5 text-emerald-300" />
              <div className="mt-2 text-sm font-black">Verified access</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <ShieldCheck aria-hidden className="h-5 w-5 text-orange-300" />
              <div className="mt-2 text-sm font-black">Secure account</div>
            </div>
          </div>
        </StudentCard>
      </div>

      <section className="grid gap-5 xl:grid-cols-2">
        <ProfileSectionForm
          locale={locale}
          title="Personal details"
          action={updateProfileDetailsAction}
          fields={[
            { name: "gender", label: "Gender", defaultValue: value(profile.details, "gender") },
            { name: "date_of_birth", label: "Date of birth", type: "date", defaultValue: value(profile.details, "date_of_birth") },
            { name: "mobile_number", label: "Mobile number", defaultValue: value(profile.details, "mobile_number") },
            { name: "bio", label: "Bio", type: "textarea", defaultValue: value(profile.details, "bio") },
          ]}
        />
        <ProfileSectionForm
          locale={locale}
          title="Address"
          action={updateAddressAction}
          fields={[
            { name: "house_number", label: "House number", defaultValue: value(profile.address, "house_number") },
            { name: "street", label: "Street", defaultValue: value(profile.address, "street") },
            { name: "city", label: "City", defaultValue: value(profile.address, "city") },
            { name: "post_office", label: "Post office", defaultValue: value(profile.address, "post_office") },
            { name: "zip_code", label: "Zip code", defaultValue: value(profile.address, "zip_code") },
            { name: "country", label: "Country", defaultValue: value(profile.address, "country") || "Bangladesh" },
          ]}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ProfileSectionForm
          locale={locale}
          title="Public URL"
          action={updatePublicUrlAction}
          fields={[{ name: "public_url", label: "Public URL", defaultValue: publicUrl }]}
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
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <ProfileListCard title="Educations" icon={<GraduationCap aria-hidden className="h-5 w-5" />} items={profile.educations} empty="No education added yet." />
        <ProfileListCard title="Experiences" icon={<BriefcaseBusiness aria-hidden className="h-5 w-5" />} items={profile.experiences} empty="No experience added yet." />
        <SkillsCard skills={profile.skills} />
      </section>
    </main>
  );
}

function value(record: Record<string, unknown> | null, key: string) {
  const raw = record?.[key];
  if (raw === null || raw === undefined) return "";
  if (typeof raw === "string") return key.includes("date") ? raw.slice(0, 10) : raw;
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  return "";
}

function ProfileListCard({
  title,
  icon,
  items,
  empty,
}: {
  title: string;
  icon: ReactNode;
  items: Array<Record<string, unknown>>;
  empty: string;
}) {
  return (
    <StudentCard>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--brand-primary-light)] text-[color:var(--brand-primary)]">{icon}</div>
        <h2 className="text-xl font-black text-[color:var(--text-heading)]">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-[color:var(--border-default)]/70 bg-[color:var(--surface-secondary)] p-4">
              {displayEntries(item).map(([key, itemValue]) => (
                <div key={key} className="mt-1 first:mt-0">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[color:var(--text-muted)]">{labelize(key)}: </span>
                  <span className="text-sm font-bold text-[color:var(--text-heading)]">{itemValue}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <StudentEmptyState title={empty} message="You can add this information from the profile tools when needed." />
        )}
      </div>
    </StudentCard>
  );
}

function SkillsCard({ skills }: { skills: Array<{ id: number; name: string; proficiency_level: string | null }> }) {
  return (
    <StudentCard>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--surface-tint)] text-[color:var(--brand-secondary)]">
          <Sparkles aria-hidden className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-black text-[color:var(--text-heading)]">Skills</h2>
      </div>
      {skills.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill.id} className="rounded-full bg-[color:var(--brand-primary-light)] px-3 py-1.5 text-xs font-black text-[color:var(--brand-primary-dark)]">
              {skill.name}
              {skill.proficiency_level ? ` - ${skill.proficiency_level}` : ""}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <StudentEmptyState title="No skills added yet" message="Add skills to make your student profile more useful." />
        </div>
      )}
    </StudentCard>
  );
}

function displayEntries(item: Record<string, unknown>) {
  return Object.entries(item)
    .filter(([key, itemValue]) => !["id", "user_id", "created_at", "updated_at", "deleted_at"].includes(key) && itemValue !== null && itemValue !== "")
    .map(([key, itemValue]) => [key, typeof itemValue === "object" ? JSON.stringify(itemValue) : String(itemValue)] as const)
    .slice(0, 5);
}

function labelize(key: string) {
  return key.replace(/_/g, " ");
}
