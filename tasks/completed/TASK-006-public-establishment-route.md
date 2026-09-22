# TASK-006 — Create public establishment route and data loader

**Epic:** Public Menu  
**Status:** DONE  
**Dependencies:** TASK-004, TASK-005

## Objective
Resolve a public establishment by slug and load its visible menu data through the anonymous RLS path.

## Requirements
- Add the `/[slug]` App Router route and server-side loader for an active establishment, its active ordered categories and visible products.
- Respect the RLS rules from `docs/DATABASE.md`, including showing active unavailable products and hiding inactive tenants/categories/products.
- Public reads must not inherit an authenticated admin session that would hide another tenant's public menu.
- Handle unknown or inactive establishments without leaking private data.
- Do not build the final menu shell, category navigation or product presentation; those belong to later tasks.

## Acceptance criteria
- [x] An active establishment's route resolves by slug and loads only publicly visible data in deterministic order.
- [x] Unknown and inactive establishments are not exposed.
- [x] Active unavailable products remain in the loaded result.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a cookie-free anonymous Supabase client, a server-side menu loader ordered by position and ID, and the `/[slug]` route. Missing or inactive establishments return 404. The temporary page shows identity and counts; presentation follows in later tasks.
- Checks run: `/relicas` returned 200 with nine categories and an unknown slug returned 404. Temporary development fixtures confirmed that an unavailable active product remained counted and an inactive establishment returned 404; fixtures were removed. `npm run lint`, `npm run typecheck` and `npm run build` passed after the final text/config changes.
- Acceptance criteria result: All criteria satisfied.
- Follow-up/risks: Lint reports one non-failing unused-parameter warning in an unrelated, pre-existing change to `src/lib/supabase/server.ts`. Full menu presentation begins in TASK-007. The current Supabase project is development-only.
