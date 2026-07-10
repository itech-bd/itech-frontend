import { render, screen } from "@testing-library/react";
import { vi, describe, expect, it, beforeEach } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => ({ get: (key: string) => (key === "next" ? "/en/student" : null) }),
}));

vi.mock("@/actions/auth", () => ({
  loginAction: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: () => [
      { ok: false, message: "The provided credentials are incorrect.", errors: { email: ["The email field is required."] } },
      vi.fn(),
      false,
    ],
  };
});

import { LoginForm } from "@/components/auth/login-form";

describe("login form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders validation errors", () => {
    render(<LoginForm locale="en" />);
    expect(screen.getByText("The email field is required.")).toBeInTheDocument();
    expect(screen.getByText("The provided credentials are incorrect.")).toBeInTheDocument();
  });
});
