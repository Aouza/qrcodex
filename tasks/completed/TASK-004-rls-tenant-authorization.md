# TASK-004 — Implement RLS policies and tenant authorization

**Epic:** Foundation  
**Status:** DONE  
**Dependencies:** TASK-003

## Objective
Make public menu reads and administrator access follow the tenant rules in `docs/DATABASE.md`.

## Requirements
- Add a versioned migration for explicit grants and RLS policies on establishments, establishment_users, categories and products.
- Anonymous users may read only active establishments, active categories in active establishments, and active products in active categories and establishments. Available and unavailable active products remain visible.
- Authenticated administrators may read and mutate only records belonging to establishments linked to their `auth.uid()` through `establishment_users`.
- Prevent client-supplied `establishment_id` from granting access to a different tenant. Avoid recursive policies on `establishment_users`.
- Keep multi-establishment selection UI out of scope. Prepare server-side membership resolution for one-establishment users only if needed by this task; do not build login or admin UI.
- Add SQL checks for allowed and denied reads/writes by anonymous and authenticated roles, including cross-tenant attempts.
- Keep `docs/DATABASE.md` synchronized with the policies and grants.

## Acceptance criteria
- [x] Policies and grants apply successfully to the configured Supabase database.
- [x] Public visibility rules match `docs/DATABASE.md`, including unavailable products remaining readable.
- [x] Cross-tenant admin reads and writes are denied by RLS.
- [x] Tests verify allowed and denied access for relevant operations and roles.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a versioned migration with explicit grants, public-read policies, membership-scoped admin policies and a private security-definer membership check that avoids recursive RLS. Added transactional SQL tests for anonymous visibility and allowed/denied authenticated operations across tenants.
- Checks run: Migration and test passed together in a rolled-back rehearsal. Applied migration `20260921000001` to the configured Supabase database with the CLI; both SQL tests passed afterward, and migration history records the version. `npm run lint`, `npm run typecheck` and `npm run build` passed.
- Acceptance criteria result: All criteria satisfied.
- Follow-up/risks: Initial membership provisioning requires a trusted administrative path. Public reads for an authenticated user visiting an unrelated tenant must use the anonymous access path, because authenticated table reads are membership-scoped. Multi-establishment selection remains outside the MVP.
