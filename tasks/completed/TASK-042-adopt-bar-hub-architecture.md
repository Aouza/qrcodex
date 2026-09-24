# TASK-042 — Adopt Bar Hub product architecture

**Epic:** Bar Hub Foundation
**Status:** DONE
**Dependencies:** TASK-027, TASK-033

## Objective
Make the Bar Hub evolution the official product direction and synchronize the durable project documentation and backlog without changing runtime behavior.

## Acceptance criteria
- [x] `docs/PRD.md` defines the Hub as the permanent QR destination and the menu as its primary module.
- [x] Temporary shared-host and future custom-domain routes are documented separately.
- [x] Architecture, design, deployment and decision docs preserve existing menu/admin/security contracts.
- [x] Agenda and Music are sequenced as separate phases, with Music requiring abuse design before public writes.
- [x] New roadmap tasks have IDs that do not collide with completed project history.
- [x] Domain acquisition blocks only custom-domain cutover and permanent QR generation.
- [x] Documentation checks pass.

## Completion notes
- Promoted the Bar Hub direction into the canonical PRD, architecture and agent instructions.
- Documented shared-host routes for immediate development and clean custom-domain routes for the later cutover.
- Added the Hub design contract, deployment guardrails, planned domain data note and ADR-016.
- Renumbered the official Hub, Agenda and Music roadmap as TASK-042 through TASK-058 without rewriting historical task IDs.
- Check: `git diff --check`.
