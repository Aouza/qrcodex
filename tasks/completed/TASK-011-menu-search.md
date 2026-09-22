# TASK-011 — Add client-side menu search

**Epic:** Public Menu
**Status:** DONE
**Dependencies:** TASK-009

## Objective
Help customers find visible products quickly by name or description without reloading the menu.

## Requirements
- Search only active products already returned by the public menu loader.
- Match product name and description case-insensitively.
- Preserve category grouping, featured and unavailable presentation while searching.
- Provide a clear input and a way to reset the query.
- Show a useful no-results state without suggesting missing products are unavailable.
- Keep category navigation and the 320px layout usable.

## Acceptance criteria
- [x] Typing filters visible products by name or description without a page reload.
- [x] Matching is case-insensitive and works across categories.
- [x] Clearing the query restores the full menu and featured section.
- [x] Unavailable matches retain `Esgotado`; no results have an explicit empty state.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a visible search field and reset action in a client catalog, filtering public products in memory by normalized name/description while preserving categories, featured products and `Esgotado`.
- Checks run: `node --test tests/get-featured-products.test.mjs tests/filter-menu-categories.test.mjs` (4 passed), `npm run lint` (0 errors, existing `_headers` warning), `npm run typecheck`, `npm run build`; interactive browser checks with temporary fixtures at 320px and desktop, then removed the fixture route.
- Acceptance criteria result: All five criteria passed. The real public page loaded, but the development database still has no products, so matching scenarios were verified with temporary local fixtures without database writes.
- Follow-up/risks: TASK-012 covers full-menu empty/loading/error states and further mobile polish.
