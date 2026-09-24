# TASK-044 — Add focused public Hub data loader

**Epic:** Bar Hub Foundation
**Status:** DONE
**Dependencies:** TASK-043

## Objective
Load only the public establishment information required by the Hub instead of fetching the complete menu catalog.

## Requirements
- Resolve an active establishment through the anonymous public client.
- Return only name, slug, logo and already-approved public contacts.
- Preserve controlled null/not-found and safe error behavior.
- Keep admin sessions from changing public visibility.
- Do not add custom-domain resolution yet.

## Acceptance criteria
- [x] `/[slug]` performs no category or product query.
- [x] Inactive or unknown establishments return no Hub data.
- [x] The loader uses the cookie-free anonymous Supabase client.
- [x] Focused tests cover successful, missing and failed reads where practical.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Added a cookie-free public Hub loader restricted to the active establishment's identity and approved contacts.
- Removed category and product queries from `/[slug]` while preserving null/not-found and safe error behavior.
- Added focused successful, missing and failure result tests.
- Deployed and smoke-tested `/relicas` in production.
- Checks: 33 unit tests, `npm run lint`, `npm run typecheck`, `npm run build`.
