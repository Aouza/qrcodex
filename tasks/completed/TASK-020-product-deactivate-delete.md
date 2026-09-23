# TASK-020 — Add product deactivate/delete flow

**Epic:** Product Administration
**Status:** DONE
**Dependencies:** TASK-018

## Objective
Allow an authorized administrator to remove a product from the public menu through reversible deactivation and, when deliberately chosen, permanently delete it.

## Requirements
- Make deactivation/reactivation the primary removal workflow and keep availability semantically separate.
- Keep inactive products visible in the admin list with an explicit state while excluding them from the public menu through existing RLS/public queries.
- Provide permanent deletion only from the product edit context with clear destructive confirmation.
- Require deliberate product identification/confirmation before permanent deletion; avoid accidental one-click deletion.
- Execute both mutations in Server Actions that independently resolve admin access and scope by product ID plus server-resolved `establishment_id`.
- Revalidate admin and public routes after success.
- Handle unknown or cross-tenant IDs without exposing or changing data.
- Do not implement image upload yet.

## Acceptance criteria
- [x] An authorized admin can deactivate and later reactivate a product.
- [x] Deactivation removes the product from the public menu but retains it in admin.
- [x] Permanent deletion requires explicit confirmation and removes the product from admin/public views.
- [x] Availability and all unrelated product fields remain unchanged during deactivate/reactivate.
- [x] Unknown or cross-tenant IDs cannot be changed or deleted.
- [x] Pending and failure states prevent duplicate/destructive ambiguity.
- [x] Controls work at 320px and desktop widths without overflow or overlap.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Kept reversible active-state management in the validated edit form and added permanent deletion below normal actions. Deletion now uses an accessible named-product confirmation dialog with cancel-first focus, pending protection and a tenant-scoped Server Action that reloads the target before deleting.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (15 passing), `npm run build`, `git diff --check`, and user visual review of the final conventional confirmation interaction.
- Acceptance criteria result: All criteria passed through the existing tenant-scoped edit/update flow, public active-only query, RLS coverage and the guarded delete path. The real product was intentionally retained rather than deleted during review.
- Follow-up/risks: TASK-021 must coordinate Storage object cleanup with product image replacement/removal. Deleting a product that later owns an image must not leave orphaned objects.
