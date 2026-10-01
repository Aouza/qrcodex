# Music — first production release

## Status and ownership
TASK-053 defines this implementation contract after the user's approval to advance from the POC on 2026-09-30. TASK-054 through TASK-057 implement the local additive schema, public/player/admin application and isolated verification; no production migration is applied. TASK-058 owns actual-host/manual acceptance and approved release. Preserve TASK-061's working queue/player and historical specification; do not rewrite them or claim its outstanding manual criteria passed.

## Scope
- Customer route: `/{slug}/musicas`; TV route: `/{slug}/musicas/player`; operations: `/admin/music` in the existing Admin.
- Supabase owns FIFO (`requested_at`, then `id`) and all atomic lifecycle transitions. YouTube playlists are never the queue.
- TV renders the official visible IFrame and reports technical events only. One initial activation is acceptable; no intervention between healthy tracks. Realtime is only a wake-up; idle/error recovery remains slow.
- Empty queue means WAITING. No fallback, votes, ranking, reordering, payments, accounts, provider abstraction or advanced moderation.
- Customer copy: requests do not guarantee playback. Failure, queue-full, requests-disabled and player-offline states must be explicit.

## Lifecycle and administrative operations
Retain `queued`, `playing`, `played`, `failed`; add terminal `skipped` (admin skips current) and `cancelled` (admin removes queued or queued request expires). Never recycle terminal records. Preserve the partial unique playing index.

ENDED and unrecoverable ERROR validate tenant, live device session, lease generation, playback generation and current request in one transaction; then transition and claim next. Duplicate/stale events cannot advance a second time. Serialize request admission, lifecycle, skip and remove on the same tenant lock.

Admin may toggle requests, skip the current request, remove a queued request, pair/revoke the TV and enable/disable the Music module. Every mutation independently resolves authenticated membership, with membership validation also inside narrow database RPCs. No generic table UPDATE or browser service-role privilege. Skip must stop the old video through a playback instruction wake-up; unlike customer queue inserts, this authorized change may interrupt playback. Admin wake-ups carry no queue data; the TV re-resolves authoritative state even while playing and replaces only a changed playback generation.

`music_enabled` controls public availability and defaults false. `requests_enabled` controls admission and defaults false. Turning requests OFF preserves playback of already accepted tracks. Disabling Music or revoking its TV stops playback and freezes the active queue; neither action marks a song played. Re-enabling recovers the current request. Setting changes must reach the terminal through a wake-up plus heartbeat recovery. Cardapio/Agenda remain independent.

## Device boundary and recovery
- Admin generates a tenant-scoped, random, single-use 8-character base32 pairing code (40 bits), displayed `XXXX-XXXX`, valid for 10 minutes. This user-approved human-entry format replaces the previous 128-bit minimum for pairing codes only; persistent device tokens remain 256 bits. Exclude `0`, `1`, `I`, `O`; accept either case and an optional hyphen. TV submits it in a server-handled form, not a URL; pairing does not log in to Admin. Durable redemption caps remain 5 attempts/network, 50/tenant and 500/global per 10 minutes; issuance is capped at 10/tenant/hour and 1,000/global/hour.
- Store only a digest of pairing codes and random device-session tokens. Issue an HttpOnly, Secure, SameSite=Strict cookie. Recheck tenant/device revocation in server and database boundaries. No raw token in client JS, URL or logs. Pairing attempts are persistently rate-limited; constant-time secret comparisons where applicable.
- Device session maximum age: 30 days; renewal requires pairing. Revocation is immediate on the next server interaction, including heartbeat. TV displays a setup-required state, not an endless reconnect spinner.
- Permit one active playback lease per establishment. Heartbeat every 20 seconds; lease expires after 90 seconds. A second tab/device cannot take over a live lease implicitly. Explicit admin replacement revokes the old session and increments a fencing generation.
- Every newly loaded/recovered playback instruction has a generation; refresh/replacement invalidates old generation events even for the same request ID. Repeated state reads of a healthy lease do not restart its video.
- On loss of lease/authorization or after 90 seconds without a successful renewal, stop playback locally and do not advance. Preserve the playing row for recovery; do not infer ENDED from a timeout. Offline TV means new requests are rejected. When connection returns, recover current playback before claiming next; restart timestamp is acceptable.
- Cookies authorize only state, lease heartbeat and validated technical events. Reject cross-origin writes and malformed input. Protect player responses from caching. Bounded retry/backoff prevents Realtime wake storms from producing unrestricted RPC traffic.

## Public requests and abuse boundary
Anonymous/public queue-table reads/writes and lifecycle execution remain denied. Revoke public execution of the POC create RPC when production admission is introduced: HTTP-only limits are bypassable while that RPC is directly callable. Disable all legacy POC mutation/OAuth setup endpoints in hosted production without deleting POC 1 history/code.

