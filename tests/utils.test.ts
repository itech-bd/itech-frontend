import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { withLocale } from "@/lib/i18n/routing";
import { unwrapLaravelResponse } from "@/lib/api/response";
import { resolveMediaUrl } from "@/lib/media";

afterEach(() => {
  vi.unstubAllEnvs();
});

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

  it("rebases Laravel media URLs to the configured asset host", () => {
    vi.stubEnv("NEXT_PUBLIC_LARAVEL_ASSET_URL", "https://live.example.com");
    vi.stubEnv("NEXT_PUBLIC_LARAVEL_STORAGE_MEDIA", "enabled");

    expect(resolveMediaUrl("http://127.0.0.1:8000/storage/courses/thumb.png")).toBe(
      "https://live.example.com/media/courses/thumb.png",
    );
    expect(resolveMediaUrl("http://localhost/media/profile-images/user.jpg?size=small")).toBe(
      "https://live.example.com/media/profile-images/user.jpg?size=small",
    );
    expect(resolveMediaUrl("courses/thumbnails/course.png")).toBe(
      "https://live.example.com/media/courses/thumbnails/course.png",
    );
  });

  it("can disable Laravel storage media from env", () => {
    vi.stubEnv("NEXT_PUBLIC_LARAVEL_ASSET_URL", "http://127.0.0.1:8000");
    vi.stubEnv("NEXT_PUBLIC_LARAVEL_STORAGE_MEDIA", "disabled");

    expect(resolveMediaUrl("/media/courses/thumb.png")).toBeNull();
  });
});
