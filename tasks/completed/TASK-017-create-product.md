# TASK-017 — Add create-product flow with validation

**Epic:** Product Administration
**Status:** DONE
**Dependencies:** TASK-016

## Objective
Allow an authorized administrator to create a product for the server-resolved establishment through a mobile-friendly validated form.

## Requirements
- Add `/admin/products/new` inside the protected admin shell.
- Provide fields for name, optional description, price, category, availability, featured state and active state.
- Validate form input at the server boundary with Zod and return useful field/form feedback.
- Parse the displayed BRL price into integer `price_cents`; never persist floating-point money.
- Resolve authorization and `establishment_id` on the server for every submission.
- Verify the selected category belongs to the resolved establishment before insertion; retain the composite database foreign key and RLS as final safeguards.
- Redirect to the product list after success and show the created product there.
- Do not implement image upload, editing, quick availability mutation or deletion yet.

## Acceptance criteria
- [x] An authorized admin can create a valid product in one of the resolved establishment's categories.
- [x] Required, malformed and invalid price/category values produce safe validation feedback without inserting a product.
- [x] The form never accepts or submits an `establishment_id` from the browser.
- [x] A category from another establishment cannot be used.
- [x] Money is persisted as integer cents and rendered correctly after creation.
- [x] The created product appears in the admin list and public menu when active.
- [x] Unauthenticated or unauthorized submissions create no data.
- [x] The form works at 320px and desktop widths without overflow or overlap.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added `/admin/products/new`, a responsive accessible form, Zod boundary validation, integer-only BRL parsing, independent server authorization, tenant/category verification and an RLS-protected insert. Successful creation revalidates both admin and public views, redirects to the list and displays confirmation.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (14 passing), `npm run build`, `git diff --check`, user-completed authenticated form submission, and browser verification of the resulting public product.
- Acceptance criteria result: All criteria passed. The real product `Interstelar` was stored in `Cervejas`, rendered publicly as `R$ 32,90` with its description and neutral no-image fallback, confirming cents conversion, category linkage and public revalidation.
- Follow-up/risks: TASK-018 adds product editing using the same authorization, validation and category ownership rules. Product image upload remains deferred to TASK-021.
