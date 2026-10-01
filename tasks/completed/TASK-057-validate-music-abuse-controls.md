# TASK-057 — Validate Music abuse controls

**Epic:** Music Requests
**Status:** DONE
**Dependencies:** TASK-055, TASK-056

## Objective
Verify the integrated production contract in [MUSIC_PRODUCTION.md](../../docs/MUSIC_PRODUCTION.md) before public activation.

## Acceptance criteria
- [x] Prove tested local RPC/legacy POC/table bypass denial, cross-tenant isolation and server metadata/status authority.
- [x] Exercise persistent visitor/network/tenant/project limits, quota exhaustion, pairing brute force, spoofed proxy headers and concurrent idempotent retry.
- [x] Exercise simulated TV instances/devices, old same-request generation, lease loss, revocation, session expiry and admin skip/remove while playing.
- [x] Verify simulated independent phone visitors on shared Wi-Fi, consent/retention and no private/secret payload exposure. Physical phones/actual provider logs remain TASK-058.
- [x] Record SQL/application tests, lint/typecheck/build and release findings; fail closed on unresolved tested security regressions.

Use isolated fixtures, not destructive samples in the production database. TASK-058 owns hosted manual acceptance and activation.

## Completion notes
2026-09-30: local review and evidence matrix in `docs/experiments/MUSIC_PRODUCTION_SECURITY_REVIEW.md`; release approvals/procedure in `docs/MUSIC_RELEASE_RUNBOOK.md`. Hardened tenant-bound TV cookie signatures to reject forgeries before RPC dispatch (DB still validates expiry/revocation/generations), exact JSON MIME and five-second stalled-reader cancellation. No extra TV/admin capabilities or persistent identities added.

PASS: 93 application/action/security/terminal/SSR/style cases; isolated SQL `014`/`015` and eight concurrent claims/admissions/quota/admin skip/remove with exact-one transition; stale ENDED after skip; separate visitors sharing a network; built-server HTTP ON/OFF including signed unknown-token rejection, cookie attributes, consent/metadata/receipts, pairing, cleanup and legacy closure; lint; typecheck; build; whitespace and browser-bundle secret-identifier scan.

No tested tenant/lifecycle bypass remains. This is not a hosted security audit or physical-device acceptance: actual Proxy/provider headers, Realtime, Web Locks/autoplay/320px/mobile controls, endurance, operational scheduling/monitoring, commercial/privacy review and quota approvals remain TASK-058. No production changes/deployment. Next READY TASK-058 requires explicit Preview/target/release authority; public Music remains OFF.
