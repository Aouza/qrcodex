# TASK-061 - POC YouTube Music Queue & TV Player

**Epic:** Experiments
**Status:** IN_PROGRESS
**Validation state:** READY_FOR_MANUAL_VALIDATION (not DONE; POC success not established)
**Dependencies:** TASK-060, TASK-052

## Objective
Validate an experimental Supabase-backed ephemeral music request queue with automatic YouTube playback on a bar TV browser, without using the YouTube playlist as the playback queue.

## Requirements
- Preserve POC 1; do not delete or reinterpret it.
- Add an experimental `music_requests` model with tenant-scoped RLS.
- Use Supabase as shared queue state.
- Public request creation must use a narrow RPC/server boundary, not direct anonymous insert access.
- The client must never control `establishment_id`, `status` or playback timestamps.
- Implement atomic/server-side queue promotion, such as `claim_next_music_request(establishment_id)`.
- Queue lifecycle transitions must not be callable by the public request UI and must not rely on broad anonymous update access.
- Guarantee a new request never interrupts the currently playing track.
- Use FIFO ordering for queued requests.
- Add experimental TV route `/{slug}/musicas/player`.
- Use YouTube IFrame Player API for playback and state events.
- Mark playback errors as `failed` and continue to the next queued request.
- Reuse POC 1 search/select flow where useful, but create queue rows instead of inserting into a YouTube playlist.
- Do not expose Music in the public Hub.
- Do not implement fallback/default playlist, voting, rankings, payments, accounts, advanced moderation, cooldown, blacklist, analytics, admin dashboard, Spotify, multi-provider abstraction, crossfade, volume automation or POC 3 behavior.

## Implementation checkpoints
The canonical architecture and detailed sequence are in [YOUTUBE_MUSIC_QUEUE_POC.md](../../docs/experiments/YOUTUBE_MUSIC_QUEUE_POC.md#implementation-checkpoints). Continue from existing partial work; do not restart.

- [x] Canonical checkpoint 1 — reconcile migration/RLS and atomic lifecycle boundaries.
- [x] Canonical checkpoint 2 — restricted player authorization and server API.
- [x] Canonical checkpoint 3 — verify public request UI adaptation.
- [x] Canonical checkpoint 4 — dedicated TV terminal and IFrame lifecycle.
- [x] Canonical checkpoint 5 — Realtime wake-up and necessary idle recovery.
- [x] Canonical checkpoint 6 — checks, documentation and manual-validation handoff.

Next POC checkpoint: manual validation following the canonical specification's Local Setup and Success Scenario, including playback-error advancement and refresh recovery. Production migrations and player credentials are now configured. Do not declare POC success before the manual scenario passes. On 2026-09-30 the user explicitly authorized separate production tasks; these follow `docs/MUSIC_PRODUCTION.md` and do not expand this experiment's scope.

## Acceptance criteria
- [x] A request creates a tenant-scoped `queued` row, not a YouTube playlist item.
- [x] If nothing is playing, the player atomically claims the oldest queued request and starts it.
- [x] If something is playing, new requests append to the queue and do not interrupt playback.
- [x] On `ENDED`, the current request becomes `played` and the next queued request becomes `playing`.
- [x] On playback error, the current request becomes `failed` and the player advances.
- [x] At most one request can be `playing` per establishment.
- [x] Anonymous/public access cannot read or mutate another establishment's queue.
- [x] The public Hub does not expose Music.
- [ ] The exact POC 2 success scenario is manually validated or a blocker is documented.
- [x] Lint, typecheck, build and relevant SQL/unit tests pass.
- [x] TV playback needs no admin session, exposes no queue-management controls and uses only the restricted server boundary.
- [ ] After any initial activation gesture, the exact multi-phone manual scenario advances automatically and ends in WAITING; automated tests alone do not establish POC success.

## Completion notes
- User follow-up (2026-09-30): reported player working, phone search working after the local-origin fix, and no hydration warning in Safari (Chrome still warns). Record this partial evidence only; complete multi-phone/ENDED/ERROR/WAITING and refresh acceptance is not yet confirmed. User authorized proceeding with production design/tasks separately; TASK-053 is complete and TASK-054 is the next implementation checkpoint.
- Implementation completed for the approved checkpoints; manual acceptance remains open. Checked implementation criteria have local automated/code evidence, not proof of audible/browser playback. TASK-061 stays IN_PROGRESS and in `tasks/active/`; no POC SUCCESS or DONE is claimed.
- Preserved POC 1 and the queue draft, added a follow-up boundary migration, removed member direct UPDATE/browser lifecycle execution and replaced the draft admin-session endpoints/helpers with one restricted player API. Atomic event/next-track processing is database-owned and stale/cross-tenant reports cannot transition another request.
- Added server-only POC authorization, a signed tenant-bound 12-hour HttpOnly cookie, same-origin/input checks and a playback-only TV route. The player reuses one IFrame, retries failed event delivery safely, ignores active-playback queue wake-ups and displays WAITING when empty. No fallback music, Hub link or admin controls were added.
- Verification: `node --test tests/*.test.mjs` PASS (62 tests); `npm.cmd run lint` PASS; `npm.cmd run typecheck` PASS; `npm.cmd run build` PASS. `node tests/run-music-queue-local.mjs` PASS on PostgreSQL 18, including RLS/grants/FIFO/status/history/inactive/stale-event tests and eight concurrent claims/ENDED reports. Local Supabase Auth/Realtime fixtures do not prove hosted WebSocket behavior. `node tests/music-player-http-smoke.mjs` PASS against the built app (authorization, CSRF, invalid events/fields, retired endpoints). Diff whitespace check PASS; server credential names do not occur in built browser chunks.
- Production follow-up (2026-09-30): development was paused, so the user authorized production as the POC target and explicitly requested applying the missing migrations. `scripts/apply-music-player-migrations.mjs --apply` confirmed the production database match and absence of partial schema/history, applied both migrations in one transaction, recorded both versions and reloaded PostgREST schema cache. Read-only production verification PASS: queue API HTTP 200; claim/advance/topic RPCs visible; anonymous/member UPDATE and claim execution denied; service-role claim allowed. No sample customer requests or playback transitions were generated by migration verification. Matching secret/player keys are configured in `.env.production.local`.
- Handoff: `http://localhost:3000/relicas/musicas/player` using the production-loading launch command in the canonical Local Setup section; plain `npm.cmd run dev` still targets `.env.local` (paused development). Authorize via the setup form and activate once if necessary. Phones use the TV computer's reachable LAN IP/deployment URL at `/relicas/musicas/poc`. Follow the canonical three-track scenario, verify statuses and error advancement, and confirm refresh recovery. Record all manual results before marking success/completion.
- Local phone follow-up: Next dev logs showed blocked cross-origin development resources from `192.168.1.7`; that specific trusted LAN origin is now allowed in `next.config.ts`. Restart and reload the phone to validate the search button. This does not yet prove the mobile issue or manual playback scenario resolved.
