export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type LocaleCode = "en" | "bn";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  children?: NavItem[];
};

export type FooterNavItem = {
  label: string;
  href: string;
};

export type PublicSettings = Record<string, string | null>;

export type PublicBootstrap = {
  locale: LocaleCode;
  settings: PublicSettings;
  navigation: NavItem[];
  footer_navigation: FooterNavItem[];
  auth: {
    registration_enabled: boolean;
    email_verification_required: boolean;
  };
};

export type CoursePricing = {
  old_price: number | null;
  discount_price: number | null;
  online_old_price: number | null;
  online_discount_price: number | null;
  offline_old_price: number | null;
  offline_discount_price: number | null;
  currency: string;
};

export type CourseSummary = {
  id: number;
  slug: string | null;
  title: string;
  track?: string;
  thumbnail_url: string | null;
  status?: string;
  description?: string;
  pricing?: CoursePricing;
  batches?: BatchSummary[];
  enrolled_batches_count?: number;
};

export type BatchMentorSummary = {
  id: number;
  name: string;
  email?: string | null;
  profile_image_url?: string | null;
};

export type BatchSummary = {
  id: number;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  class_days: string[];
  class_time: string | null;
  mentors?: BatchMentorSummary[];
  course?: CourseSummary | null;
  enrollment?: {
    status: "pending" | "approved" | null;
    batch_type: "online" | "offline" | null;
    approved_at: string | null;
  } | null;
  class_schedules_count?: number;
  mentors_count?: number;
  live_class_link?: string | null;
};

export type MentorSummary = {
  id: number;
  slug: string | number | null;
  name: string;
  topic: string | null;
  bio: string | null;
  profile_image_url: string | null;
  email?: string | null;
  profile?: Record<string, unknown> | null;
  address?: Record<string, unknown> | null;
  educations?: Array<Record<string, unknown>>;
  experiences?: Array<Record<string, unknown>>;
  skills?: Array<{ id: number; name: string; proficiency_level?: string | null }>;
};

export type ReviewSummary = {
  id: number;
  name: string;
  designation: string | null;
  quote: string;
  rating: number;
};

export type NewsSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
  body?: string;
};

export type PublicPageSection = {
  id: number;
  key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  icon: string | null;
  button_text: string | null;
  button_link: string | null;
};

export type PublicPage = {
  id?: number;
  slug: string;
  sections: PublicPageSection[];
};

export type PublicHome = {
  page: PublicPage;
  stats: {
    courses: number;
    mentors: number;
    batches: number;
    students: number;
    classes: number;
    updates: number;
  };
  popular_courses: CourseSummary[];
  course_tracks: Array<{ name: string; course_ids: number[] }>;
  ongoing_batches?: BatchSummary[];
  upcoming_batches: BatchSummary[];
  mentors: MentorSummary[];
  reviews: ReviewSummary[];
  latest_news: NewsSummary[];
};

export type PublicPagePayload = {
  page: PublicPage;
  stats?: PublicHome["stats"];
  featured_courses?: CourseSummary[];
};

export type PublicProfilePayload = {
  user: {
    id: number;
    name: string;
    email: string;
    profile_image_url: string | null;
  };
  details: Record<string, unknown> | null;
  address: Record<string, unknown> | null;
  educations: Array<Record<string, unknown>>;
  experiences: Array<Record<string, unknown>>;
  skills: Array<{ id: number; name: string; proficiency_level: string | null }>;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  profile_image_url: string | null;
  roles: string[];
  permissions: string[];
  profile?: Record<string, unknown> | null;
};

export type LoginResult = {
  token_type: string | null;
  access_token: string | null;
  user: AuthUser;
  must_change_password: boolean;
};

export type RegistrationResult = {
  user: AuthUser;
  verification_required: boolean;
};

export type CheckoutPreview = {
  course: CourseSummary;
  requires_batch_type: boolean;
  default_amount: number;
  batches: BatchSummary[];
  joined_batches: Array<{
    batch_id: number;
    status: "pending" | "approved";
    batch_type: "online" | "offline" | null;
  }>;
};

export type CheckoutOrder = {
  id: number;
  status: "pending" | "paid" | "cancelled";
  amount: number;
  currency: string;
  batch_type: "online" | "offline" | null;
  created_at: string | null;
  course: { id: number; slug: string | null; title: string } | null;
  batch: { id: number; name: string } | null;
};

export type StudentDashboard = {
  user: {
    id: number;
    name: string;
    email: string;
    profile_image_url: string | null;
  };
  menu: NavItem[];
  stats: {
    courses: number;
    batches: number;
    approved_batches: number;
    pending_batches: number;
    paid_invoices: number;
    paid_amount: number;
  };
  upcoming_schedules: Array<{
    id: number;
    class_date: string | null;
    topic: string;
    live_class_link: string | null;
    recorded_video_link: string | null;
    batch: {
      id: number;
      name: string;
      course: { id: number; slug: string | null; title: string } | null;
    } | null;
  }>;
  recent_batches: BatchSummary[];
  recent_orders: Array<{
    id: number;
    status: string;
    amount: number;
    currency: string;
    batch_type: string | null;
    created_at: string | null;
    course: { id: number; slug: string | null; title: string } | null;
    batch: { id: number; name: string } | null;
  }>;
};

export type StudentCourseDetail = {
  course: CourseSummary & { description: string };
  batches: BatchSummary[];
};

export type StudentBatchDetail = {
  batch: BatchSummary & {
    live_class_link: string | null;
    mentors: BatchMentorSummary[];
    course: CourseSummary | null;
  };
  enrollment: {
    status: "pending" | "approved" | null;
    batch_type: "online" | "offline" | null;
    approved_at: string | null;
  };
  schedules: Array<{
    id: number;
    class_date: string | null;
    topic: string;
    live_class_link: string | null;
    recorded_video_link: string | null;
  }>;
  schedule_access: boolean;
};

export type StudentInvoice = {
  id: number;
  status: "pending" | "paid" | "cancelled";
  amount: number;
  currency: string;
  batch_type: string | null;
  created_at: string | null;
  updated_at?: string | null;
  download_path: string;
  course: { id: number; slug: string | null; title: string } | null;
  batch: { id: number; name: string } | null;
  student?: { id: number; name: string; email: string } | null;
};

export type StudentProfile = {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified: boolean;
    profile_image_url: string | null;
  };
  details: Record<string, unknown> | null;
  public_profile_path: string | null;
  address: Record<string, unknown> | null;
  educations: Array<Record<string, unknown>>;
  experiences: Array<Record<string, unknown>>;
  skills: Array<{ id: number; name: string; proficiency_level: string | null }>;
};
