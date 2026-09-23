# TASK-024 — Add category reordering

**Epic:** Category Administration
**Status:** DONE
**Dependencies:** TASK-022

## Objective
Allow an authorized administrator to reorder categories and immediately reflect that order in the public menu.

## Requirements
- Provide efficient accessible move-up/move-down controls in the category list.
- Persist contiguous positions for every category in the server-resolved establishment.
- Validate the submitted category and direction server-side and never accept tenant ownership from the browser.
- Prevent crossing tenant boundaries or reordering unknown categories.
- Disable impossible first/last moves and expose pending/failure feedback.
- Revalidate admin and public routes after success.

## Acceptance criteria
- [x] Categories can be moved up and down and retain their order after refresh.
- [x] Public category navigation/sections use the updated order.
- [x] Positions remain contiguous and scoped to one establishment.
- [x] Unknown/cross-tenant IDs cannot be reordered.
- [x] Controls are accessible and usable at 320px and desktop widths.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Implementation summary: Added accessible move controls and an atomic Postgres function that locks tenant rows, swaps neighbors and normalizes positions.
- Checks run: lint, typecheck, 22 unit tests, production build, and `supabase/tests/008_reorder_categories.sql` against the configured project.
- Acceptance criteria result: All criteria pass, including contiguous positions and explicit cross-tenant denial.
- Follow-up/risks: None within this task; drag-and-drop was intentionally avoided in favor of reliable accessible controls.
