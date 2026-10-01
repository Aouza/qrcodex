# TASK-053 — Design Music lifecycle, security and abuse controls

**Epic:** Music Requests
**Status:** DONE
**Dependencies:** TASK-052

## Objective
Define the smallest production release using the existing TASK-061 queue/player, without restarting the POC or assuming its manual success criteria passed.

## Acceptance criteria
- [x] Canonical production contract defines FIFO lifecycle, TV/customer/Admin responsibilities and terminal admin statuses.
- [x] Device pairing/revocation, lease/playback fencing, offline recovery and narrow server/database boundaries are specified.
- [x] Persistent abuse limits, direct-RPC bypass closure, idempotency, quota and server-authoritative video metadata are specified.
- [x] Privacy/retention, commercial-review gate, staged release and safe rollback are specified.
- [x] PRD voting/aggregation conflict is reconciled and architecture/database/decision references distinguish design from executable migrations.
- [x] TASK-054 through TASK-058 reference the contract rather than duplicating it.

## Completion notes
2026-09-30: user authorized advancing toward production after reporting working playback and Safari usage. Created `docs/MUSIC_PRODUCTION.md`; existing POC code/migrations are preserved. TASK-061 remains pending full manual evidence, not SUCCESS/DONE. Initial configurable operating limits are design defaults requiring shared-Wi-Fi verification. No code, deployment, remote schema or live configuration changes belong to this task. Next task: TASK-054, READY. Documentation links/status/whitespace checked; runtime lint/typecheck/build are not applicable to documentation-only changes and remain mandatory for implementation tasks.
