import { apiFetch } from "./request";
import type {
  AuthUser,
  CheckoutOrder,
  CheckoutPreview,
  LoginResult,
  BatchSummary,
  NewsSummary,
  PaginatedResponse,
  PublicBootstrap,
  PublicHome,
  PublicPagePayload,
  PublicProfilePayload,
  RegistrationResult,
  ReviewSummary,
  StudentBatchDetail,
  StudentCourseDetail,
  StudentDashboard,
  StudentInvoice,
  StudentProfile,
  CourseSummary,
  MentorSummary,
} from "./types";

type Locale = "en" | "bn";

function queryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const value = searchParams.toString();
  return value ? `?${value}` : "";
}

export async function getPublicBootstrap(locale: Locale) {
  return apiFetch<PublicBootstrap>("/public/bootstrap", { locale, noStore: false });
}

export async function getPublicHome(locale: Locale) {
  return apiFetch<PublicHome>("/public/home", { locale, noStore: false });
}

export async function getPublicPage(locale: Locale, slug: string) {
  return apiFetch<PublicPagePayload>(`/public/pages/${slug}`, { locale, noStore: false });
}

export async function listPublicCourses(
  locale: Locale,
  params: { search?: string; track?: string; page?: number; per_page?: number },
) {
  return apiFetch<PaginatedResponse<CourseSummary> & { filters: Record<string, unknown> }>(
    `/public/courses${queryString(params)}`,
    { locale, noStore: false },
  );
}

export async function getPublicCourse(locale: Locale, course: string) {
  return apiFetch<{ course: CourseSummary & { description: string; batches?: BatchSummary[] }; related_courses: CourseSummary[] }>(
    `/public/courses/${course}`,
    { locale, noStore: false },
  );
}

export async function listPublicMentors(locale: Locale, params: { search?: string; page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<MentorSummary> & { filters: Record<string, unknown> }>(
    `/public/mentors${queryString(params)}`,
    { locale, noStore: false },
  );
}

export async function getPublicMentor(locale: Locale, mentor: string) {
  return apiFetch<{ mentor: MentorSummary; related_courses: CourseSummary[] }>(`/public/mentors/${mentor}`, {
    locale,
    noStore: false,
  });
}

export async function getPublicProfile(locale: Locale, publicUrl: string) {
  return apiFetch<PublicProfilePayload>(`/public/profiles/${publicUrl}`, { locale, noStore: false });
}

export async function listPublicReviews(locale: Locale, params: { page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<ReviewSummary>>(
    `/public/reviews${queryString(params)}`,
    { locale, noStore: false },
  );
}

export async function listPublicNews(locale: Locale, params: { search?: string; page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<NewsSummary> & { filters: Record<string, unknown> }>(
    `/public/news${queryString(params)}`,
    { locale, noStore: false },
  );
}

export async function getPublicNews(locale: Locale, newsUpdate: string) {
  return apiFetch<{ news: NewsSummary & { body: string }; related_news: NewsSummary[] }>(`/public/news/${newsUpdate}`, {
    locale,
    noStore: false,
  });
}

export async function submitContact(
  locale: Locale,
  payload: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  },
) {
  return apiFetch<{ message_id: number }>("/public/contact", {
    method: "POST",
    locale,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    noStore: false,
  });
}

export async function login(locale: Locale, payload: { email: string; password: string; device_name?: string; issue_token?: boolean }) {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    locale,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_name: "nextjs-web",
      issue_token: true,
      ...payload,
    }),
    noStore: false,
  });
}

export async function register(locale: Locale, payload: { name: string; email: string; password: string; password_confirmation: string }) {
  return apiFetch<RegistrationResult>("/auth/register", {
    method: "POST",
    locale,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    noStore: false,
  });
}

export async function resendVerification(locale: Locale, email: string) {
  return apiFetch<null>("/auth/resend-verification", {
    method: "POST",
    locale,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    noStore: false,
  });
}

export async function forgotPassword(locale: Locale, email: string) {
  return apiFetch<null>("/auth/forgot-password", {
    method: "POST",
    locale,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    noStore: false,
  });
}

export async function resetPassword(
  locale: Locale,
  payload: { token: string; email: string; password: string; password_confirmation: string },
) {
  return apiFetch<null>("/auth/reset-password", {
    method: "POST",
    locale,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    noStore: false,
  });
}

export async function me(locale: Locale) {
  return apiFetch<AuthUser>("/auth/me", { locale, auth: true });
}

export async function logout(locale: Locale) {
  return apiFetch<null>("/auth/logout", { method: "POST", locale, auth: true, noStore: false });
}

export async function logoutAll(locale: Locale) {
  return apiFetch<null>("/auth/logout-all", { method: "POST", locale, auth: true, noStore: false });
}

export async function getCheckoutPreview(locale: Locale, course: string) {
  return apiFetch<CheckoutPreview>(`/checkout/courses/${course}`, { locale, auth: true });
}

export async function storeCheckoutOrder(
  locale: Locale,
  course: string,
  payload: { batch_id?: number | null; batch_type?: "online" | "offline" | null },
) {
  return apiFetch<CheckoutOrder>(`/checkout/courses/${course}`, {
    method: "POST",
    locale,
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getCheckoutOrder(locale: Locale, order: string) {
  return apiFetch<CheckoutOrder>(`/checkout/orders/${order}`, { locale, auth: true });
}

export async function getStudentDashboard(locale: Locale) {
  return apiFetch<StudentDashboard>("/student/dashboard", { locale, auth: true });
}

export async function listStudentCourses(locale: Locale, params: { search?: string; page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<CourseSummary> & { filters: Record<string, unknown> }>(
    `/student/courses${queryString(params)}`,
    { locale, auth: true },
  );
}

export async function getStudentCourse(locale: Locale, course: string) {
  return apiFetch<StudentCourseDetail>(`/student/courses/${course}`, { locale, auth: true });
}

export async function listStudentBatches(locale: Locale, params: { status?: "pending" | "approved"; page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<BatchSummary> & { filters: Record<string, unknown> }>(
    `/student/batches${queryString(params)}`,
    { locale, auth: true },
  );
}

export async function getStudentBatch(locale: Locale, batch: string) {
  return apiFetch<StudentBatchDetail>(`/student/batches/${batch}`, { locale, auth: true });
}

export async function listStudentMentors(locale: Locale, params: { search?: string; page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<MentorSummary> & { filters: Record<string, unknown> }>(
    `/student/mentors${queryString(params)}`,
    { locale, auth: true },
  );
}

export async function listStudentInvoices(locale: Locale, params: { status?: "pending" | "paid" | "cancelled"; page?: number; per_page?: number }) {
  return apiFetch<PaginatedResponse<StudentInvoice> & { filters: Record<string, unknown> }>(
    `/student/invoices${queryString(params)}`,
    { locale, auth: true },
  );
}

export async function getStudentInvoice(locale: Locale, order: string) {
  return apiFetch<StudentInvoice>(`/student/invoices/${order}`, { locale, auth: true });
}

export async function getStudentProfile(locale: Locale) {
  return apiFetch<StudentProfile>("/student/profile", { locale, auth: true });
}
