import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { StudentShell } from "@/components/student/student-shell";
import { getPublicBootstrap, getStudentDashboard } from "@/lib/api/site";
import { ApiError } from "@/lib/api/errors";
import { isLocale } from "@/lib/i18n/routing";

export default async function StudentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  type Dashboard = Awaited<ReturnType<typeof getStudentDashboard>>;
  type Bootstrap = Awaited<ReturnType<typeof getPublicBootstrap>>;
  let dashboard: Dashboard;
  let bootstrap: Bootstrap;

  try {
    [dashboard, bootstrap] = await Promise.all([
      getStudentDashboard(locale),
      getPublicBootstrap(locale),
    ]);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      redirect(`/${locale}/login?next=/${locale}/student`);
    }
    throw error;
  }

  return <StudentShell locale={locale} dashboard={dashboard} bootstrap={bootstrap}>{children}</StudentShell>;
}
