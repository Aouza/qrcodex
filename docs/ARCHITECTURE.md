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
`src/lib/supabase/client.ts` creates the browser client and `src/lib/supabase/server.ts` creates a request-scoped server client with cookie access. `src/lib/supabase/public.ts` creates a cookie-free anonymous server client for public menu reads, so an admin session cannot narrow visibility on another establishment's public route. All three use the publishable key, so RLS applies to their queries. No privileged Supabase client is part of the MVP foundation.

`src/proxy.ts` runs only on `/admin/:path*`, refreshes expired sessions and performs an optimistic redirect to `/admin/login` when no signed claim is available. The public menu stays outside this Proxy. Proxy is not an authorization boundary: protected Server Components and every future admin mutation must call the server-only access layer, which validates the user with Supabase Auth, derives membership from `establishment_users` and relies on RLS as the final tenant boundary. The browser never chooses the resolved `establishment_id`.

`src/lib/auth/get-admin-access.ts` permits tenant data only when the authenticated user has exactly one membership. Zero memberships produce an access-not-configured state; multiple memberships produce a future-selection state without selecting either tenant. Multi-establishment selection remains outside the MVP.

Protected admin pages live under the URL-neutral `src/app/admin/(protected)` route group. Its shared layout calls `getAdminAccess` before rendering the dashboard shell, so the dashboard and all management destinations inherit the same server-side session and membership boundary. The shell provides navigation only; each later mutation must still perform its own membership check.

### Development administrator bootstrap
The MVP has no public sign-up. For development, create the initial administrator manually in Supabase Dashboard through `Authentication > Users > Create new user`, with an email and password. Do not add a secret/service-role key to the application for this bootstrap.

The Auth user and its establishment membership are separate records. After the user exists, provision its initial `establishment_users` row from a trusted database/admin context with `supabase/bootstrap/014_initial_admin_membership.sql`. Custom SMTP and email-invitation onboarding are future capabilities because new Free-tier Supabase projects do not support customizing Auth email templates with the default SMTP provider.

## Public menu data
`src/lib/menu/load-public-menu.ts` resolves an active establishment by slug and returns active categories with their active products in position/ID order. The anonymous RLS policies also enforce active parent records. Featured items are selected from those visible category products and repeated in a compact section while remaining in their category lists. Unavailable active products remain visible with an `Esgotado` label in both contexts.

The server page passes this public, active-only menu data to `MenuCatalog`, a Client Component that filters in memory by normalized product name or description. Search makes no new Supabase request. The category navigation and featured area derive from the same filtered categories, so status and grouping remain consistent; an empty query restores the original data.

## Images
Product images live in Supabase Storage. Store paths/URLs in the product record according to the storage implementation chosen in the relevant task. Images are optional and should be optimized in delivery.

When `products.image_url` is null, the public list displays the local neutral `public/images/categories/generic.webp` thumbnail as an empty state. This does not write a fallback URL to the product record and is replaced automatically by a real product image.

The public product list uses `next/image` with a remote pattern limited to the configured Supabase Storage origin (`/storage/v1/object/**`). If the storage task adopts a different delivery URL, update that pattern alongside the storage contract. The establishment logo still uses its existing unrestricted URL path until settings/storage define its source.

The Relica's menu shell currently uses the optimized local `public/images/menu-editorial.webp` as a temporary, explicitly illustrative hero. It is scoped to the `relicas` slug so another tenant never inherits Relica's imagery. A future establishment setting can replace it with approved media; do not add a Storage field or uploader until that task. `tests/fixtures/images/fries.webp` is a development-only image fixture for responsive product-list checks, not public menu data and not an automatic product fallback.

Category navigation prefers nullable `categories.image_url` media from the public `category-images` bucket. When null, it uses optimized local illustrations in `public/images/categories/` for Relica's initial category slugs; a neutral image covers new categories and other establishments. Category names and ordering remain database-driven. Upload, replacement and removal resolve the tenant server-side and use paths containing the establishment and category IDs.

## Error handling
Expected validation/auth failures should produce user-friendly UI. Unexpected failures should not expose secrets or raw database errors to users.

`src/app/[slug]/loading.tsx` renders a route-level skeleton while the server resolves the establishment and menu. `src/app/[slug]/error.tsx` catches menu-load failures and offers `reset()` without rendering the underlying error. `MenuCatalog` distinguishes no categories, no products across all categories, an individual empty category, and search with no matches. These states do not require database writes or a public account.

## Testing strategy
Minimum MVP checks:
- lint;
- TypeScript typecheck;
- unit tests for important pure validation/business logic when introduced;
- targeted component/integration tests for critical flows where practical;
- manual mobile smoke test for the MVP acceptance scenario.

Do not introduce a heavy testing stack before a task needs it; when test tooling is added, document the command here.

The public-menu featured selection and search filtering have focused tests in `tests/get-featured-products.test.mjs` and `tests/filter-menu-categories.test.mjs`. Membership cardinality is covered by `tests/resolve-membership.test.mjs`. Run them with `node --test tests/*.test.mjs` on the workspace Node 24 runtime.

The admin product page resolves authorization again in its server-only loader, explicitly scopes category and product reads to the resolved establishment, and hands the safe result to a Client Component for in-memory name search and category filtering. It accepts no tenant identifier from the browser. Filter behavior is covered by `tests/filter-admin-products.test.mjs`.

Product creation uses a Server Action under `/admin/products/new`. The action resolves admin access independently, validates the form with Zod, parses the textual BRL amount into integer cents, verifies the selected active category against both its ID and the resolved establishment, and inserts with the server-derived `establishment_id`. It then revalidates the admin list and public menu. Money parsing and boundary validation are covered by `tests/product-validation.test.mjs`.

Product editing reuses the same form and validation contract at `/admin/products/[id]`. Both its loader and bound Server Action scope the product by `id` plus the server-resolved `establishment_id`; unknown and cross-tenant IDs expose no product data. The update repeats active-category ownership validation and revalidates admin and public views.

The product list exposes availability as a dedicated Server Action rather than requiring the full edit form. It binds the requested next state, resolves authorization again, updates only `available` with both product and resolved-establishment filters, and reports success only after the database confirms a row. Admin and public paths are revalidated after the mutation.

Product removal distinguishes reversible deactivation from permanent deletion. The edit form changes `active` through the existing tenant-scoped update; inactive products remain in admin reads but disappear from the anonymous public query. Permanent deletion is a separate Server Action that reloads the product under the resolved tenant and accepts only an explicit confirmation submitted by the named-product dialog before issuing a tenant-scoped delete.

Category ordering uses the atomic `reorder_category` database function. The function verifies membership, locks the tenant's category rows, swaps the requested neighbor and normalizes every position to a contiguous zero-based sequence. The Server Action supplies only the server-resolved tenant and revalidates both admin and public paths.
