import { describe, expect, it } from "vitest";
import { resolveLoginRedirect } from "@/lib/auth/login-redirect";

describe("login redirect", () => {
  it("keeps student users in the frontend student panel", () => {
    expect(
      resolveLoginRedirect({
        roles: ["student"],
        backendDashboardUrl: "http://127.0.0.1:8000/dashboard",
        next: "/en/checkout",
        locale: "en",
      }),
    ).toBe("/en/checkout");
  });

  it("sends admin and mentor users through the backend handoff URL", () => {
    expect(
      resolveLoginRedirect({
        roles: ["mentor"],
        loginHandoffUrl: "http://127.0.0.1:8000/login/handoff/abc",
        backendDashboardUrl: "http://127.0.0.1:8000/dashboard",
        next: "/en/student",
        locale: "en",
      }),
    ).toBe("http://127.0.0.1:8000/login/handoff/abc");
  });

  it("rejects external next URLs for frontend student redirects", () => {
    expect(
      resolveLoginRedirect({
        roles: ["student"],
        backendDashboardUrl: "http://127.0.0.1:8000/dashboard",
        next: "https://example.test",
        locale: "bn",
      }),
    ).toBe("/bn/student");
  });
});
