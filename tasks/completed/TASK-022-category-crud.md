# TASK-022 — Build category list/create/edit flows

**Epic:** Category Administration
**Status:** DONE
**Dependencies:** TASK-015

## Objective
Allow an authorized administrator to list, create and edit categories belonging to the server-resolved establishment, including an optional category image used by the public navigation.

## Requirements
- Build a compact, mobile-friendly category list under `/admin/categories` with clear edit and create actions.
- Add create and edit flows with server-side validation for category name and slug.
- Resolve membership in every loader and mutation; never accept or trust `establishment_id` from the browser.
- Scope category reads and writes by category ID plus the server-resolved establishment and retain RLS enforcement.
- Preserve database-driven category identity and the existing uniqueness rules.
- Add a nullable persisted category image field and a tenant-aware Supabase Storage contract for upload, replacement and removal.
- Continue showing the existing local Relica's illustration or neutral fallback when no persisted category image exists.
- Revalidate affected admin and public routes after changes.
- Keep fast active-state controls and category reordering out of this task; they belong to TASK-023 and TASK-024.

## Acceptance criteria
- [x] An authorized admin can list categories belonging to the current establishment.
- [x] An authorized admin can create a valid category and edit its name/slug.
- [x] Validation errors are clear and invalid or duplicate values do not create partial data.
- [x] Unknown or cross-tenant category IDs cannot be viewed or changed.
- [x] An optional category image can be uploaded, replaced and removed without orphaning old objects.
- [x] A persisted category image appears in public navigation; categories without one retain the correct fallback.
- [x] Create/edit controls work at 320px and desktop widths without overflow or overlap.
- [x] Relevant Storage/RLS tests plus `npm run lint`, `npm run typecheck`, tests and `npm run build` pass.

## Completion notes
- Implementation summary: Added tenant-scoped category list/create/edit routes, Zod validation, optional persisted category media, a public Storage bucket with ownership policies, and public navigation precedence for uploaded media over scoped defaults.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (22 passing), `npm run build`, `supabase/tests/007_category_image_storage.sql`, and public menu smoke verification after refreshing the PostgREST schema cache.
- Acceptance criteria result: All criteria pass through tenant-scoped loaders/actions, RLS/Storage policy tests, responsive CSS review, validation tests and the public menu smoke check.
- Follow-up/risks: Active-state controls and ordering remain intentionally deferred to TASK-023 and TASK-024. Category media uses the same 768 KB Server Action-safe limit as product media.
