# TASK-016 — Build admin product list and category filtering

**Epic:** Product Administration
**Status:** DONE
**Dependencies:** TASK-015

## Objective
Replace the products pending state with a compact, mobile-friendly list of products belonging to the server-resolved establishment, with search and category filtering for repeated administrative use.

## Requirements
- Load products and categories only for the establishment returned by `getAdminAccess`.
- Keep RLS as the final tenant boundary and never accept an `establishment_id` from the browser.
- Show product name, category, formatted price, availability and active state in a scan-friendly list.
- Add client-side search by product name and a category filter without reloading the page.
- Provide clear loading, empty and no-results states.
- Preserve the existing responsive admin shell and public menu behavior.
- Do not implement create, edit, availability mutations, delete/deactivate or image upload yet.

## Acceptance criteria
- [x] An authorized admin sees only products from the resolved establishment.
- [x] Product rows expose the information needed to identify and compare items quickly.
- [x] Search and category filtering work together and can be cleared.
- [x] Empty catalog and no-filter-results states are distinct and useful.
- [x] The list works at 320px and desktop widths without horizontal page overflow.
- [x] Unauthenticated or unauthorized users receive no product data.
- [x] The public menu remains unaffected.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Replaced the products placeholder with a server-only tenant-scoped loader, compact responsive product rows, formatted BRL prices, textual availability/activity states, client-side name search and category filtering, plus loading, empty, no-results and failure states. No tenant ID or product data is sourced from the browser.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (10 passing), and `npm run build`; authenticated browser confirmation of the real empty-catalog state.
- Acceptance criteria result: All criteria passed. Filter composition, accent-insensitive search and clearing behavior are covered by focused tests; the live authenticated page returned only the current tenant's empty catalog.
- Follow-up/risks: TASK-017 adds the first product and will make populated-row and filter behavior available for live browser smoke testing. Every create mutation must resolve authorization server-side and write the resolved `establishment_id` rather than accepting one from form data.
