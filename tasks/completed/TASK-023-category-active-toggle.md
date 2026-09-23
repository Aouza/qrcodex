# TASK-023 — Add category active toggle

**Epic:** Category Administration
**Status:** DONE
**Dependencies:** TASK-022

## Objective
Allow an authorized administrator to quickly activate or deactivate a category from the category list.

## Requirements
- Add a compact switch to each category row without requiring the edit page.
- Resolve authorization independently in the Server Action and scope updates by category ID plus server-resolved establishment.
- Keep deactivation distinct from deletion; no category or product records are removed.
- Rely on existing public RLS behavior so inactive categories and their products disappear publicly.
- Revalidate admin and public routes after success.
- Show pending, success and failure states without shifting the list layout.

## Acceptance criteria
- [x] An authorized admin can activate and deactivate an owned category from the list.
- [x] Deactivation hides the category and its products publicly without deleting data.
- [x] Unknown and cross-tenant IDs cannot be changed.
- [x] The control is accessible and works at 320px and desktop widths.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Implementation summary: Added an accessible compact switch per category row backed by an independently authorized, tenant-scoped Server Action with public/admin revalidation.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (22 passing), and `npm run build`.
- Acceptance criteria result: All criteria pass through scoped update confirmation, existing category RLS/public visibility policies and responsive control styling.
- Follow-up/risks: Reordering remains isolated to TASK-024.
