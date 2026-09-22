# TASK-014 — Protect admin routes and resolve current establishment

**Epic:** Authentication & Admin Shell
**Status:** DONE
**Dependencies:** TASK-013

## Objective
Protect administrative routes and derive the current establishment exclusively from the authenticated user's server-verified memberships.

## Bootstrap context
- The initial development administrator is created manually through Supabase Authentication → Users → Create new user.
- Provision the corresponding `establishment_users` row from a trusted database/admin context after the Auth user exists.
- Do not add public sign-up, `/admin/convite`, custom SMTP or invitation-email handling in this task.
- Email invitations and managed onboarding are future capabilities.

## Requirements
- Require a verified Supabase Auth session for protected `/admin` routes while keeping `/admin/login` public.
- Resolve memberships server-side from `establishment_users`; never trust an `establishment_id` supplied by the client.
- Automatically select the establishment only when exactly one membership exists.
- Fail closed with a controlled state when the user has zero or multiple memberships.
- Keep multi-establishment selection UI out of the MVP.
- Verify membership again in every administrative server mutation; route protection is not sufficient authorization.
- Keep RLS enabled and mandatory as the final tenant-isolation boundary.
- Redirect unauthenticated users to `/admin/login` without affecting the anonymous public menu.

## Acceptance criteria
- [x] An unauthenticated request to a protected admin route redirects to `/admin/login`.
- [x] A user with exactly one membership resolves only that establishment on the server.
- [x] A user with no membership receives no tenant data and sees a controlled access-not-configured state.
- [x] A user with multiple memberships receives no tenant data and sees a controlled future-selection state.
- [x] Client-supplied establishment IDs cannot change the resolved tenant.
- [x] RLS tests continue to prove cross-tenant reads and writes are denied.
- [x] Public menu routes remain anonymous and unaffected.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added optimistic unauthenticated redirects in the admin Proxy and a server-only access layer that verifies the Auth user, derives up to two memberships from `establishment_users`, authorizes exactly one establishment and returns controlled zero/multiple/error states. Added the protected `/admin` access state, a parameterized trusted bootstrap script and provisioned the initial Relica's owner membership for the existing Auth account.
- Checks run: `node --test tests/*.test.mjs` (7 passing), `npm run lint`, `npm run typecheck`, `npm run build`, `supabase/tests/004_rls_tenant_authorization.sql` against the configured Supabase project, and an in-browser unauthenticated `/admin` redirect check.
- Acceptance criteria result: All criteria passed. Tenant resolution has no client-provided establishment input; the live bootstrap resolved one membership, pure tests cover zero/one/multiple cardinality, and RLS continued to deny cross-tenant reads and writes.
- Follow-up/risks: Every admin mutation introduced by later tasks must call the server access layer and retain tenant-scoped RLS. Multi-establishment selection, email invitations and custom SMTP remain future capabilities.
