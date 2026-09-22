# TASK-004 — Implement RLS policies and tenant authorization

**Epic:** Foundation  
**Status:** READY  
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
- [ ] Policies and grants apply successfully to the configured Supabase database.
- [ ] Public visibility rules match `docs/DATABASE.md`, including unavailable products remaining readable.
- [ ] Cross-tenant admin reads and writes are denied by RLS.
- [ ] Tests verify allowed and denied access for relevant operations and roles.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
