# TASK-046 — Integrate Hub and menu navigation

**Epic:** Bar Hub Foundation
**Status:** DONE
**Dependencies:** TASK-045

## Objective
Connect the public menu clearly to its establishment Hub without weakening direct QR/deep-link access or browser navigation.

## Requirements
- Add a visible, compact path from the menu back to the establishment Hub.
- Preserve direct access to `/{slug}/cardapio` without forced redirects.
- Preserve natural browser back behavior and existing menu anchors/search interactions.
- Follow the public design system and work from 320 px through desktop.

## Acceptance criteria
- [x] A customer can return from the menu to `/{slug}` in one explicit action.
- [x] Direct menu URLs continue to render without visiting the Hub first.
- [x] Browser back remains natural and no redirect loop is introduced.
- [x] The control has accessible naming, focus and touch behavior.
- [x] Production smoke testing covers Hub to menu, menu to Hub and direct menu access.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Added a compact `Início` link to the menu header, pointing explicitly to the establishment Hub without a redirect or client-side history override.
- Kept direct menu rendering independent and aligned the loading skeleton with the new header structure.
- Production smoke testing at 320 px covered Hub to menu, menu to Hub, direct menu access and browser Back; the control measured 44 px high and the page had no horizontal overflow.
- Checks: `node --test tests/*.test.mjs` (33 passed), `npm run lint`, `npm run typecheck`, `npm run build`, and Vercel production build.
