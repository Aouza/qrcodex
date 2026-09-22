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

The policies call `private.is_establishment_member(uuid)`, a `SECURITY DEFINER` function with an empty search path. It checks only the caller's `auth.uid()` and bypasses RLS on `establishment_users`, avoiding recursive membership policies. Keep `private` out of the API's exposed schemas. Authenticated table reads are membership-scoped, including active public records of other establishments; a public menu for another tenant must use the anonymous read path.

Never trust an `establishment_id` supplied by the browser without authorization enforcement.

An authenticated user may have multiple rows in `establishment_users`. For the MVP, an admin with exactly one membership operates in that establishment automatically. Every admin operation must resolve and verify membership on the server, and RLS must enforce tenant isolation. If a user has multiple memberships, do not choose one implicitly; establishment selection is a future capability, so the MVP must fail closed with a controlled response.

## Storage intent
Use a product-images bucket. Upload/update/delete policies must be tenant-aware. Public delivery strategy can be public bucket or signed access; choose the simplest secure option during the storage task and record the decision in `DECISIONS.md`.

## Seed intent
`supabase/seed.sql` contains development data only: one Relica's establishment and the nine ordered categories from `docs/PRD.md`. It creates no products or prices. The establishment and categories have fixed IDs, and inserts use `ON CONFLICT (id) DO NOTHING`, so repeat runs do not duplicate records or overwrite later admin edits. This file is not a migration and must not be applied to production or a database whose purpose is unknown.

The seed was applied to the current Supabase project after it was designated as the development environment. Keep production in a separate Supabase project and apply only approved production content there.

After applying the versioned migrations to a confirmed development database, set `DATABASE_URL` in your shell and run `psql $env:DATABASE_URL -X -v ON_ERROR_STOP=1 -f supabase/seed.sql` from PowerShell at the repository root. Run `psql $env:DATABASE_URL -X -v ON_ERROR_STOP=1 -f supabase/tests/005_development_seed.sql` to check creation and idempotence without persisting test data; the test ends with `ROLLBACK`. Keep the connection string out of commits and shell history.
