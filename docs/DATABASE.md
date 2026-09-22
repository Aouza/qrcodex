# Database & Security

This document is the intended schema contract. Migrations are the executable source of truth once created. Keep both synchronized.

The initial executable schema is `supabase/migrations/20260921000000_initial_schema.sql`. UUID primary keys default to `gen_random_uuid()`. Timestamp columns default to `now()`, and a trigger refreshes `updated_at` on changes. RLS is enabled on all four tables from creation; access policies and grants are defined in TASK-004.

The initial migration was applied to the configured Supabase database and recorded as version `20260921000000` in Supabase's migration history. Apply future schema changes through versioned migrations to keep remote history synchronized.

After applying the migration to a development Supabase database, run `supabase/tests/003_schema_integrity.sql` with `psql -v ON_ERROR_STOP=1 -f` against that database. The test wraps its sample data in a transaction and rolls it back.

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

### Authenticated admins
A user may mutate/read admin data only for establishments linked to their `auth.uid()` in `establishment_users`.

Never trust an `establishment_id` supplied by the browser without authorization enforcement.

An authenticated user may have multiple rows in `establishment_users`. For the MVP, an admin with exactly one membership operates in that establishment automatically. Every admin operation must resolve and verify membership on the server, and RLS must enforce tenant isolation. If a user has multiple memberships, do not choose one implicitly; establishment selection is a future capability, so the MVP must fail closed with a controlled response.

## Storage intent
Use a product-images bucket. Upload/update/delete policies must be tenant-aware. Public delivery strategy can be public bucket or signed access; choose the simplest secure option during the storage task and record the decision in `DECISIONS.md`.

## Seed intent
Development seed should create one Relica's establishment plus the initial category set. Product seed data may be minimal; do not treat photographed menu prices as canonical unless explicitly entered/approved during implementation.
