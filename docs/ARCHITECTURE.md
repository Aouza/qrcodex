# Architecture

## Goals
Keep the MVP simple, secure, mobile-first and ready for a second establishment without prematurely building a SaaS platform.

## Stack
This is the target stack. Add dependencies only when the active backlog task needs them; documented future dependencies do not belong in the bootstrap by default.

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase: Postgres + Auth + Storage
- Zod
- React Hook Form where client form state benefits from it
- Vercel

## Rendering/data strategy
- Prefer Server Components for initial public/admin data reads.
- Use Client Components only for interactive behavior such as category scrolling, search UI, toggles, drag/reorder and forms where needed.
- Mutations should execute on the server boundary and validate input with Zod.
- Revalidate/invalidate affected views after mutations so admin changes become visible predictably.

## Route plan
Public:
- `/[slug]` — public menu for an establishment

Admin:
- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/settings`

Exact route grouping may use App Router route groups without changing public URLs.

## Suggested source organization
```text
src/
  app/
  components/
    menu/
    admin/
    ui/
  lib/
    supabase/
    validation/
    auth/
  types/
supabase/
  migrations/
  seed.sql
```

Do not create abstractions before they have a concrete use.

## Tenant boundary
All tenant-owned records use `establishment_id`. Admin authorization must derive accessible establishments from the authenticated user, not from arbitrary client input.

`establishment_users` supports multiple establishments per user. In the MVP, a user with exactly one membership uses that establishment automatically. Every admin operation resolves and verifies membership server-side, with RLS enforcing tenant isolation. Multiple-membership selection UI is out of scope; do not silently select an establishment when more than one membership exists.

Product/category tenant integrity is enforced in Postgres with a unique `(id, establishment_id)` constraint on categories and a composite foreign key from products `(category_id, establishment_id)` to categories `(id, establishment_id)`.

## Supabase clients
`src/lib/supabase/client.ts` creates the browser client and `src/lib/supabase/server.ts` creates a request-scoped server client with cookie access. `src/lib/supabase/public.ts` creates a cookie-free anonymous server client for public menu reads, so an admin session cannot narrow visibility on another establishment's public route. All three use the publishable key, so RLS applies to their queries. No privileged Supabase client is part of the MVP foundation. Configure the Next.js Proxy for session refresh before implementing protected admin authentication; the browser/server clients alone do not refresh cookies from Server Components.

## Public menu data
`src/lib/menu/load-public-menu.ts` resolves an active establishment by slug and returns active categories with their active products in position/ID order. The anonymous RLS policies also enforce active parent records. Unavailable products remain in the result; visual treatment follows in the public-menu tasks.

## Images
Product images live in Supabase Storage. Store paths/URLs in the product record according to the storage implementation chosen in the relevant task. Images are optional and should be optimized in delivery.

The public product list uses `next/image` with a remote pattern limited to the configured Supabase Storage origin (`/storage/v1/object/**`). If the storage task adopts a different delivery URL, update that pattern alongside the storage contract. The establishment logo still uses its existing unrestricted URL path until settings/storage define its source.

## Error handling
Expected validation/auth failures should produce user-friendly UI. Unexpected failures should not expose secrets or raw database errors to users.

## Testing strategy
Minimum MVP checks:
- lint;
- TypeScript typecheck;
- unit tests for important pure validation/business logic when introduced;
- targeted component/integration tests for critical flows where practical;
- manual mobile smoke test for the MVP acceptance scenario.

Do not introduce a heavy testing stack before a task needs it; when test tooling is added, document the command here.
