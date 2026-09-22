# TASK-011 — Add client-side menu search

**Epic:** Public Menu
**Status:** READY
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
- [ ] Typing filters visible products by name or description without a page reload.
- [ ] Matching is case-insensitive and works across categories.
- [ ] Clearing the query restores the full menu and featured section.
- [ ] Unavailable matches retain `Esgotado`; no results have an explicit empty state.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
