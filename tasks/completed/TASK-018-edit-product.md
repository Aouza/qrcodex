# TASK-018 — Add edit-product flow

**Epic:** Product Administration
**Status:** DONE
**Dependencies:** TASK-017

## Objective
Allow an authorized administrator to open and update an existing product belonging to the server-resolved establishment.

## Requirements
- Add an edit destination at `/admin/products/[id]` and link product rows to it.
- Load the product and active categories only after resolving authorization server-side.
- Pre-fill name, description, BRL price, category, availability, featured state and active state.
- Reuse the create-product validation and integer-cent money rules where practical.
- Resolve both `establishment_id` and the target product server-side; do not trust tenant or product ownership claims from form data.
- Verify a selected category belongs to the resolved establishment before update.
- Revalidate the admin list and public menu after success.
- Handle unknown or cross-tenant product IDs without exposing data.
- Do not implement image upload, fast availability mutation or deletion yet.

## Acceptance criteria
- [x] An authorized admin can open and update a product from the list.
- [x] Existing values are pre-filled and valid changes persist correctly.
- [x] Malformed values produce safe field feedback without partial updates.
- [x] Cross-tenant or unknown product IDs expose no product data and cannot be updated.
- [x] Price remains integer cents and renders correctly after update.
- [x] Category changes remain limited to the resolved establishment.
- [x] Admin and public views reflect a successful active-product update.
- [x] The edit form works at 320px and desktop widths without overflow or overlap.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added linked edit actions to product rows, a protected `/admin/products/[id]` route, tenant-scoped product/category loading, a shared pre-filled create/edit form and a bound update Server Action. Unknown or cross-tenant product IDs render the same not-found state; updates repeat category ownership checks and tenant-scoped RLS writes.
- Checks run: `node --test tests/*.test.mjs` (15 passing), `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`, unauthenticated dynamic-route redirect check, user-completed authenticated edit, and public-menu refresh after the update.
- Acceptance criteria result: All criteria passed. Stored cents are pre-filled through tested integer formatting, the real product was edited successfully, and its public rendering remained correct after revalidation.
- Follow-up/risks: TASK-019 adds a dedicated availability action to the product list. Image upload remains deferred to TASK-021.
