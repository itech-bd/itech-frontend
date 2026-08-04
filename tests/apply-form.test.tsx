import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplyForm } from "@/components/public/apply-form";
import type { CourseSummary } from "@/lib/api/types";

const courses: CourseSummary[] = [
  {
    id: 1,
    slug: "graphic-design",
    title: "Graphic Design",
    thumbnail_url: null,
    batches: [
      {
        id: 101,
        name: "Graphic Batch A",
        status: "upcoming",
        start_date: null,
        end_date: null,
        class_days: [],
        class_time: null,
      },
    ],
  },
  {
    id: 2,
    slug: "web-development",
    title: "Web Development",
    thumbnail_url: null,
    batches: [
      {
        id: 202,
        name: "Web Batch A",
        status: "upcoming",
        start_date: null,
        end_date: null,
        class_days: [],
        class_time: null,
      },
    ],
  },
];

describe("apply form", () => {
  it("filters batches by selected course and clears old batch selection", () => {
    render(<ApplyForm courses={courses} locale="en" />);

    const courseSelect = screen.getByLabelText("Select Course") as HTMLSelectElement;
    const batchSelect = screen.getByLabelText("Select Batch") as HTMLSelectElement;

    expect(screen.queryByRole("option", { name: "Graphic Batch A" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Web Batch A" })).not.toBeInTheDocument();

    fireEvent.change(courseSelect, { target: { value: "web-development" } });

    expect(screen.queryByRole("option", { name: "Graphic Batch A" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Web Batch A" })).toBeInTheDocument();

    fireEvent.change(batchSelect, { target: { value: "202" } });
    expect(batchSelect.value).toBe("202");

    fireEvent.change(courseSelect, { target: { value: "graphic-design" } });

    expect(batchSelect.value).toBe("");
    expect(screen.getByRole("option", { name: "Graphic Batch A" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Web Batch A" })).not.toBeInTheDocument();
  });
});