Customer has a random HttpOnly signed visitor cookie, not an account. Server verifies a supported trusted-proxy client address and persists only a keyed digest for short-lived limits; never trust arbitrary forwarded headers. Missing/invalid trusted identity fails closed for writes. Limits are atomic in Postgres, not in serverless process memory. Cookie resets are not a reliable identity boundary, so combine visitor, network, tenant and global quota controls; shared Wi-Fi must be covered by tests.

Initial operational defaults (configuration, not a promise of strong identity):
- Request: one per visitor per 60 seconds, five per rolling hour; network cap 60 per minute per tenant; at most 30 queued tracks per tenant.
- Search: five per visitor per minute, 60 per network per minute; project-wide daily YouTube quota budgets configured from the actual Google project before release, separately for search and video operations. Reserve quota atomically before upstream calls; exhaustion produces a clear unavailable state. Local SQL defaults both budgets to zero. [Current quota buckets and Pacific-midnight reset](https://developers.google.com/youtube/v3/determine_quota_cost).
- Pairing: five attempts per network per 10 minutes (all attempts counted, conservatively including successful pairing), 50 per tenant and 500 per project per 10 minutes. Issuance: 10 codes per tenant and 1,000 per project per hour. No unlimited issuance or redemption attempts. Limits are private reviewed configuration, not TV controls.
- Double-tap/retry uses a visitor-scoped idempotency key; the same payload returns the original receipt without a second row or new rate charge. Changed payload with the same key is rejected. No vote/duplicate aggregation or permanent video blacklist.

These defaults may be adjusted explicitly after controlled testing. A network cap supplements visitor limits and must not impose a one-song-per-minute limit on the bar's shared Wi-Fi.

Server resolves tenant by active slug, verifies enabled/admission settings and live lease, validates visitor receipt/consent and rate limits, then validates video ID and current YouTube metadata/embeddability before narrow atomic admission. Never trust client title/channel/thumbnail/status/tenant. Revalidate admission conditions under the tenant lock after the external API call. Return only the caller's minimal receipt, not the public queue or visitor identifiers.

## YouTube and privacy
Separate read-only public-video search/validation configuration from POC 1 OAuth/playlist configuration. Prefer a restricted server-only YouTube Data API key for these public-data operations; never ship it to the browser. No customer YouTube login or playlist writes are required. API checks reduce unsuitable results but cannot guarantee future playback; ERROR advancement remains mandatory.

Provide terms/privacy acceptance before Music search/request use, visible YouTube Terms and Google Privacy links, and explain device cookies, temporary network digests and third-party video/advertisements. Leave Menu/Agenda accessible without Music consent.

Keep the visible official player, branding, links and advertisements intact; never extract audio or implement hidden/background playback. Before commercial opening, obtain an explicit review of the use case against YouTube policies and applicable venue/public-performance rights. Technical success is not a legal/commercial authorization.

Delete ephemeral request/history metadata after at most 30 days rather than keeping API data indefinitely; refresh or cancel older active records before loading. Visitor-scoped retry receipts remain only while their request exists and never beyond 30 days. Remove expired sessions/pairing codes and rate-limit buckets automatically. Network rate digests expire within 24 hours. Retention cleanup is tested and scheduled before release; no analytics or indefinite logs of visitor/IP identifiers.

Primary policy reference: [YouTube API developer policies](https://developers.google.com/youtube/terms/developer-policies), reviewed 2026-09-30. Review actual API quota and credential restrictions at implementation/release, not assumed constants.

## Implementation checkpoints
1. TASK-054: additive migrations, tenant settings, device/session/lease generations, atomic admission/limits/idempotency and narrow admin/lifecycle RPCs; security/concurrency tests. No remote schema mutation without confirming target/history and explicit deployment approval.
2. TASK-055: production public UI/search/server endpoints and hardened TV lifecycle, cookie/lease recovery, error handling, privacy/terms and retention integration. Reuse pure POC helpers and IFrame logic; isolate legacy endpoints.
3. TASK-056: membership-scoped Admin Music, pairing/revocation and ON/OFF/skip/remove, no additional moderation or reordering. Player has no admin UI.
4. TASK-057: adversarial and operational verification of the integrated release, including direct RPC bypass, quota/rate concurrency, two devices, stale same-request events, skip while playing, offline recovery, multiple phones on shared Wi-Fi and expired/revoked session.
5. TASK-058: protected Vercel Preview, complete manual TV/phone scenario, commercial/policy review, production migration/configuration approval, deploy and enable Relica's only. Other tenants default OFF.

## Release gates and rollback
TASK-057 local review is recorded in `docs/experiments/MUSIC_PRODUCTION_SECURITY_REVIEW.md`. TV cookies are tenant-bound signed random tokens; signature checks reject forgeries before RPC dispatch, while DB expiry/revocation remains authoritative. Stalled JSON reads are capped at five seconds. The controlled release checklist and approvals still required for TASK-058 are in `docs/MUSIC_RELEASE_RUNBOOK.md`.

Run SQL, relevant application tests, lint, typecheck and build. Repeat FIFO/ENDED/ERROR/WAITING, refresh, admin skip/remove and lost network/session tests over HTTPS. Record browser/device and multi-hour playback evidence, not only a developer's initial start. No Safari-only assumption for public customer UI.

Preview variables are scoped separately from Production; a Preview pointed at production Supabase still changes real data. Prefer isolated fixtures/project; if production is deliberately reused, document the approved tenant and never run destructive test fixtures there. Validate cookie/proxy-origin behavior on the actual host.

Record migration history, backup/restore readiness, server secrets, actual quota budget, cleanup schedule, sanitized failure logs and owner runbook. Confirm no POC public bypass remains. Release only after commercial review and manual acceptance. Operations can disable new requests or the module without touching Cardapio/Agenda. App rollback does not undo database migrations: keep migrations additive and deploy-compatible; rollback must not restore insecure POC endpoints. Destructive rollback requires separate review.

## Local implementation handoff (TASK-055)
TASK-058 user-approved owner Production rehearsal is now live at https://qrcodex-eight.vercel.app: Music in Relica's Hub only, module/admission ON, initial app budgets 80 searches/day and 100 metadata calls/day (observed Google 100 search/day, 10,000 general/day). Independent server-only Production signing key and exact stable origin configured; anonymous Hub availability fails closed without affecting Menu/Agenda. This supersedes historical OFF/unlinked statements below for this approved tenant only. Physical/endurance/commercial evidence remains pending; not public-launch acceptance or POC SUCCESS.
Customer UI must disable search input/submit, result selection and request submission when admission is paused/offline. Server disabled/offline responses clear stale selections and latch controls closed until reload; network uncertainty retains the retry ID for safe retries. Privacy/consent remain accessible, and the server still authoritatively rejects invalid admission. Reload after the TV becomes ready; no customer-side aggressive polling.

TASK-056 implements the membership-scoped Admin at `/admin/music`, including one-time pairing code issuance, explicit replacement/revocation, configuration, current/FIFO queue and live/offline state. All operations use existing membership JWT and narrow RPCs; no service admin credential or direct queue UPDATE. TASK-058 applied migrations `20260930000002`–`00006` and Supabase Cron after backup/isolated restore and compatible protected Preview verification. Module/admission and quota budgets remain OFF. Actual quotas, hosted pairing/mobile/manual acceptance and commercial release remain pending.

Production application is gated by `MUSIC_PRODUCTION_ENABLED` (default false); tenant controls and both quota budgets also default OFF. Configure the compatible migrations and reviewed quota costs/budgets, server-only service credential, independent `MUSIC_SESSION_SECRET` (at least 32 random characters), `YOUTUBE_MUSIC_API_KEY` and exact `MUSIC_APP_ORIGIN`. `CRON_SECRET` is optional for protected manual HTTP cleanup; Supabase Cron does not use it. Preview may use the trusted `VERCEL_URL` origin when no custom origin is configured. Hosted trusted-network handling is currently Vercel-only; explicit `MUSIC_LOCAL_NETWORK_ID` is development-only and aggregates the LAN.

Routes are `/{slug}/musicas`, `/{slug}/musicas/privacidade` and `/{slug}/musicas/player`, with no Hub activation; `/admin/music` now supplies pairing/operations. TV requires HTTPS/localhost and Web Locks support; use one initial activation when needed. Ordinary heartbeats do not reload video. Approved cleanup scheduler is Supabase Cron: one hourly owner-controlled database job, independent of TV/session uptime, with pre-cap thresholds (29 days metadata/receipts, 23 hours network rates). Apply `supabase/operations/music-cleanup-cron.sql` only after backup and compatible migrations; no Vercel job or paid upgrade. Release must verify successful real executions and monitor missed runs. Closing the player neither deletes the queue nor runs retention cleanup; the lease expires separately.

Isolated SQL/HTTP, pure lifecycle/security and SSR/style tests validate the local checkpoint. They are not browser/mobile/YouTube playback evidence, proof of commercial permission or authorization to apply migrations to production. TASK-057/058 retain adversarial, actual-host, 320px browser, multi-phone and endurance validation gates.
