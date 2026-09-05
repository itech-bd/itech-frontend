"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, Ticket, UserRound } from "lucide-react";
import { applyNowAction } from "@/actions/apply";
import type { ActionState } from "@/actions/auth";
import type { AuthUser, CourseSummary } from "@/lib/api/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const initialState: ActionState = { ok: false };

export function courseOptionValue(course: CourseSummary) {
  return course.slug ?? String(course.id);
}

function hasPrice(value: number | null | undefined) {
  return value !== null && value !== undefined;
}

function courseTypeOptions(course: CourseSummary | undefined) {
  if (!course?.pricing) return [];

  const options: Array<{ value: "online" | "offline"; label: string }> = [];
  if (hasPrice(course.pricing.online_discount_price) || hasPrice(course.pricing.online_old_price)) {
    options.push({ value: "online", label: "Online" });
  }
  if (hasPrice(course.pricing.offline_discount_price) || hasPrice(course.pricing.offline_old_price)) {
    options.push({ value: "offline", label: "Offline" });
  }

  return options;
}

function isStudentAccount(user: AuthUser | null | undefined) {
  return user?.type === "student" || user?.roles.some((role) => role.toLowerCase() === "student") || false;
}

type ApplyFormProps = {
  courses: CourseSummary[];
  locale: AppLocale;
  currentUser?: AuthUser | null;
  selectedCourseValue?: string;
  onSelectedCourseChange?: (value: string) => void;
  className?: string;
};

