import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";

describe("status patterns", () => {
  it("renders a status badge", () => {
    render(<StatusBadge status="paid" />);
    expect(screen.getByText("paid")).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(<EmptyState title="No data" message="Nothing here yet." />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});
