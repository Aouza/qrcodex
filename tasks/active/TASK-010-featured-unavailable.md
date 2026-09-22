# TASK-010 — Add featured and unavailable states

**Epic:** Public Menu  
**Status:** READY  
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
- [ ] Only real active featured products appear in the featured area.
- [ ] Active unavailable products remain visible and are clearly labeled `Esgotado`.
- [ ] No product appears to be directly orderable through the interface.
- [ ] Mobile and desktop layouts remain readable, with category navigation intact.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
