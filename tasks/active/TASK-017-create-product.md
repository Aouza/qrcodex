# TASK-017 — Add create-product flow with validation

**Epic:** Product Administration
**Status:** IN_PROGRESS
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
- [ ] An authorized admin can create a valid product in one of the resolved establishment's categories.
- [ ] Required, malformed and invalid price/category values produce safe validation feedback without inserting a product.
- [ ] The form never accepts or submits an `establishment_id` from the browser.
- [ ] A category from another establishment cannot be used.
- [ ] Money is persisted as integer cents and rendered correctly after creation.
- [ ] The created product appears in the admin list and public menu when active.
- [ ] Unauthenticated or unauthorized submissions create no data.
- [ ] The form works at 320px and desktop widths without overflow or overlap.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
