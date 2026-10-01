# Music release gate — TASK-058

Status: user authorized protected Preview using production Supabase and five pending migrations after history/backup checks, keeping Music out of the Hub. Supabase Cron is approved and the YouTube API key is present locally. Backup/restore, hosted provisioning, actual quotas and manual validation remain pending; no database writes or deployment occurred. Main merge/public activation/paid upgrade/destructive restore are not approved. Canonical behavior: `docs/MUSIC_PRODUCTION.md`. Local security evidence: `docs/experiments/MUSIC_PRODUCTION_SECURITY_REVIEW.md`.

## Decisions required before external changes

- Approve the Vercel project, protected Preview and deliberate Supabase target. A Preview pointed at production writes real data. If production is selected, explicitly approve the tenant and controlled rehearsal; never run SQL test fixtures there.
- Approved scheduler: Supabase Cron, direct database cleanup every hour. No Vercel cron or paid upgrade. Optional bearer `CRON_SECRET` stays server-only and protects manual HTTP cleanup only.
- Obtain venue-use/YouTube-policy and privacy approval and actual Google search/video quotas/costs. Engineering tests do not establish public-performance rights.
- Confirm remote migration history, backup/restore capability and compatible application rollout. Pending versions are `20260930000002` through `00006`; do not replay the existing POC migrations blindly.

## Controlled preparation
Git connection and scoped feature-branch commit/publication are now approved. Publish only `feat/music-production`, configure branch-only Preview credentials and verify compatible protected application before migrations. Do not merge/push main or broaden credentials to every Preview. Backup/isolated restore passed; remote migration/deploy/Cron remain pending.


1. Run isolated checks and verify no server secret enters browser bundles/logs. Keep public module/admission OFF.
   Backup tooling: `node scripts/music-production-backup.mjs` creates an ignored DPAPI-encrypted scoped archive and rehearses restore into a disposable isolated PostgreSQL (provider schemas mocked). Read the manifest; requires this Windows profile and excludes Auth credentials/sessions and Storage object files. Verify encrypted archives remain recoverable before losing this profile. This is migration-scope recovery evidence, not full Supabase disaster recovery. Never upload backups/env files in the Preview source.
2. Scope Preview/Production variables separately. Configure independent signing/HMAC and read-only API secrets, exact HTTPS origin and privileged Music RPC credential without printing values. `CRON_SECRET` is optional for manual HTTP cleanup, not used by Supabase Cron.
3. After explicit target approval, apply pending additive migrations in order alongside the compatible app. Legacy POC execution is intentionally revoked; a POC-only rollback must not reopen it. Test settings default OFF and compare existing queue IDs/statuses.
4. Configure reviewed persistent quota budgets through a trusted administrative database process, not browser/admin UI. After backup and migrations, enable the Supabase Cron integration and run `supabase/operations/music-cleanup-cron.sql` as the trusted `postgres` operator. The idempotent job `relicas-music-cleanup-hourly` invokes the fixed cleanup function at `0 * * * *` with bounded timeouts; no URL/HTTP secret, application cron privilege or unrelated-job removal. Run initial cleanup before activation. Verify the job is active for this database and observe successful `cron.job_run_details`/Dashboard runs. Record who checks failures and missed runs (alert before the retention margin is exhausted); configuration alone is not operational proof. Never drop pg_cron to roll back, because other jobs may exist.
5. Pair through the authenticated `/admin/music` screen. TV opens `/{slug}/musicas/player`, has no admin session and may need one initial activation. Use HTTPS/Web Locks support. Restricted TV/visitor authorization must not accept forged origins/headers.

## Required recorded manual evidence

- Browser/version, TV/device, host, target tenant and timestamps; layout at 320px and weak-network behavior.
- Phone A requests first track while TV waits; Phone B requests second while first plays uninterrupted; Phone A requests third. FIFO ENDED progresses automatically; final empty queue waits without fallback.
- Unavailable/unembeddable video produces failed history and automatic next playback; refresh recovers current request without a stale event advancing it.
- Admin pause preserves playback; disable/revoke stops without marking played; skip/remove target only the intended request. Explicit replacement fences the old TV. Two tabs/devices cannot silently take over.
- Disconnect beyond lease expiry stops locally and blocks new admission; reconnect recovers playing. Test expired/revoked session and shared Wi-Fi phones, consent/limits/quota messages and cleanup with no identifier/secret logs.
- Multi-hour playback without human intervention after activation; actual Realtime wake and slow missed-event recovery; Menu/Agenda/auth/admin regression checks.

## Final activation and rollback

Only after evidence and explicit production migration/deploy/tenant-activation approval: implement/review configuration-driven Hub availability, enable Relica's only, leave other tenants OFF, and recheck production endpoints/cookies/cron. No Hub link is activated by TASK-056/057.

Rollback: pause requests or disable Music/revoke the TV using narrow admin operations; preserve queue/history and Menu/Agenda. Revert to a compatible production app only, never restore POC bypasses or destructively reverse schema. Alert on RPC/upstream/cron failures with sanitized aggregate information. Retention monitoring must detect missed cleanups before the canonical maxima; emergency deletion/restore requires separate reviewed authority.
