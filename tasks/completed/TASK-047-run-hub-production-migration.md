# TASK-047 — Run Hub production migration

**Epic:** Bar Hub Foundation
**Status:** DONE
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
- [x] Current production Hub and menu routes respond and render expected identity/content.
- [x] Hub/menu navigation, direct access, menu search and an admin authentication boundary pass smoke testing.
- [x] No destructive database migration is required or applied.
- [x] Documentation distinguishes the live shared-host release from future custom-domain cutover.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Verified the live shared-host Hub and direct menu routes over HTTPS after deployment `dpl_Evq5g6Y33Npfy5v7ADGWrga37nHT` reached `READY`.
- Production smoke testing covered Hub/menu navigation, browser Back, direct menu rendering, a Heineken search returning three expected products, zero captured console errors and unauthenticated `/admin` redirection to `/admin/login`.
- Confirmed this routing/UI release required no database migration or destructive data operation.
- Updated `docs/DEPLOYMENT.md` with the live release evidence and retained custom-domain cutover plus permanent QR generation as explicitly blocked future operations.
- Checks: `node --test tests/*.test.mjs` (33 passed), `npm run lint`, `npm run typecheck`, `npm run build`, and Vercel production build.
