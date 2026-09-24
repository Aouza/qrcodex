# Database & Security

This document is the intended schema contract. Migrations are the executable source of truth once created. Keep both synchronized.

The initial executable schema is `supabase/migrations/20260921000000_initial_schema.sql`. UUID primary keys default to `gen_random_uuid()`. Timestamp columns default to `now()`, and a trigger refreshes `updated_at` on changes. RLS is enabled on all four tables from creation. `supabase/migrations/20260921000001_rls_tenant_authorization.sql` defines the grants and policies.

Both migrations were applied to the configured Supabase database and recorded as versions `20260921000000` and `20260921000001` in Supabase's migration history. Apply future schema changes through versioned migrations to keep remote history synchronized.

After applying the migrations to a development Supabase database, run `supabase/tests/003_schema_integrity.sql` and `supabase/tests/004_rls_tenant_authorization.sql` with `psql -v ON_ERROR_STOP=1 -f`. Both tests wrap sample data in a transaction and roll it back. The RLS test requires a privileged database connection to create auth fixtures and switch into `anon` and `authenticated` roles.

## establishments
- `id uuid primary key`
- `name text not null`
- `slug text not null unique`
- `logo_url text null`
- `instagram text null`
- `whatsapp text null`
- `active boolean not null default true`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

The Bar Hub custom-domain phase may add nullable unique `custom_domain` through a future versioned migration. It is not part of the current executable schema. Host values must be normalized, mapped server-side only to active establishments and tested for uniqueness and unknown-host fail-closed behavior before custom-domain routing is activated.

## establishment_users
- `id uuid primary key`
- `establishment_id uuid not null references establishments(id)`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `role text not null default 'owner' check (role = 'owner')` — additional roles require a later migration
- unique `(establishment_id, user_id)`

## categories
- `id uuid primary key`
- `establishment_id uuid not null references establishments(id)`
- `name text not null`
- `slug text not null`
- `image_url text null`
- `position integer not null default 0`
- `active boolean not null default true`
- timestamps
- unique `(establishment_id, slug)`
- unique `(id, establishment_id)` to support the tenant-safe product foreign key

## products
- `id uuid primary key`
- `establishment_id uuid not null references establishments(id)`
- `category_id uuid not null`
- composite foreign key `(category_id, establishment_id)` references `categories(id, establishment_id)`
- `name text not null`
- `description text null`
- `price_cents integer not null check (price_cents >= 0)`
- `image_url text null`
- `available boolean not null default true`
- `featured boolean not null default false`
- `active boolean not null default true`
- `position integer not null default 0`
- timestamps

`price_cents` is intentional: never store currency as float.

## Referential rule
The database must prevent assigning a product to a category from another establishment. The composite foreign key above enforces this invariant even when application validation is bypassed. Keep the composite relationship in the migration; a foreign key on `category_id` alone is insufficient.

## RLS intent
RLS is mandatory.

### Public
Anonymous users may read only:
- active establishments;
- active categories belonging to active establishments;
- active products belonging to active establishments/categories.

Availability does not restrict public visibility; unavailable active products remain readable.

Only `SELECT` is granted to `anon` on establishments, categories and products. Anonymous users cannot read `establishment_users` or write to these tables. Public product visibility checks both the active category and active establishment, including when the product itself is active.

### Authenticated admins
A user may mutate/read admin data only for establishments linked to their `auth.uid()` in `establishment_users`. `authenticated` has `SELECT`, `INSERT`, `UPDATE` and `DELETE` grants on the four tables, but each operation is restricted by tenant RLS. This includes membership rows: an existing member may manage membership only within that establishment; a client cannot create membership in an unrelated establishment. Initial membership provisioning therefore requires a trusted administrative path.

Creating an Auth user manually does not create an `establishment_users` row. After the identity exists, its initial membership must be provisioned from a trusted database/admin context. Login alone never establishes tenant authorization.

For the initial development administrator, run the parameterized bootstrap script after creating the Auth user. It fails unless the email and establishment slug each resolve exactly once and never stores those values in the repository:

```powershell
psql $env:DATABASE_URL -X -v ON_ERROR_STOP=1 `
  -v admin_email='admin@example.com' `
  -v establishment_slug='relicas' `
  -f supabase/bootstrap/014_initial_admin_membership.sql