export function ApplyForm({
  courses,
  locale,
  currentUser = null,
  selectedCourseValue,
  onSelectedCourseChange,
  className,
}: ApplyFormProps) {
  const [state, formAction, pending] = useActionState(applyNowAction, initialState);
  const [internalSelectedCourse, setInternalSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBatchType, setSelectedBatchType] = useState("");
  const isStudent = isStudentAccount(currentUser);
  const selectedCourse = selectedCourseValue ?? internalSelectedCourse;
  const selectedCourseData = useMemo(
    () => courses.find((course) => courseOptionValue(course) === selectedCourse),
    [courses, selectedCourse],
  );
  const batches = selectedCourseData?.batches ?? [];
  const typeOptions = useMemo(() => courseTypeOptions(selectedCourseData), [selectedCourseData]);
  const formProps = isStudent
    ? { action: formAction }
    : { action: `/${locale}/register`, method: "get" as const };
  const updateSelectedCourse = (value: string) => {
    if (onSelectedCourseChange) {
      onSelectedCourseChange(value);
      return;
    }

    setInternalSelectedCourse(value);
  };

  return (
    <form
      {...formProps}
      className={cn("flex flex-col rounded-lg bg-white p-5 text-[color:var(--text-heading)] shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-6", className)}
    >
      <input type="hidden" name="locale" value={locale} />
      <h2 className="text-2xl font-black">Apply for a course</h2>
      <p className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">
        {isStudent ? "Choose a new course and submit your admission request." : "Get instant access to upcoming training courses"}
      </p>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        {isStudent ? (
          <div className="flex items-center gap-3 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-secondary)] px-3 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--brand-primary)] text-white">
              <UserRound aria-hidden className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-[color:var(--text-heading)]">{currentUser?.name}</div>
              <div className="truncate text-xs font-semibold text-[color:var(--text-muted)]">{currentUser?.email}</div>
            </div>
            <CheckCircle2 aria-hidden className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />
          </div>
        ) : null}

        <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
          Select Course
          <select
            name="course"
            value={selectedCourse}
            required
            onChange={(event) => {
              const courseValue = event.target.value;
              const course = courses.find((item) => courseOptionValue(item) === courseValue);
              const nextTypeOptions = courseTypeOptions(course);

              updateSelectedCourse(courseValue);
              setSelectedBatch("");
              setSelectedBatchType(nextTypeOptions[0]?.value ?? "");
            }}
            className="min-h-11 rounded-lg border border-[color:var(--border-default)] bg-white px-3 text-sm font-semibold text-[color:var(--text-body)] outline-none focus:border-[color:var(--brand-primary)]"
          >
            <option value="">--Select Course--</option>
            {courses.map((course) => (
              <option key={course.id} value={courseOptionValue(course)}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        {state.errors?.course ? <p className="-mt-1 text-xs font-semibold text-[color:var(--error)]">{state.errors.course[0]}</p> : null}

        <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
          Select Batch
          <select
            name="batch_id"
            value={selectedBatch}
            required={selectedCourse !== "" && batches.length > 0}
            onChange={(event) => setSelectedBatch(event.target.value)}
            className="min-h-11 rounded-lg border border-[color:var(--border-default)] bg-white px-3 text-sm font-semibold text-[color:var(--text-body)] outline-none focus:border-[color:var(--brand-primary)]"
          >
            <option value="">--Select Batch--</option>
            {selectedCourse && batches.length === 0 ? <option disabled>No batch available</option> : null}
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </label>
        {state.errors?.batch_id ? <p className="-mt-1 text-xs font-semibold text-[color:var(--error)]">{state.errors.batch_id[0]}</p> : null}

        {typeOptions.length ? (
          <div className="grid gap-2 text-xs font-extrabold text-[color:var(--text-heading)]">
            <span>Course Type</span>
            <div className="flex min-h-8 flex-wrap items-center gap-x-5 gap-y-2">
              {typeOptions.map((option) => (
                <label key={option.value} className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text-body)]">
                  <input
                    type="radio"
                    name="batch_type"
                    value={option.value}
                    checked={selectedBatchType === option.value}
                    required
                    onChange={(event) => setSelectedBatchType(event.target.value)}
                    className="h-4 w-4 accent-[color:var(--brand-primary)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
            Course Type
            <div className="rounded-lg bg-[color:var(--surface-secondary)] px-3 py-3 text-sm font-black text-[color:var(--text-muted)]">
              {selectedCourse ? "Online / Offline admission available" : "Select a course first"}
            </div>
          </div>
        )}
        {state.errors?.batch_type ? <p className="-mt-1 text-xs font-semibold text-[color:var(--error)]">{state.errors.batch_type[0]}</p> : null}

        {!isStudent ? (
          <>
            <label className="sr-only" htmlFor="apply-name">Your name</label>
            <input
              id="apply-name"
              name="name"
              placeholder="Write Your Name"
              className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]"
            />

            <label className="sr-only" htmlFor="apply-email">Your email</label>
            <input
              id="apply-email"
              name="email"
              type="email"
              placeholder="Write Your Email"
              className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]"
            />

            <label className="sr-only" htmlFor="apply-phone">Mobile number</label>
            <input
              id="apply-phone"
              name="phone"
              placeholder="Write Your Mobile Number"
              className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]"
            />

            <label className="sr-only" htmlFor="apply-coupon">Coupon code</label>
            <div className="flex min-h-11 items-center gap-3 rounded-lg border border-[color:var(--border-default)] px-3 focus-within:border-[color:var(--brand-primary)]">
              <Ticket aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--text-muted)]" />
              <input
                id="apply-coupon"
                name="coupon_code"
                placeholder="COUPON CODE (OPTIONAL)"
                className="min-w-0 flex-1 text-sm font-black uppercase text-[color:var(--text-body)] outline-none placeholder:text-[color:var(--text-muted)]"
              />
            </div>
          </>
        ) : null}

        {state.message ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-[color:var(--error)]">{state.message}</p> : null}

        <div className="grid gap-2 pt-2">
          <button
            type="submit"
            disabled={pending || courses.length === 0}
            className="focus-ring min-h-12 rounded-lg bg-[color:var(--brand-secondary)] px-5 text-sm font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Submitting..." : "APPLY NOW"}
          </button>

          {courses.length === 0 ? (
            <p className="text-center text-xs font-bold text-[color:var(--text-muted)]">
              No new courses are open for admission right now.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
