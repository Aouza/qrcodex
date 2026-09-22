# TASK-005 — Add Relica's development seed data

**Epic:** Foundation  
**Status:** DONE  
**Dependencies:** TASK-003, TASK-004

## Objective
Provide repeatable development data for the first establishment and its initial categories without hardcoding them in the UI.

## Requirements
- Add seed data for one Relica's establishment and the category set in `docs/PRD.md`, preserving an explicit display order.
- Keep seed data development-only; do not modify approved production content or infer real prices from photographs.
- Make repeated seed runs safe and document how to run them against a development database.
- Respect the tenant schema and RLS setup. Do not introduce application dependencies or build public/admin UI in this task.

## Acceptance criteria
- [x] Seed runs successfully against the schema with TASK-004 policies applied.
- [x] Re-running it does not duplicate the establishment or categories.
- [x] All seeded categories belong to Relica's and have stable ordering.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added `supabase/seed.sql` with one establishment and nine ordered categories. Fixed IDs and conflict-safe inserts make repeated runs idempotent without overwriting later edits. Added a transactional SQL test and documented manual development-only use.
- Checks run: Executed `supabase/tests/005_development_seed.sql` against the configured Supabase schema after TASK-004; the transactional test confirmed initial creation, idempotence and preservation of an edited category. After the user confirmed the project is the development environment, applied the seed persistently in one transaction: 1 establishment and 9 categories. A second run inserted 0 rows; category order and anonymous visibility were verified. `npm run lint`, `npm run typecheck` and `npm run build` passed during implementation.
- Acceptance criteria result: All implementation and verification criteria satisfied.
- Follow-up/risks: The current Supabase project is used for development. Create a separate production project before launch and do not run this development seed against production.
