# TASK-054 — Add Music production schema and RLS

**Epic:** Music Requests
**Status:** DONE
**Dependencies:** TASK-053

## Objective
Implement the database/security checkpoint in [MUSIC_PRODUCTION.md](../../docs/MUSIC_PRODUCTION.md), extending the existing queue migrations additively.

## Checkpoints
- [x] Confirm current schema/history and reuse POC queue/indexes without dropping data.
- [x] Add default-OFF tenant settings, device pairing/session digests, lease/playback fencing and terminal skip/cancel statuses.
- [x] Add narrow membership-checked admin RPCs and service-only session/lease/lifecycle/admission RPCs with explicit grants and fixed search paths.
- [x] Revoke legacy public admission bypass; add persistent rate/quota/idempotency boundaries and retention support.
- [x] Test RLS/grants, cross-tenant/current-generation checks, concurrent admission/claims/events, revocation and offline recovery in isolated SQL fixtures.
- [x] Run tests/lint/typecheck/build; synchronize database documentation. Review app compatibility before any remote migration application.

No production migration execution or customer activation is authorized by merely starting this task. Next: TASK-055.

## Completion notes
2026-09-30, `feat/music-production`: added migrations `20260930000002`/`00003`/`00004`, preserving existing request IDs/statuses and FIFO/one-playing indexes. Default-OFF settings; private hashed pairing/devices, fenced leases, receipts, rate configuration/events and separate zero-budget search/video quota buckets are protected by RLS and explicit grants. Admin RPCs enforce exactly one current membership; technical/admission/cleanup RPCs are service-only. Browser and service legacy POC execution/direct queue writes are revoked in the NEW migrations, not in the currently deployed POC.

Atomic admission uses lock-time timestamps, live/readiness/settings/capacity checks, rolling visitor/network limits and visitor retry identity. Refresh fences old heartbeats/events even for the same request. Admin skip/remove/disable/revoke emits only empty instruction signals; offline/timeout preserves playing state. Cleanup supports 30-day metadata/receipt and 24-hour rate retention; scheduling and trusted upstream metadata/visitor/network verification belong to TASK-055.

Checks PASS: isolated PostgreSQL baseline and `014_music_production.sql`; eight concurrent production claims, idempotent admissions, duplicate ENDED, queue capacity and quota reservations; old IDs/status preservation; 62 application tests; lint; typecheck; build; diff whitespace. Auth/Realtime are modeled SQL fixtures, not hosted playback proof. Read-only production inspection confirmed queue/boundary and recorded versions `20260930000000`/`00001`; no remote write/deploy occurred.

Compatibility gate: do NOT apply these migrations alone. The existing POC app intentionally loses RPC access under the new grants. TASK-055 must integrate the production endpoints and disable hosted legacy setup/mutation routes; TASK-058 owns reviewed migration/deploy approval and activation. No Hub link, UI or fallback was added. Next task TASK-055 is READY.
