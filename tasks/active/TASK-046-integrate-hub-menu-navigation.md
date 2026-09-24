# TASK-046 — Integrate Hub and menu navigation

**Epic:** Bar Hub Foundation
**Status:** READY
**Dependencies:** TASK-045

## Objective
Connect the public menu clearly to its establishment Hub without weakening direct QR/deep-link access or browser navigation.

## Requirements
- Add a visible, compact path from the menu back to the establishment Hub.
- Preserve direct access to `/{slug}/cardapio` without forced redirects.
- Preserve natural browser back behavior and existing menu anchors/search interactions.
- Follow the public design system and work from 320 px through desktop.

## Acceptance criteria
- [ ] A customer can return from the menu to `/{slug}` in one explicit action.
- [ ] Direct menu URLs continue to render without visiting the Hub first.
- [ ] Browser back remains natural and no redirect loop is introduced.
- [ ] The control has accessible naming, focus and touch behavior.
- [ ] Production smoke testing covers Hub to menu, menu to Hub and direct menu access.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
