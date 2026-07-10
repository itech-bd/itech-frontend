# iTech Frontend

Next.js frontend for the iTech education platform.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm api:types
pnpm dev
```

## Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm check`

## Architecture

- Public, auth, checkout, and student routes are localized under `/{locale}`.
- The Laravel bearer token is stored in an HTTP-only cookie owned by Next.js.
- Browser code never talks to the Laravel API directly with the token.
- Public data is server-rendered with controlled revalidation.
- Student data is fetched with `cache: "no-store"`.
