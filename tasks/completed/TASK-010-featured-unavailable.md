# TASK-010 — Add featured and unavailable states

**Epic:** Public Menu
**Status:** DONE
**Dependencies:** TASK-009

## Objective
Make real featured products easier to discover and unavailable products unmistakable without suggesting in-app ordering.

## Requirements
- Use the `featured` and `available` values already returned by the public menu loader.
- Present a restrained featured area only when real active featured products exist; avoid duplicating promotional claims or fictional media.
- Keep featured products in their category lists and preserve the category navigation.
- Show unavailable products with the textual label `Esgotado`, adequate contrast and their name/price still readable.
- Do not add cart, plus buttons, quantities, purchase CTAs or customer accounts.
- Keep layout usable without images and at 320px.

## Acceptance criteria
- [x] Only real active featured products appear in the featured area.
- [x] Active unavailable products remain visible and are clearly labeled `Esgotado`.
- [x] No product appears to be directly orderable through the interface.
- [x] Mobile and desktop layouts remain readable, with category navigation intact.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a conditional featured section sourced only from active category products, reused product rendering in featured cards, and added textual `Esgotado` status without purchase controls.
- Checks run: `node --test tests/get-featured-products.test.mjs` (2 passed), `npm run lint` (0 errors, existing `_headers` warning), `npm run typecheck`, `npm run build`; browser smoke check at 320px and desktop with temporary local fixtures, then removed the fixture route.
- Acceptance criteria result: All five criteria passed. The real public page loaded with nine categories and no featured section because the development database currently has no products.
- Follow-up/risks: Recheck with real featured and unavailable products when entered through admin; no product fixtures were persisted to the database.
