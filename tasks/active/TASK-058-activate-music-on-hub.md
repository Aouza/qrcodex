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
User approved committing scoped existing work and publishing only `feat/music-production`. Resume feature-branch publication, branch-only credentials and protected Preview. No merge/push main or Production deployment. Earlier blocker notes below are historical; quota/manual gates remain pending.

Current blocker after Git connection: Vercel confirms the repository is linked, but rejects branch-only credentials because `feat/music-production` does not exist in the connected remote repository. Await approval to commit the scoped existing work and publish this feature branch only (never merge/push main). No environment variables, production migration, Cron job or deployment changed. Backup/restore remains PASS; quota review remains pending.

Git blocker resolved: user connected Vercel to Git; read-only confirmation shows `gitLinked=true`, Production branch `main`, protected Preview unchanged. Resume branch-only credential provisioning and compatible Preview. Do not push/merge main or invoke Production deploy. Earlier blocker note below is historical.

Current blocker: Vercel project is not connected to Git (`gitLinked=false`). Branch-scoped Preview environment provisioning was rejected HTTP 400; read-only verification confirms no variables changed. Do not broaden production DB/server secrets to every Preview. Await explicit choice: connect the existing Git repository with reviewed deployment triggers/no Production deployment, or isolate this rehearsal in a separate protected Preview project. No deployment, migration or live Cron setup performed. Backup/isolated restore PASS; local SQL/93 tests/HTTP/lint/typecheck PASS. Google quota question remains pending.

2026-09-30: Supabase Cron approved; local key provisioned. Scheduler operation is `supabase/operations/music-cleanup-cron.sql`; Vercel has no duplicate job. Optional `CRON_SECRET` protects manual HTTP cleanup only. Next: encrypted backup/isolated restore verification, protected compatible branch Preview, five approved migrations, then enable/configure Cron and verify real executions/monitoring. Actual Google quotas and hosted/manual acceptance remain pending.

Read-only preflight: only POC versions `00000`/`00001`, three requests/one playing and healthy invariant; no production settings or pg_cron. Vercel qrcodex is Hobby, Preview authentication protected, CLI access verified. No remote database/environment write, deployment or Hub activation yet.

Backup evidence: `.release-backups/music-2026-09-30T23-30-16.547Z.dump.dpapi` and its manifest (both ignored/excluded from deploy). Windows DPAPI CurrentUser encryption roundtrip/hash verified. Isolated PostgreSQL restore PASS, queue count three, healthy one-playing invariant, original two Music migration versions. Backup covers public/private/migration history with original ACLs; provider Auth schemas are mocked for rehearsal, Auth credentials/sessions and Storage object files excluded. Requires the same Windows user/profile to decrypt; not a full-platform disaster recovery claim. No production restore performed.

Authorization: protected Preview against production Supabase and migrations `00002`–`00006` after backup/history checks; database scheduler approved. No main merge, public activation, paid upgrade or destructive restore. Deploy compatible application before revoking legacy POC RPCs. Preserve queue/history.

TASK-056/057 are complete locally. Follow `docs/MUSIC_RELEASE_RUNBOOK.md` and security evidence. Never infer commercial/public acceptance from local tests or run fixtures in the production database.