```

Run this only from a trusted terminal with the direct database connection. It is bootstrap administration, not an application endpoint or public sign-up flow.

The policies call `private.is_establishment_member(uuid)`, a `SECURITY DEFINER` function with an empty search path. It checks only the caller's `auth.uid()` and bypasses RLS on `establishment_users`, avoiding recursive membership policies. Keep `private` out of the API's exposed schemas. Authenticated table reads are membership-scoped, including active public records of other establishments; a public menu for another tenant must use the anonymous read path.

Never trust an `establishment_id` supplied by the browser without authorization enforcement.

`public.reorder_category(tenant_id, category_id, direction)` is an authenticated, security-invoker function used for atomic category ordering. It verifies membership, locks only the selected tenant's category rows and rewrites positions as a contiguous zero-based sequence. Cross-tenant or boundary moves return false. Verify it with `supabase/tests/008_reorder_categories.sql`.

An authenticated user may have multiple rows in `establishment_users`. For the MVP, an admin with exactly one membership operates in that establishment automatically. Every admin operation must resolve and verify membership on the server, and RLS must enforce tenant isolation. If a user has multiple memberships, do not choose one implicitly; establishment selection is a future capability, so the MVP must fail closed with a controlled response.

## Storage intent
`supabase/migrations/20260922000000_product_image_storage.sql` creates the public `product-images` bucket with a 768 KB limit and JPEG, PNG and WebP MIME allowlist. Public delivery is intentional because product photos are customer-facing menu content; upload, update and deletion remain protected by RLS. The limit leaves room for the multipart request envelope within the default Server Action request limit and encourages menu-optimized images.

Object paths use `<establishment_id>/<product_id>/<random-id>.<extension>`. Storage policies parse those first two folders and require both current establishment membership and a matching product row. Application actions independently resolve the same tenant/product before invoking Storage, so paths or ownership are never accepted from browser input.

Replacement uploads a versioned object, updates `products.image_url`, then removes the previous owned object. Failures attempt rollback so an old image remains usable. Removal nulls `image_url` and removes the object, restoring the public neutral fallback. Product deletion removes its owned image before deleting the row because Storage policy ownership depends on that row. Run `supabase/tests/006_product_image_storage.sql` after the migration to verify bucket settings and cross-tenant Storage isolation.

`supabase/migrations/20260923000000_category_image_storage.sql` adds nullable `categories.image_url` and the public `category-images` bucket with the same 768 KB JPEG/PNG/WebP contract. Object paths use `<establishment_id>/<category_id>/<version>.<extension>`. Storage writes require both server-resolved membership and a matching category owned by that establishment. Persisted media takes precedence over local category artwork; null retains the scoped local or neutral fallback. Run `supabase/tests/007_category_image_storage.sql` to verify the schema, bucket and cross-tenant policy boundary.

`supabase/migrations/20260924000000_establishment_logo_storage.sql` creates the public `establishment-images` bucket with the same 768 KB JPEG/PNG/WebP contract. Logo paths use `<establishment_id>/logo/<version>.<extension>`, and Storage policies require membership in that path's establishment. Application actions resolve the establishment server-side before upload, replacement or removal. Run `supabase/tests/010_establishment_logo_storage.sql` to verify the bucket, path shape and cross-tenant isolation.

## Seed intent
`supabase/seed.sql` contains development data only: one Relica's establishment and the nine ordered categories from `docs/PRD.md`. It creates no products or prices. The establishment and categories have fixed IDs, and inserts use `ON CONFLICT (id) DO NOTHING`, so repeat runs do not duplicate records or overwrite later admin edits. This file is not a migration and must not be applied to production or a database whose purpose is unknown.

The seed was applied to the current Supabase project after it was designated as the development environment. Keep production in a separate Supabase project and apply only approved production content there.

After applying the versioned migrations to a confirmed development database, set `DATABASE_URL` in your shell and run `psql $env:DATABASE_URL -X -v ON_ERROR_STOP=1 -f supabase/seed.sql` from PowerShell at the repository root. Run `psql $env:DATABASE_URL -X -v ON_ERROR_STOP=1 -f supabase/tests/005_development_seed.sql` to check creation and idempotence without persisting test data; the test ends with `ROLLBACK`. Keep the connection string out of commits and shell history.

## Approved menu content
`supabase/content/relicas_establishment.sql` is the approved production bootstrap for the Relica's establishment and its nine categories. It deliberately contains no Auth identities or memberships. Apply it after all versioned migrations and before the menu products.

`supabase/content/relicas_menu.sql` transcribes the 91 products and prices shown on both sides of the approved printed menu in `docs/cardapio/`. IDs are deterministic from category and product name, and `ON CONFLICT (id) DO NOTHING` makes reruns additive without overwriting later admin edits. Product photography remains null because the printed illustrations are not item-specific approved media. Run `supabase/tests/009_relicas_menu_content.sql` to verify count, representative prices, tenant integrity and idempotence before applying the content script.
