"use client";

import { useMemo, useState } from "react";
import type { CourseSummary } from "@/lib/api/types";
import type { AppLocale } from "@/lib/i18n/routing";

function courseOptionValue(course: CourseSummary) {
  return course.slug ?? String(course.id);
}

export function ApplyForm({ courses, locale }: { courses: CourseSummary[]; locale: AppLocale }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const batches = useMemo(() => {
    return courses.find((course) => courseOptionValue(course) === selectedCourse)?.batches ?? [];
  }, [courses, selectedCourse]);

  return (
    <form action={`/${locale}/register`} className="rounded-lg bg-white p-5 text-[color:var(--text-heading)] shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-6">
      <h2 className="text-2xl font-black">Apply for a course</h2>
      <p className="mt-1 text-sm font-semibold text-[color:var(--text-muted)]">Get instant access to upcoming training courses</p>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
          Select Course
          <select
            name="course"
            value={selectedCourse}
            onChange={(event) => {
              setSelectedCourse(event.target.value);
              setSelectedBatch("");
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

        <label className="grid gap-1.5 text-xs font-extrabold text-[color:var(--text-heading)]">
          Select Batch
          <select
            name="batch"
            value={selectedBatch}
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

        <div className="rounded-lg bg-[color:var(--surface-secondary)] px-3 py-3 text-xs font-bold text-[color:var(--text-muted)]">
          Course Type
          <div className="mt-1 text-sm font-black text-[color:var(--brand-primary)]">Online / Offline admission available</div>
        </div>

        <label className="sr-only" htmlFor="apply-name">Your name</label>
        <input id="apply-name" name="name" placeholder="Write Your Name" className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]" />

        <label className="sr-only" htmlFor="apply-email">Your email</label>
        <input id="apply-email" name="email" type="email" placeholder="Write Your Email" className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]" />

        <label className="sr-only" htmlFor="apply-phone">Mobile number</label>
        <input id="apply-phone" name="phone" placeholder="Write Your Mobile Number" className="min-h-11 rounded-lg border border-[color:var(--border-default)] px-3 text-sm font-semibold outline-none focus:border-[color:var(--brand-primary)]" />

        <button type="submit" className="focus-ring mt-1 min-h-12 rounded-lg bg-[color:var(--brand-secondary)] px-5 text-sm font-black text-white transition hover:bg-[color:var(--brand-secondary-dark)]">
          APPLY NOW
        </button>
      </div>
    </form>
  );
}
