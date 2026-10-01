# TASK-058 — Activate Music on Hub

**Epic:** Music Requests
**Status:** IN_PROGRESS
**Dependencies:** TASK-057

## Objective
Execute Preview/manual/release gates in [MUSIC_PRODUCTION.md](../../docs/MUSIC_PRODUCTION.md), then activate only the approved establishment.

## Acceptance criteria
- [ ] Vercel Preview environment/secrets, HTTPS cookie/origin behavior and deliberate database target are verified.
- [ ] Record complete two-phone/TV FIFO, non-interruption, ENDED/ERROR/WAITING, refresh, admin, offline and multi-hour acceptance evidence.
- [ ] YouTube policy/commercial venue-rights review, privacy/terms and actual quota budget are approved/documented.
- [ ] Confirm migration history, backup/restore readiness, cleanup schedule, sanitized monitoring and rollback runbook.
- [ ] Obtain explicit approval for production migrations/deploy/tenant activation; never replay POC migrations blindly.
- [ ] Add membership-safe configuration-driven Music Hub availability; Relica's only on first release, all others OFF.
- [ ] Verify Cardapio/Agenda/admin regressions and final checks; record release result rather than assuming a successful deployment.

Disabling/rollback must not restore insecure POC endpoints or drop queue/history data. No fallback/default music.

## Handoff / next checkpoint
Owner-approved short pairing: eight unambiguous characters grouped XXXX-XXXX; tenant-bound, single-use, ten-minute expiry and existing durable attempt limits. Additive migration 00007 applied atomically after fresh encrypted backup/isolated restore PASS; verified unchanged queue/devices/leases and grants, no pairing code issued by tooling. SQL/concurrency, built HTTP short-code redemption, 96 tests/lint/typecheck/build PASS. Existing ten-minute legacy codes remain accepted during rollout. Commit/deploy authorized; keep READY_FOR_MANUAL_VALIDATION, not DONE. Search error investigation: recent production API had 503 responses without diagnostic details; current reproduction returns offline (no Google call), requiring actual TV readiness before rechecking search.

Owner feedback visual fix: Music admin now uses the existing light admin palette (white cards, dark text, neutral borders and gold keyboard focus), not the public/TV dark tokens. No queue, authorization or operational behavior changed. A CSS regression test protects the palette; physical owner validation remains pending.

Owner feedback fix: paused/offline customer UI now disables search, result selection and request submission (including handler guards); explicit backend disabled/offline responses clear stale selection and keep controls closed until reload. Privacy remains available. New SSR regression assertions PASS with all 94 tests; no queue/database mutation. Await deployed correction and continue manual pairing/playback validation, not DONE.

READY_FOR_MANUAL_VALIDATION — user explicitly authorized Production and Music in Relica's Hub for today's owner rehearsal (not public-launch acceptance). Production deployment `dpl_GFrrHcAzswVZEwdskRgLtmq2K5Sn`, app commit `bca4967`, alias https://qrcodex-eight.vercel.app. Independent Production signing key and stable origin configured. Tenant enabled through trusted first-release bootstrap; others OFF, existing quota usage not reset. App caps 80 searches/day and 100 metadata calls/day reflect observed Google limits (100 search/day, 10,000 general/day). Public HTTP PASS: Hub Music link, Menu/Agenda/customer/player 200, secure consent cookie, unauthenticated player 401, wrong origin 403, POC 404 and cleanup 401. No music requests, fake lease or Google calls created by smoke checks. 94 tests/lint/typecheck/build PASS. Pairing and actual multi-phone/TV/ENDED/ERROR/refresh/endurance are still manual. No main merge, commercial acceptance, POC SUCCESS or DONE; prior no-Production/no-Hub notes below are historical.

Feature branch published: `61b28cb`, no main merge/push. Protected compatible Preview READY: https://qrcodex-qlcaq2qzw-startrapalhoes.vercel.app. Six branch-only variables configured; Production Vercel environment unchanged. Hosted HTTP: privacy 200, unauthenticated player 401, legacy POC search 404. CLI automation bypass remains server-side; no token output/browser exposure.

Backup: ignored `.release-backups/music-2026-09-30T23-30-16.547Z.dump.dpapi` and manifest. DPAPI CurrentUser hash/encryption roundtrip and isolated full scoped restore PASS; includes public/private/migration history and ACLs, excludes Auth credentials/sessions and Storage files. Provider schemas mocked for rehearsal; requires this Windows user/profile. Not full-platform disaster recovery.

Authorized atomic rollout applied versions `20260930000002`–`00006` plus Supabase Cron after Preview/backup verification. Existing three IDs/statuses/timestamps preserved, one-playing invariant healthy. One owner-only hourly job; real worker succeeded during controlled temporary minute cadence and final hourly restoration verified. No fixtures in production, queue activation or Google API calls.

Checks: local SQL boundaries/concurrency/cron contract, 93 tests, built HTTP smoke, lint/typecheck/build PASS. No secrets/backups/.claude committed. Local tooling: guarded rollout, deployment inspector, real Cron verifier.

Next blocker: actual Google search/video quotas and bounded rehearsal budgets must be reviewed before configuring persistent limits. Module/admission remain OFF. Then admin pairing and full physical TV/two-phone, FIFO/non-interruption/ENDED/ERROR/WAITING/refresh/offline/endurance evidence. Confirm ongoing Cron monitoring owner/alerts. Commercial/privacy review and explicit public tenant/Hub activation remain pending. No Production app deploy, paid upgrade or destructive restore; not DONE or POC SUCCESS.
