# TASK-034 — Refine unavailable product state

**Epic:** Public Menu Experience
**Status:** DONE
**Dependencies:** TASK-008

## Objective
Make unavailable products read visually as disabled without hiding them or weakening the explicit `Esgotado` status.

## Acceptance criteria
- [x] Unavailable product names, prices and descriptions use subdued neutral colors.
- [x] Unavailable images have reduced visual emphasis.
- [x] The `Esgotado` label remains explicit and readable.
- [x] Available products are visually unchanged.
- [x] The public list remains legible at 320 px and desktop widths.
- [x] Lint, typecheck and build pass.

## Completion notes
- Applied muted neutral colors to unavailable names, prices and descriptions.
- Reduced image opacity and saturation while preserving the explicit `Esgotado` badge.
- Documented the visual convention and verified it against an available neighboring product in production.
- Checks: `npm run lint`, `npm run typecheck`, `npm run build`.
