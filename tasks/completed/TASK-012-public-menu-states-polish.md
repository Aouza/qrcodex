# TASK-012 — Add loading/empty/error states and mobile polish

**Epic:** Public Menu
**Status:** DONE
**Dependencies:** TASK-010, TASK-011

## Objective
Make the public menu resilient and understandable while loading, when it has no content, and when a public data request fails.

## Requirements
- Add a loading state that preserves the page structure and avoids disruptive layout shift.
- Explain when the establishment has no active categories or a category has no active products.
- Present a customer-friendly error state with a retry action and no raw server details.
- Verify the public experience at 320px and desktop, including long names, missing images and horizontal category navigation.
- Keep the menu accessible without authentication or ordering controls.

## Acceptance criteria
- [x] Loading, empty and error states are readable and actionable where appropriate.
- [x] No raw Supabase or Next.js errors are shown to customers.
- [x] The cardápio remains usable at 320px and on desktop without overlapping content.
- [x] Category navigation, search, featured and unavailable states remain intact.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added route-level skeleton and error boundary, differentiated no categories/no products/empty category states, and expanded long category labels with a matching sticky-scroll offset.
- Checks run: `node --test tests/get-featured-products.test.mjs tests/filter-menu-categories.test.mjs` (4 passed), `npm run lint` (0 errors, existing `_headers` warning), `npm run typecheck`, `npm run build`; browser checks at 320px and desktop with temporary fixtures removed afterward; sandboxed production server confirmed skeleton then safe error message with retry button and no raw details.
- Acceptance criteria result: All five criteria passed. The real Relica's page shows the no-products state for its nine seeded categories.
- Follow-up/risks: Product content remains absent in the development database; final content-driven smoke testing will follow admin product management. The loading skeleton reserves hero space for Relica's and may be broader than another establishment's layout.
