import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { withLocale } from "@/lib/i18n/routing";
import { unwrapLaravelResponse } from "@/lib/api/response";

describe("utility helpers", () => {
  it("formats locale-aware currency and dates", () => {
    expect(formatCurrency(6500, "en")).toContain("6,500");
    expect(formatDate("2026-01-05", "en")).toContain("2026");
  });

  it("prefixes routes with locale", () => {
    expect(withLocale("/courses", "bn")).toBe("/bn/courses");
  });

  it("unwraps laravel envelopes", () => {
    expect(unwrapLaravelResponse({ success: true, message: null, data: { ok: true } })).toEqual({ ok: true });
  });

  it("models api errors", () => {
    const error = new ApiError("Nope", 401, "UNAUTHENTICATED");
    expect(error.status).toBe(401);
    expect(error.code).toBe("UNAUTHENTICATED");
  });
});
