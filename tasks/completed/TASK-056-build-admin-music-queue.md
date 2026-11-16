# TASK-056 — Build admin Music queue

**Epic:** Music Requests
**Status:** DONE
**Dependencies:** TASK-054, TASK-055

## Objective
Implement the minimal Admin checkpoint in [MUSIC_PRODUCTION.md](../../docs/MUSIC_PRODUCTION.md) using the existing authenticated shell and tenant access layer.

## Acceptance criteria
- [x] Show current track and FIFO queued requests with live/offline TV status.
- [x] Pair/revoke/replace TV and expose Music enabled, requests ON/OFF, skip-current and remove-queued operations only.
- [x] Every mutation independently resolves membership and uses narrow tenant-checked RPCs; no direct queue UPDATE.
- [x] Concurrent/stale skip/remove and cross-tenant access fail safely; old playback events cannot advance a replacement track.
- [x] SSR/mobile-style/accessibility, regression/security tests, lint/typecheck/build and documentation pass. Actual browser/manual validation belongs to TASK-058.

No votes, reorder, blacklist or general moderation system. TV remains playback-only.

## Completion notes
2026-09-30: added existing-shell `/admin/music`, navigation, membership-only snapshot migration `00006`, safe loader and independently authorized action dispatcher. Native confirmations, pending/double-click guard, one-time ten-minute pairing display, settings, skip/remove and explicit revoke/replace remain admin-only. Empty Realtime wakes and visibility-aware 20-second recovery re-read server state, never trust broadcast data. Snapshot hides history/private identifiers and is denied to anonymous and TV service roles.

PASS: 91 application/action/security/SSR/style tests, isolated SQL `014`/`015`, eight concurrent skips/removals with one transition, stale ENDED after skip, distinct visitors on shared Wi-Fi, built-server HTTP feature ON/OFF, lint, typecheck, build. Auth/Realtime are fixtures; actual admin mobile/browser/TV acceptance is pending TASK-058. No production migrations, configuration, deployment or Hub activation. Next: TASK-057 adversarial audit.

TASK-055 handoff: compatible public/player application and four production migrations are local and checked, not remotely applied. Use existing `music_admin_*` RPCs and authenticated tenant resolution for operations; do not expose server device/visitor signing secrets or bypass the lifecycle. Pairing UI will make the implemented native TV setup usable without SQL fixtures. Actual hosted/manual/release approval remains TASK-058.
