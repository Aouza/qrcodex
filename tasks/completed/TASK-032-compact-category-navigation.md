# TASK-032 — Compact public category navigation

**Epic:** Public Menu
**Status:** DONE
**Dependencies:** TASK-008, TASK-022

## Objective
Increase category density on mobile while preserving recognizable imagery, comfortable touch targets and the active-category behavior.

## Requirements
- Use `docs/cat-refs/` as density and hierarchy reference without copying its brand styling.
- Show approximately four category items in a typical mobile viewport.
- Keep the category image above its name and limit long names to two lines.
- Replace the large filled active card with a quieter, accessible active treatment.
- Preserve horizontal scrolling, sticky behavior and scroll/hash synchronization.

## Acceptance criteria
- [x] Category items are materially smaller than the previous 104 x 126 px cards.
- [x] At least four items are substantially visible at 390 px without page-level horizontal overflow.
- [x] Labels do not overlap and remain readable at 320 px.
- [x] Active, hover and keyboard-focus states remain clear.
- [x] Lint, typecheck and build pass.

## Completion notes
- Reduced category items from 104 x 126 px to 84 x 96 px and category artwork from 64 px to 56 px.
- Limited labels to two lines and replaced the full yellow active fill with an accent border, ring and label.
- Preserved sticky horizontal navigation, hash targets and scroll synchronization without component logic changes.
- Verified four visible items at 320 px, five in the available production viewport, no page overflow and no browser console errors.
- Checks run: `npm run lint`, `npm run typecheck`, `npm run build`, responsive browser inspection at 320 px and production smoke test.
