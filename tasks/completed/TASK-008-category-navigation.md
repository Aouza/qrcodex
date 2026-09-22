# TASK-008 — Build category navigation

**Epic:** Public Menu  
**Status:** DONE  
**Dependencies:** TASK-007

## Objective
Let customers quickly reach each active category from the public menu, especially on narrow mobile screens.

## Requirements
- Use the ordered categories returned by the public menu loader; do not hardcode names or IDs.
- Add a horizontally scrollable, touch-friendly category navigation at mobile widths and a suitable desktop layout.
- Use the compact category-rail rhythm shown in `docs/refs/`, adapted to the documented dark Relica's palette. Use text labels; category imagery/icons are not available in the data model.
- Give each category a stable page target so navigation moves to the matching section.
- Keep navigation keyboard-accessible and avoid horizontal page overflow at 320px.
- Do not implement product cards, search or featured/unavailable states in this task.
- Do not add ordering, cart or bottom-app navigation from the references; those are outside this MVP.

## Acceptance criteria
- [x] Every visible category can be reached from the navigation in the loader's order.
- [x] The selected link reaches the matching section on mobile and desktop.
- [x] Keyboard and touch use remain comfortable at 320px without page-level horizontal overflow.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added an ordered, sticky, horizontally scrollable category rail with native anchor links. Each category has a database-ID-based section target, visible target state and keyboard focus styling. The rail uses 48px mobile touch targets and 56px desktop targets. Documented the pattern in `docs/DESIGN_SYSTEM.md`.
- Checks run: Lint, typecheck and build passed. Browser checks at 320px and 1280px confirmed category order, target links, section visibility and no page-level horizontal overflow. Tab navigation showed visible focus. The sticky rail remained visible while scrolling.
- Acceptance criteria result: All criteria satisfied.
- Follow-up/risks: TASK-009 will render real products in these sections. The current development seed has categories but no products, so the sections are intentionally empty. Lint reports one non-failing warning in the unrelated `src/lib/supabase/server.ts` change.
- Visual refinement: Tightened the brand header and empty category bands, updated the menu palette and type hierarchy, and added a selected state to the category rail. The page stays text-led until approved product content and imagery are available.
