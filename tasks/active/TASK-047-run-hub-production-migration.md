# TASK-047 — Run Hub production migration

**Epic:** Bar Hub Foundation
**Status:** READY
**Dependencies:** TASK-046

## Objective
Close the Hub migration on the current shared production host without coupling it to the future custom-domain cutover or permanent QR generation.

## Requirements
- Verify `/relicas` as the current production Hub and `/relicas/cardapio` as its menu destination.
- Smoke test public Hub/menu navigation, direct menu access, core menu interaction and the protected admin entry.
- Confirm the migration needs no destructive database operation.
- Synchronize release documentation with the current shared-host state.
- Keep `relicas.com.br`, canonical root routing and the permanent QR explicitly deferred until domain acquisition and DNS verification.

## Acceptance criteria
- [ ] Current production Hub and menu routes respond and render expected identity/content.
- [ ] Hub/menu navigation, direct access, menu search and an admin authentication boundary pass smoke testing.
- [ ] No destructive database migration is required or applied.
- [ ] Documentation distinguishes the live shared-host release from future custom-domain cutover.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
