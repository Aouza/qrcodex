# TASK-019 — Add fast availability toggle

**Epic:** Product Administration
**Status:** DONE
**Dependencies:** TASK-018

## Objective
Let an authorized administrator change a product's availability directly from the product list with clear feedback and minimal steps.

## Requirements
- Add an accessible availability control to each product row without requiring the edit form.
- Execute the mutation in a Server Action that independently resolves admin access.
- Scope the update by product ID and the server-resolved `establishment_id`; never accept tenant ownership from the browser.
- Preserve the product's active state and all other fields.
- Revalidate both the admin product list and public menu after success.
- Keep unavailable active products public with the existing `Esgotado` state.
- Show pending and failure feedback without optimistic misinformation.
- Do not implement product deactivate/delete or image upload yet.

## Acceptance criteria
- [x] An authorized admin can mark a product unavailable and available from the list.
- [x] The control exposes its state with text, not color alone, and is keyboard accessible.
- [x] The pending state prevents duplicate submissions.
- [x] Unknown or cross-tenant product IDs cannot be changed.
- [x] No product field other than `available` changes.
- [x] The public menu reflects `Esgotado` after refresh and restores availability when toggled back.
- [x] The list remains usable at 320px and desktop widths without overflow.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a compact semantic availability switch to every product row, backed by an independently authorized Server Action that updates only `available` under product-and-tenant scope. The control exposes textual state, disables duplicate submissions, reports server success/failure and revalidates admin and public routes.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (15 passing), `npm run build`, `git diff --check`, authenticated switch smoke test and public-menu refresh.
- Acceptance criteria result: All criteria passed. `Interstelar Double` remained visible publicly and rendered the explicit `Esgotado` state after the list switch was used.
- Follow-up/risks: TASK-020 handles active/deactivate and delete semantics separately from operational availability. Product image upload remains deferred to TASK-021.
