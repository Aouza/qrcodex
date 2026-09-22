# TASK-003 — Create initial database schema migration

**Epic:** Foundation  
**Status:** DONE  
**Dependencies:** TASK-002

## Objective
Create the first executable Postgres migration for the tables defined in `docs/DATABASE.md`.

## Requirements
- Create establishments, establishment_users, categories and products with their documented columns, defaults and constraints.
- Enforce category tenant integrity in the database: unique `(id, establishment_id)` on categories and a composite foreign key from products `(category_id, establishment_id)`.
- Preserve integer-cent prices and nonnegative price checks.
- Add indexes needed for documented foreign keys, slugs and ordering where appropriate.
- Keep `docs/DATABASE.md` synchronized with the executable migration.
- Do not implement RLS policies or seed data; those belong to TASK-004 and TASK-005.

## Acceptance criteria
- [x] The migration applies successfully to a clean Supabase Postgres database.
- [x] A product cannot reference a category from another establishment.
- [x] Documented uniqueness, foreign keys and price checks are enforced.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added the initial schema migration for establishments, memberships, categories and products. It includes the composite category/product tenant foreign key, UUID and timestamp defaults, update triggers, indexes and RLS enablement without policies. Added a transactional SQL integrity check.
- Checks run: Applied the migration to an isolated PostgreSQL 18 cluster with a minimal `auth.users` stub, then to the configured clean Supabase database in a single transaction. `supabase/tests/003_schema_integrity.sql` passed against both databases, covering tenant isolation, price and slug constraints, establishment foreign keys and RLS enablement. `npm run lint`, `npm run typecheck` and `npm run build` passed with `.env.local` present.
- Acceptance criteria result: All criteria satisfied. The Supabase migration history now records version `20260921000000`, and `supabase migration list` shows the local and remote versions match.
- Follow-up/risks: RLS policies and grants belong to TASK-004. The temporary PostgreSQL test cluster was stopped and removed.
