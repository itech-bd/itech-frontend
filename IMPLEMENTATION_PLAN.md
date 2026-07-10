# Implementation Plan

## Milestone 1

- [x] Scaffold the Next.js App Router project.
- [x] Add typed config, environment validation, and API client foundations.
- [x] Generate OpenAPI types from `Edu_Project-api-v1/docs/openapi.json`.

## Milestone 2

- [x] Build localized public routes and shared site layout.
- [x] Recreate the Blade public visual language with reusable Tailwind components.
- [x] Implement metadata, sitemap, robots, and sanitized CMS rendering.

## Milestone 3

- [x] Implement auth flows with secure HTTP-only token storage.
- [x] Add login, register, forgot password, reset password, resend verification, logout, and current-user handling.

## Milestone 4

- [x] Build checkout routes and authenticated course ordering.
- [x] Add invoice and PDF proxy handling.

## Milestone 5

- [x] Build the student shell, dashboard, courses, batches, mentors, invoices, and profile scaffolding.
- [x] Add route guards, state handling, and accessibility improvements.

## Milestone 6

- [x] Add tests, fix lint/type/build failures, and finalize production readiness.

## Route Coverage

- Public: `/[locale]`, `/about`, `/courses`, `/courses/[slug]`, `/solutions/*`, `/mentors`, `/mentors/[mentor]`, `/profiles/[publicUrl]`, `/reviews`, `/news`, `/news/[slug]`, `/contact`, `/privacy`, `/terms`
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- Checkout: `/checkout/courses/[course]`, `/checkout/orders/[order]`
- Student: `/student`, `/student/courses`, `/student/courses/[course]`, `/student/batches`, `/student/batches/[batch]`, `/student/mentors`, `/student/invoices`, `/student/invoices/[order]`, `/student/profile`

## Risks

- API response shapes must be confirmed from OpenAPI and the Laravel serializers.
- PDF proxying depends on authenticated binary responses from Laravel.
- Some public page sections may need small backend content adjustments if the database is missing expected CMS records.

## Verification

- `pnpm api:types`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
