"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, UserRound } from "lucide-react";
import { applyNowAction } from "@/actions/apply";
import type { ActionState } from "@/actions/auth";
import type { AuthUser, CourseSummary } from "@/lib/api/types";
import type { AppLocale } from "@/lib/i18n/routing";

const initialState: ActionState = { ok: false };

function courseOptionValue(course: CourseSummary) {
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

export function ApplyForm({
  courses,
  locale,
  currentUser = null,
}: {
  courses: CourseSummary[];
  locale: AppLocale;
  currentUser?: AuthUser | null;
}) {
  const [state, formAction, pending] = useActionState(applyNowAction, initialState);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBatchType, setSelectedBatchType] = useState("");
  const isStudent = isStudentAccount(currentUser);
  const selectedCourseData = useMemo(
    () => courses.find((course) => courseOptionValue(course) === selectedCourse),
    [courses, selectedCourse],
  );
  const batches = selectedCourseData?.batches ?? [];
  const typeOptions = useMemo(() => courseTypeOptions(selectedCourseData), [selectedCourseData]);
  const formProps = isStudent
    ? { action: formAction }
    : { action: `/${locale}/register`, method: "get" as const };

  return (
    <form
      {...formProps}
      className="rounded-lg bg-white p-5 text-[color:var(--text-heading)] shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-6"
    >
      <input type="hidden" name="locale" value={locale} />
      <h2 className="text-2xl font-black">Apply for a course</h2>
      <p className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">
        {isStudent ? "Choose a new course and submit your admission request." : "Get instant access to upcoming training courses"}
      </p>

      <div className="mt-5 grid gap-3">
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

              setSelectedCourse(courseValue);
              setSelectedBatch("");
              setSelectedBatchType(nextTypeOptions.length === 1 ? nextTypeOptions[0].value : "");
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
          <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
            Course Type
            <select
              name="batch_type"
              value={selectedBatchType}
              required
              onChange={(event) => setSelectedBatchType(event.target.value)}
              className="min-h-11 rounded-lg border border-[color:var(--border-default)] bg-white px-3 text-sm font-semibold text-[color:var(--text-body)] outline-none focus:border-[color:var(--brand-primary)]"
            >
              <option value="">--Select Type--</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="rounded-lg bg-[color:var(--surface-secondary)] px-3 py-3 text-xs font-bold text-[color:var(--text-muted)]">
            Course Type
            <div className="mt-1 text-sm font-black text-[color:var(--brand-primary)]">Online / Offline admission available</div>
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
          </>
        ) : null}

        {state.message ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-[color:var(--error)]">{state.message}</p> : null}

        <button
          type="submit"
          disabled={pending || courses.length === 0}
          className="focus-ring mt-1 min-h-12 rounded-lg bg-[color:var(--brand-secondary)] px-5 text-sm font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Submitting..." : isStudent ? "APPLY NOW" : "CONTINUE"}
        </button>

        {courses.length === 0 ? (
          <p className="text-center text-xs font-bold text-[color:var(--text-muted)]">
            No new courses are open for admission right now.
          </p>
        ) : null}
      </div>
    </form>
  );
}
