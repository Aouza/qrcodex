# TASK-044 — Add focused public Hub data loader

**Epic:** Bar Hub Foundation
**Status:** READY
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
- [ ] `/[slug]` performs no category or product query.
- [ ] Inactive or unknown establishments return no Hub data.
- [ ] The loader uses the cookie-free anonymous Supabase client.
- [ ] Focused tests cover successful, missing and failed reads where practical.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
