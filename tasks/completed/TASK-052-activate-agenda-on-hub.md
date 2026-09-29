# TASK-052 - Activate Agenda on Hub

**Epic:** Agenda
**Status:** DONE
**Dependencies:** TASK-049, TASK-050

## Objective
Expose the public Agenda from the establishment Hub now that the public route and admin CRUD are implemented.

## Requirements
- Add Agenda as a secondary Hub destination only when there is eligible public Agenda content.
- Keep Cardapio as the dominant primary Hub destination.
- Do not expose Music or any future-module placeholder.
- Preserve direct access to `/{slug}/agenda`.
- Keep the Hub lightweight, public and unauthenticated.

## Acceptance criteria
- [x] Hub displays an Agenda destination for an active establishment with at least one upcoming or ongoing published event with media.
- [x] Hub does not display Agenda when there are no eligible public events.
- [x] Cardapio remains the primary one-tap destination.
- [x] Agenda destination works from 320 px with accessible focus and touch behavior.
- [x] No Music placeholder, ordering/payment affordance or unavailable module appears.
- [x] Focused tests plus lint, typecheck, tests and build pass.

## Completion notes
- Added a lightweight Agenda availability read to `loadPublicHub`, preserving the Hub's focused establishment payload and avoiding full Agenda composition.
- Extended the Hub resolver with `hasPublicAgenda`, including tests for eligible upcoming events, hidden past/missing-media events and safe failures.
- Added a secondary Agenda destination on the Hub only when `hasPublicAgenda` is true; Cardapio remains the primary full-width destination and no Music/future placeholder appears.
- Synchronized `docs/ARCHITECTURE.md` with the conditional Agenda exposure rule.
- Checks run: `node --test tests/load-public-hub.test.mjs`, `node --test tests/*.test.mjs`, `npm run lint`, `npm run typecheck`, `npm run build`.
- Follow-up: TASK-053 can start Music lifecycle/security design after this task is complete.
