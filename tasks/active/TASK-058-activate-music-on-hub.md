# TASK-058 — Activate Music on Hub

**Epic:** Music Requests
**Status:** BLOCKED
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
Feature branch published: `61b28cb`, no main merge/push. Protected compatible Preview READY: https://qrcodex-qlcaq2qzw-startrapalhoes.vercel.app. Six branch-only variables configured; Production Vercel environment unchanged. Hosted HTTP: privacy 200, unauthenticated player 401, legacy POC search 404. CLI automation bypass remains server-side; no token output/browser exposure.

Backup: ignored `.release-backups/music-2026-09-30T23-30-16.547Z.dump.dpapi` and manifest. DPAPI CurrentUser hash/encryption roundtrip and isolated full scoped restore PASS; includes public/private/migration history and ACLs, excludes Auth credentials/sessions and Storage files. Provider schemas mocked for rehearsal; requires this Windows user/profile. Not full-platform disaster recovery.

Authorized atomic rollout applied versions `20260930000002`–`00006` plus Supabase Cron after Preview/backup verification. Existing three IDs/statuses/timestamps preserved, one-playing invariant healthy. One owner-only hourly job; real worker succeeded during controlled temporary minute cadence and final hourly restoration verified. No fixtures in production, queue activation or Google API calls.

Checks: local SQL boundaries/concurrency/cron contract, 93 tests, built HTTP smoke, lint/typecheck/build PASS. No secrets/backups/.claude committed. Local tooling: guarded rollout, deployment inspector, real Cron verifier.

Next blocker: actual Google search/video quotas and bounded rehearsal budgets must be reviewed before configuring persistent limits. Module/admission remain OFF. Then admin pairing and full physical TV/two-phone, FIFO/non-interruption/ENDED/ERROR/WAITING/refresh/offline/endurance evidence. Confirm ongoing Cron monitoring owner/alerts. Commercial/privacy review and explicit public tenant/Hub activation remain pending. No Production app deploy, paid upgrade or destructive restore; not DONE or POC SUCCESS.
