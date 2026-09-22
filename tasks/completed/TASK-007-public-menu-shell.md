# TASK-007 — Build public menu shell/header and visual tokens

**Epic:** Public Menu  
**Status:** DONE  
**Dependencies:** TASK-006

## Objective
Give the public menu its mobile-first visual foundation and establishment header, using the data already loaded by `/[slug]`.

## Requirements
- Define central visual tokens consistent with `docs/DESIGN_SYSTEM.md` and document the chosen values there.
- Replace the temporary route counts with a responsive public-menu shell and establishment identity/header.
- Support an absent logo gracefully and keep the page usable at 320px width and on weak connections.
- Keep category navigation, product cards, search and featured/unavailable visual states for their later tasks.

## Acceptance criteria
- [x] The route renders a polished establishment header and menu structure on mobile and desktop.
- [x] The page remains usable at 320px and with no logo.
- [x] Visual tokens are centralized and `docs/DESIGN_SYSTEM.md` is updated.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Replaced the temporary counts with a dark, mobile-first establishment header and static category index. The header renders a provided logo in a stable footprint or a typographic initial when absent. Centralized the menu palette in `src/app/globals.css` and documented it in `docs/DESIGN_SYSTEM.md`.
- Checks run: `npm run lint`, `npm run typecheck` and `npm run build` passed. Browser checks at 320px, 390px, 768px and desktop found no horizontal overflow; 320px and desktop screenshots were inspected. The seeded Relica's route rendered with no logo and nine categories.
- Acceptance criteria result: All criteria satisfied.
- Follow-up/risks: Category navigation, product rendering and states remain in later tasks. No real logo or venue photograph is available yet. Lint still reports one non-failing warning from the separate `src/lib/supabase/server.ts` change, which was left untouched.
