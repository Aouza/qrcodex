# TASK-023 — Add category active toggle

**Epic:** Category Administration
**Status:** READY
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
- [ ] An authorized admin can activate and deactivate an owned category from the list.
- [ ] Deactivation hides the category and its products publicly without deleting data.
- [ ] Unknown and cross-tenant IDs cannot be changed.
- [ ] The control is accessible and works at 320px and desktop widths.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
