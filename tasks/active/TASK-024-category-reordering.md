# TASK-024 — Add category reordering

**Epic:** Category Administration
**Status:** READY
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
- [ ] Categories can be moved up and down and retain their order after refresh.
- [ ] Public category navigation/sections use the updated order.
- [ ] Positions remain contiguous and scoped to one establishment.
- [ ] Unknown/cross-tenant IDs cannot be reordered.
- [ ] Controls are accessible and usable at 320px and desktop widths.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
