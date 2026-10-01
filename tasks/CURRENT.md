# Current Development

## Active task
TASK-058 — Activate Music on Hub is IN_PROGRESS / READY_FOR_MANUAL_VALIDATION. User explicitly authorized Production deployment and Music in Relica's Hub for the owner rehearsal during construction. Production app commit `bca4967`, alias https://qrcodex-eight.vercel.app; no main merge. Relica's only enabled, others OFF. This is not public-launch/commercial acceptance, POC SUCCESS or DONE.

## Next checkpoint
Owner usability correction: production migration `20260930000007` and commit `88a8682` are live with eight-character TV pairing; queue/devices/leases/grants unchanged, fresh encrypted backup/isolated restore and SQL/HTTP/application checks PASS. Search Thornhill reproduced 503 because a successful YouTube response included an item without videoId; per-item validation correction is being verified/released. Physical pairing/playback/endurance remain manual. No main merge or task completion.

STOP for owner manual validation: admin at /admin/music issues a one-time code; TV at /relicas/musicas/player pairs without admin privileges, then activate once if needed. Two phones use /relicas or /relicas/musicas. Validate FIFO/non-interruption/ENDED/ERROR/WAITING/refresh/offline and endurance. Rights/privacy review and monitoring ownership remain public-launch gates. Observed Google search quota 100/day and general quota 10,000/day; app budgets 80 searches/day, 100 metadata calls/day, costs one each, existing counters untouched. URL is publicly accessible to anyone with the link, not protected Preview.

Backup/isolated restore PASS; scope public/private/migration history, not Auth credentials/Storage files; requires this Windows profile. Atomic rollout applied `20260930000002`–`00006` and the one hourly owner job, preserving three request IDs/statuses/timestamps and the one-playing invariant. Real Supabase worker succeeded and hourly schedule restoration was verified. Ongoing failure/missed-run monitoring owner remains to confirm.

## Verified baseline
TASK-053 through TASK-057 are DONE locally. Production HTTP PASS: Hub Music link, Menu/Agenda/customer/player 200, secure consent cookie, player without auth 401, wrong origin 403, POC 404, cleanup 401. Local SQL/concurrency, HTTP, 94 tests/lint/typecheck/build PASS. No fixtures, synthetic queue events, fake lease or Google calls executed by production smoke. Preview remains separately configured/protected with independent signing key. CLI automation bypass never printed/exposed to browser.

## Experimental status
TASK-061 retains pending manual evidence only, not active implementation. User reported successful player/phone search and Safari without hydration warnings; Chrome-only warnings remain. Full multi-phone/ERROR/refresh evidence is incomplete: not POC SUCCESS/DONE. Preserve POC 1 and correct work. Production migrations intentionally revoke legacy POC admission/lifecycle; never apply without a compatible application.

## Release guardrails
Canonical specification/runbook own final release gates. The user-approved owner Production rehearsal supersedes earlier no-Hub/no-Production restrictions for Relica's only; physical/endurance and privacy/commercial evidence still precede declaring public launch complete. No fallback, votes, reordering, payments or analytics. Preserve Menu/Agenda. STOP for manual validation; no next product task. Keep output concise.
