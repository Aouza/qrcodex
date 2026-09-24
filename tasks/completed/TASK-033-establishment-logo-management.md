# TASK-033 — Add establishment logo management

**Epic:** Establishment & Release
**Status:** DONE
**Dependencies:** TASK-004, TASK-015, TASK-025

## Objective
Display the Relica's logo above the public establishment name and let authorized administrators replace or remove the persisted logo safely.

## Requirements
- Use `public/images/logo/relicas-logo.jpg` as the scoped Relica's fallback when `logo_url` is null.
- Display the effective logo above the establishment name in the public header.
- Add upload, replacement and removal controls to the protected establishment settings page.
- Store uploaded logos in a public Supabase Storage bucket with tenant-protected writes.
- Accept JPEG, PNG and WebP up to 768 KB.
- Resolve establishment ownership server-side and never accept an establishment ID from the browser.
- Removing a persisted Relica's logo restores the local fallback.

## Acceptance criteria
- [x] The local Relica's logo appears above the public name when no persisted logo exists.
- [x] An authorized administrator can upload, replace and remove the establishment logo.
- [x] Storage writes are isolated by membership and RLS.
- [x] Invalid files receive safe feedback and no orphaned replacement remains after a failed update.
- [x] Other establishments never inherit the Relica's fallback.
- [x] Public and admin layouts work at 320 px and desktop widths.
- [x] Tests, lint, typecheck and build pass.

## Completion notes
- Added the Relica's local logo as a slug-scoped fallback and positioned the effective establishment logo above the public menu title.
- Added protected admin upload, replacement and removal controls with JPEG, PNG and WebP validation up to 768 KB.
- Added the public `establishment-images` bucket, membership-scoped Storage policies and rollback behavior that avoids orphaned replacements.
- Synchronized PRD, architecture, database, design system and decision documentation.
- Applied migration `20260924000000_establishment_logo_storage.sql` and passed `010_establishment_logo_storage.sql` against Supabase.
- Verified the production public header visually after deployment.
- Checks: `node --test tests/*.test.mjs` (30 passed), `npm run lint`, `npm run typecheck`, `npm run build`.
