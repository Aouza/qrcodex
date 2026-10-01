# TASK-055 — Build production Music requests and TV boundary

**Epic:** Music Requests
**Status:** DONE
**Dependencies:** TASK-054

## Objective
Implement public Music and hardened TV checkpoint in [MUSIC_PRODUCTION.md](../../docs/MUSIC_PRODUCTION.md), reusing existing working POC helpers.

## Acceptance criteria
- [x] `/{slug}/musicas` supports consent, server-authoritative search/request receipts and explicit unavailable/disabled/full/offline/quota states; wrapping/48px styles target 320px.
- [x] Read-only YouTube configuration is independent of OAuth/playlist; upstream calls have bounded timeouts and persistent quota reservation.
- [x] TV pairing cookie, lease/heartbeat/generation validation, revocation/expiry, automatic lifecycle and offline recovery meet the canonical contract in local SQL/pure/HTTP fixtures.
- [x] Queue INSERT never interrupts playing; authoritative admin instructions can stop/replace playback.
- [x] Retention cleanup has authenticated hourly schedule configuration and SQL/HTTP tests; legacy hosted POC mutation/setup bypasses are disabled. Actual schedule installation/monitoring is TASK-058.
- [x] Automated security/lifecycle/SSR/mobile-style checks, lint/typecheck/build pass; no Hub activation yet. Actual browser 320px/autoplay/endurance validation remains TASK-058.

Admin pairing/operations UI follows in TASK-056; use isolated server/SQL fixtures for integration until then.

TASK-054 handoff: three production migrations are local and tested, not applied remotely. Match the RPC contract in `docs/DATABASE.md`; deploy only with compatible endpoints. Public POC admission and legacy service lifecycle execution are revoked by those migrations. Consume separate search/video quota buckets with reviewed actual costs/budgets, preserve per-tab instance and bootstrap boot nonce retry identity, and schedule `music_cleanup` before release. Existing POC remains working against the unchanged remote schema.

## Completion notes
2026-09-30, `feat/music-production`: locally implemented feature-gated public Music/privacy and paired playback terminal. Added strict bounded consent/search/request/player endpoints, configured-origin checks, signed versioned visitor cookies, random device tokens hashed by the RPC boundary and provider-trusted network HMAC. No raw credentials/token/code are placed in URLs, browser state or logs. Server-fetched public/processed/embeddable video metadata and separate persistent API reservations are independent of the POC OAuth/playlist.

TV uses per-tab Web Locks, stable instance/new boot nonce, serialized heartbeat/events, generation checks, conservative lease watchdog and opaque Realtime. Tests verify INSERT non-interruption, exact retry after lost event response, ENDED/ERROR/WAITING, refresh/stale-event fencing, offline/revoked/disabled behavior and instruction wake recovery. Initial activation remains allowed, not proof of browser autoplay acceptance.

Added migration `20260930000005` with conservative retention margins, authenticated cleanup endpoint and hourly `vercel.json` configuration. No schedule has been installed remotely. TASK-058 must confirm a compatible cron plan/alternative, monitoring and reviewed operational configuration before release. Old POC source and local development behavior are preserved; built/hosted legacy endpoints/setup are closed. Hub and admin remain unchanged. Added the requested concise/no-code-or-diff-dump rule to `AGENTS.md`.

Checks PASS: isolated PostgreSQL baseline/production assertions and eight concurrent claims/admissions/events/capacity/quota; 83 unit/security/lifecycle/SSR/style tests; built-server HTTP smoke with fake credentials and outbound-network blocking; lint; typecheck; build; whitespace check. Fixtures do not prove actual Supabase Realtime, physical TV/audio/autoplay, 320px browser rendering, multi-phone endurance or commercial/privacy permission. Those remain TASK-057/058, not a claim of POC SUCCESS.

No remote migration, live configuration change, commit/push/merge or deployment performed. Existing dirty work preserved. Next READY: TASK-056, membership-scoped admin Music and pairing/operations UI.
