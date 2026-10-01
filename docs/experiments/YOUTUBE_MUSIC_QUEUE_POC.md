# YouTube Music Queue & TV Player POC

**Status:** READY_FOR_MANUAL_VALIDATION; POC success not validated
**Owner:** Relica's Digital Hub
**Branch:** `poc/youtube-music`
**Production feature:** No
**Hub visibility:** No

## Context
POC 1 validated that a customer can search YouTube from the Relica's experimental route and submit a selected video. POC 2 changes the target model: the persistent YouTube playlist is not the queue.

Relica's application owns an ephemeral queue in Supabase. The bar TV opens an experimental player route, claims work from that queue, plays videos through the YouTube IFrame Player API and advances automatically.

This remains experimental and must not activate Music in the public Hub.

## Approved Player Architecture
Supabase and the Relica's backend own the queue, FIFO ordering and every lifecycle transition. The YouTube playlist from POC 1 is not the queue; preserve POC 1 as a separate experiment.

`/{slug}/musicas/player` is a dedicated playback terminal for the bar TV. It renders video through the YouTube IFrame Player API, obtains minimal playback instructions and reports technical `ENDED`/`ERROR` events through a narrow server boundary. It never directly updates `music_requests`, calls lifecycle RPCs from the browser or receives Supabase privileges capable of managing the queue. No admin session is required on the TV.

Customers may search, select and request videos, but cannot claim, change status, remove requests or control the TV. The backend validates establishment, player authorization and the current playing request before transitioning or selecting the next video. Browser request IDs and video IDs are not authoritative.

All future human controls (skip, remove, requests on/off, block, reorder and moderation) belong to our application/admin, never the TV. They remain outside TASK-061.

## Hypothesis
It is technically viable for the Relica's app to coordinate a shared, tenant-scoped music queue in Supabase and drive automatic YouTube playback on a bar TV browser without using a YouTube playlist as the source of truth.

## Success Scenario
The POC succeeds when this scenario works:

1. Open `/{slug}/musicas/player` on the computer connected to the TV, establish player authorization and, if browser policy requires it, click `Iniciar player` once. Do not touch the TV computer afterward.
2. Start with no queued requests.
3. From phone A, request `Deftones - Change`.
4. Without touching the TV, Deftones starts playing.
5. While Deftones plays, from phone B, request `Thornhill - Obsession`.
6. Thornhill becomes queued and Deftones continues uninterrupted.
7. When Deftones ends, Deftones becomes `played`, Thornhill becomes `playing` and starts automatically.
8. While Thornhill plays, request `Loathe - Two-Way Mirror`.
9. When Thornhill ends, Loathe starts automatically.
10. When Loathe ends and the queue is empty, the player waits/stops.

No manual intervention should be required between tracks after initial activation. Also verify that an unavailable/unembeddable video becomes `failed` and playback advances automatically.

Automated tests alone cannot establish POC success. Record the exact phone A / phone B / TV scenario and error-path observations before declaring SUCCESS.

## Explicit Non-Goals
- No fallback/default playlist.
- No voting, likes, rankings or "most requested".
- No payments, paid priority or commercial queue controls.
- No customer accounts.
- No advanced moderation.
- No cooldown, device limits, table limits, blacklist or artist blocking.
- No advanced duplicate prevention.
- No recommendation algorithms.
- No analytics.
- No full music admin dashboard.
- No Spotify.
- No multiple providers.
- No generic `MusicProvider` abstraction.
- No crossfade or volume automation.
- No production Hub activation.

## Current Architecture Fit
This POC must follow the existing project shape:

- tenant-owned records include `establishment_id`;
- public routes resolve establishments by slug;
- admin/member authorization derives from `establishment_users`;
- RLS remains enabled for tenant-owned data;
- existing public establishment/menu reads use anonymous Supabase clients and RLS; TV playback state is obtained through its restricted server boundary;
- public writes must not trust client-supplied `establishment_id`;
- database concurrency belongs in Postgres functions, following the `reorder_category` pattern;
- experimental code should stay isolated under `youtube-poc` or similarly explicit POC naming.

POC 2 is a deliberate experiment. It should not silently redefine the final Music Requests module from the PRD. Following explicit approval to advance, TASK-053 defines the separate production contract in `docs/MUSIC_PRODUCTION.md`; implementation and release gates remain pending before public launch.

## Proposed Routes
Experimental request route:

```text
/{slug}/musicas/poc
```

The POC 1 request UI can be reused, but the success copy changes to:

```text
Musica adicionada a fila
```

Experimental TV route:

```text
/{slug}/musicas/player
```

The route is for the browser/computer connected to the bar TV and must not be linked from the public Hub.

Internal API/Server Action shape may be chosen during implementation, but must preserve:

- request creation resolves the establishment from the slug server-side;
- request creation accepts selected YouTube metadata, not arbitrary tenant IDs;
- player transitions call server-side database functions rather than doing multi-step queue promotion in browser state.

## Database Model
Create a versioned experimental migration for `public.music_requests`.

Conceptual columns:

```text
id uuid primary key default gen_random_uuid()
establishment_id uuid not null references public.establishments(id)
youtube_video_id text not null
title text not null check (btrim(title) <> '')
channel_title text not null check (btrim(channel_title) <> '')
thumbnail_url text null
status text not null default 'queued'
requested_at timestamptz not null default now()
playing_at timestamptz null
played_at timestamptz null
failed_at timestamptz null
failure_reason text null
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Allowed statuses:

```text
queued
playing
played
failed
```

Recommended database checks:

- `youtube_video_id` matches the 11-character YouTube ID shape used in POC 1 validation.
- `status` is one of the allowed values.
- `playing_at` is present when status is `playing`, `played` or `failed`.
- `played_at` is present only when status is `played`.
- `failed_at` is present only when status is `failed`.

Indexes:

```text
(establishment_id, status, requested_at, id)
(establishment_id, status, playing_at)
```

The active queue is:

```sql
where status = 'queued'
order by requested_at asc, id asc
```

Played and failed rows are history and do not belong to the active queue.

## RLS and Grants
Enable RLS on `music_requests`.

For this POC:

- anonymous/public clients must not be granted direct queue reads across establishments; a client-side tenant filter alone is not authorization;
- the authorized TV obtains only the current playback state needed for rendering through the server boundary;
- authenticated admins may read all rows for their establishment through membership;
- authenticated admin mutation is not required; remove/restrict broad direct `UPDATE` grants and policies that bypass lifecycle RPCs.

Approved security decision: public request creation must not use direct anonymous `insert` access to `public.music_requests`.

Use a narrow security-definer RPC:

```sql
public.create_music_request(
  tenant_slug text,
  video_id text,
  title text,
  channel_title text,
  thumbnail_url text
)
```

The RPC resolves the active establishment from `tenant_slug`, validates the payload and always inserts a `queued` row.

The client must never control:

- `establishment_id`;
- `status`;
- `requested_at`;
- `playing_at`;
- `played_at`;
- `failed_at`.

Direct anonymous insert/update/delete grants on `music_requests` are not allowed for this POC.
The TV must also have no direct table mutation or browser-callable lifecycle privileges. Any privileged database credential needed by the server boundary remains server-only and is never passed to the TV.

## Atomic Queue Transitions
Do not implement `SELECT first queued -> UPDATE playing` in the browser.

Use server-side Postgres functions:

```sql
public.claim_next_music_request(tenant_id uuid)
returns public.music_requests
```

Required behavior:

1. Verify the establishment exists and is active.
2. Serialize lifecycle operations for the establishment, including when no row is currently playing, with a transaction-level lock.
3. If any row is already `playing` for the tenant, return that row and do not promote a queued row.
4. Otherwise, select and lock the oldest `queued` row ordered by `requested_at, id`; preserve FIFO under concurrency.
5. Promote it to `playing`, set `playing_at = now()`, update `updated_at`, and return it.
6. If no queued row exists, return null.

Also use:

```sql
public.mark_music_request_played(tenant_id uuid, request_id uuid)
public.mark_music_request_failed(tenant_id uuid, request_id uuid, failure_reason text)
```

These functions must scope by both `id` and `establishment_id`. They should only transition the current row from `playing` to `played` or `failed`.
For technical events, verify that the reported request is the tenant's current `playing` request. Ignore/reject stale or cross-tenant events without marking any other request. Complete the valid transition and next-track claim atomically in the database; a composing RPC may call the existing lifecycle functions in one transaction.

Approved security decision: queue lifecycle transitions must not be callable arbitrarily by public request clients. The public request UI must not be able to claim, mark played or mark failed. Keep the implementation minimal, but do not solve this by granting broad anonymous `update` access to `music_requests`.

POC implementation boundary:

- request creation is public through only `create_music_request`;
- playback lifecycle calls go through server route handlers intended for the experimental TV player;
- those player route handlers require a local POC player key stored server-side (`YOUTUBE_POC_PLAYER_KEY`) and establish/use an HttpOnly cookie for the TV browser;
- database functions still enforce tenant scoping and atomic transitions.

### POC-only player authorization
THIS IS POC-ONLY DEVICE/PLAYER AUTHORIZATION, not the final production device-auth architecture.

- Document `YOUTUBE_POC_PLAYER_KEY` in `.env.example`; validate it only on the server.
- Accept setup credentials through a server-handled form/body, never a URL/query string. Do not serialize the raw key into client JavaScript, log it or return it in responses.
- Establish an HttpOnly, tenant-scoped authorization cookie with expiry, SameSite protection and Secure transport in deployment. Validate authorization and the active establishment on every player endpoint; protect cookie-bearing mutations against cross-origin requests.
- Grant only playback-state access and reporting of current-track technical events. This cookie grants no admin, establishment, product or queue-editing access.

### Minimal player server API
Use operations equivalent to bootstrap/state, ended and error. Bootstrap/state recovers the tenant's current playing row or atomically claims the oldest queued row. Ended/error validate the current request, transition it and return the next authoritative playback state. Do not expose generic queue mutation endpoints or queue management data to the TV.

Concurrency guarantee:

- at most one `playing` row per establishment;
- new requests never interrupt the current `playing` row;
- FIFO promotion only happens when no row is playing.

Recommended enforcement:

```sql
create unique index music_requests_one_playing_per_establishment_idx
on public.music_requests (establishment_id)
where status = 'playing';
```

Use transaction-level row locks and the partial unique index together. The function should handle unique conflicts defensively by returning the already-playing row.

## TV Player Lifecycle
The experimental player route renders the browser playback loop; the backend/database owns the queue lifecycle.

Minimal visual states are BOOTING, READY/WAITING, PLAYING and RECOVERING/ERROR. Use a simple fullscreen playback surface with video as the primary content and optional `Tocando agora` title/channel below it. Do not add queue lists, management controls or admin navigation. Avoid significant UI polishing during this POC.

When idle, show the establishment identity (Relica's for this bar) centered with `Aguardando pedidos...`. No fallback/default music plays.

On load:

1. Resolve establishment by slug.
2. Establish restricted player authorization and subscribe to the tenant's Realtime wake-up signal.
3. Ask the server boundary to recover current playback or call `claim_next_music_request` atomically when nothing is playing.
4. If a `playing` row exists or is claimed, load that YouTube video.
5. If none exists, render a waiting state.

During playback:

- show the video and minimal now-playing title/channel;
- do not auto-claim a new request while one is playing;
- ignore queue wake-up notifications for video replacement while playing: new requests remain queued and never interrupt the current video.

On `ENDED`:

1. Report the technical `ENDED` event to the server boundary.
2. The server/database validates the current request, marks it `played` and atomically calls `claim_next_music_request`.
3. If a row is returned, load and play it.
4. Otherwise, wait/stop.

On playback error:

1. Report the technical playback error to the server boundary.
2. The server/database validates the current request, marks it `failed` and atomically calls `claim_next_music_request`.
3. Continue if another queued row exists.
4. Otherwise, wait/stop.

Recovery:

- if the TV page reloads, ask the server to recover the `playing` row and reload its video; restarting the current video is acceptable, exact playback timestamp recovery is not required;
- for POC 2, do not implement stale lock timeouts unless manual testing shows player reloads leave unusable `playing` rows;
- if needed, add a later simple recovery field such as `heartbeat_at` or a function that reclaims stale `playing` rows after a conservative timeout.

## Supabase Realtime
Use Realtime as the primary idle wake-up mechanism, not the source of truth. Every wake-up resolves playback through the server/database boundary.

Expected behavior:

- a queued insert produces a tenant-scoped notification;
- use an authorized subscription or a minimal opaque wake-up broadcast without exposing queue rows across tenants;
- if idle, ask the player server boundary for authoritative playback; the server performs the atomic claim;
- if playing, the notification must not replace/reload the current video.

Recovery if Realtime is unavailable or an event is missed:

- slow polling through the server boundary while idle only, for example every 10-30 seconds;
- no aggressive polling during active playback;
- no polling loop that can promote rows concurrently without the atomic claim function.

## YouTube IFrame Player Constraints
Relevant official docs:

- YouTube IFrame Player API reference: https://developers.google.com/youtube/iframe_api_reference
- YouTube embedded player parameters: https://developers.google.com/youtube/player_parameters

Important limitations for this POC:

- The IFrame API controls an embedded player via JavaScript and reports state changes through events.
- `onStateChange` reports `ENDED` as state `0`, which is the trigger for `mark played -> claim next`.
- The player can load videos and call `playVideo`, but browser autoplay policies may block autoplay until the TV browser has had a user gesture or the player is muted/allowed.
- Embedded players have minimum size requirements and should be shown in an embedded page context.
- Some videos may be unavailable, region-restricted, age-restricted or not embeddable; these must become `failed` and not block the queue.
- The POC must not assume every YouTube search result is playable in an embed.

Operational expectation:

- opening the TV route may require one initial `Iniciar player` gesture if the browser blocks autoplay;
- after that, the player should advance automatically through queued items when the IFrame API permits.

## Client Request Flow
Reuse POC 1 where useful:

```text
search -> results -> select -> request
```

Changes from POC 1:

- no `playlistItems.insert`;
- create `music_requests` queue row instead;
- success copy: `Musica adicionada a fila`;
- request payload should include only YouTube metadata needed for the row, and the server must derive the tenant from slug.

Minimum client-submitted fields:

```text
youtube_video_id
title
channel_title
thumbnail_url
```

No client-submitted `establishment_id`, `status`, timestamps or playlist ID.

## Failure Handling
Request creation failure:

- show a controlled error;
- do not expose Supabase or YouTube internals.

Playback error:

- mark current row `failed`;
- store a short non-secret `failure_reason`;
- claim next queued row;
- continue playback if possible.

Function/RLS failure:

- fail closed;
- do not promote a row cross-tenant;
- do not allow anonymous users to update arbitrary rows.

## Implementation Checkpoints
The architecture is approved. Continue from existing drafts; inspect and reconcile interrupted work rather than restarting. These checkpoints are the canonical implementation sequence referenced by TASK-061.

1. Migration and RLS
   - inspect the drafted table, RLS, public creation RPC and lifecycle functions;
   - remove/restrict broad direct update paths;
   - preserve the partial unique index, serialize FIFO claims and validate current-request events;
   - verify tenant isolation, stale events and concurrency with SQL tests.

2. Server boundary
   - add validation for queue request payload;
   - resolve establishment by slug;
   - create queued request rows only through the narrow RPC;
   - establish the POC player-key/HttpOnly authorization boundary without an admin session;
   - expose only bootstrap/state and validated ended/error operations.

3. Public request UI adaptation
   - reuse POC 1 search/select UI;
   - change submit path to queue creation;
   - change success copy to `Musica adicionada a fila`.

4. Experimental TV player
   - add `/{slug}/musicas/player`;
   - load IFrame API;
   - claim/recover current row;
   - handle `ENDED` and error transitions;
   - show only video/now-playing or the centered WAITING identity/message;
   - allow one initial activation gesture and refresh recovery.

5. Realtime/idle recovery
   - subscribe to a scoped wake-up signal;
   - wake idle player on new queue rows;
   - add slow idle recovery only if necessary for unavailable/missed Realtime notifications;
   - never interrupt active playback on a queue notification.

6. Verification and manual-validation handoff
   - run SQL tests, relevant application tests, lint, typecheck and build; record actual results/blockers;
   - synchronize TASK-061 documentation/status and stop at READY_FOR_MANUAL_VALIDATION;
   - run the exact phone A / phone B / TV scenario plus playback-error recovery before declaring POC success.

## Conflicts and Adjustments
- The production contract still requires implemented abuse controls and minimal administrative operations before public launch. POC 2 remains experimental and does not satisfy TASK-054 through TASK-058 release gates.
- Public anonymous writes are riskier than previous public reads. Keep the route unlinked, use strict RLS/RPC boundaries and do not promote this to production without abuse controls.
- Public request creation uses only `create_music_request`; no direct anonymous insert/update/delete is granted on `music_requests`.
- Player lifecycle transitions are separated from request creation and must not be available to the phone request UI.
- The YouTube persistent playlist from POC 1 must not determine playback order.
- Realtime is preferred, but atomic database functions remain the source of correctness.
- The TV is a playback terminal without an admin session, direct updates, queue lists or human management controls.

## Stop Rule
After implementation/checks, stop for manual validation and report READY_FOR_MANUAL_VALIDATION; do not declare SUCCESS based on automated tests. Stop after the first successful manual POC 2 scenario or hard blocker and report findings. Do not continue to another product task or add fallback music, admin tools, moderation, analytics or production Hub activation.

## Implemented Boundary and Local Setup
The server API is `POST /api/youtube/poc/player`, with operations `state`, `ended` and `error`. It returns only current request ID/video/title/channel and an opaque Realtime topic, never queue history. The setup form is server-handled; its signed tenant-bound HttpOnly session lasts 12 hours. Rotate `YOUTUBE_POC_PLAYER_KEY` to invalidate issued sessions. The raw setup key stays out of URLs and serialized application JavaScript. This remains POC-only device/player authorization.

The server-only `SUPABASE_SERVICE_ROLE_KEY` credential is required for scoped player RPCs; the browser uses only the publishable key for empty wake-up broadcasts. This deliberate POC exception is recorded in ADR-018. `private.music_player_topics` stores non-public topic identifiers, and a queue-insert trigger broadcasts `{}` / `wake`. Public topics convey no request rows or lifecycle privileges. The terminal resolves every wake-up through the authorized API and ignores wake-ups while playing. Idle/transient-delivery recovery runs at 15-second intervals, never during healthy playback. Reuse one IFrame between tracks; retain failed technical-event delivery for safe retry.

Setup before the manual scenario:

1. Migrations `20260930000000_music_queue_poc.sql` and `20260930000001_music_player_boundary.sql` were applied atomically to production on 2026-09-30 with explicit user authorization and recorded migration history. Production is the current POC target because development is paused. Do not deploy the first draft without the boundary migration; the production application remains unlinked from the Hub.
2. Configure `.env.production.local` with the matching public Supabase configuration, server-only `SUPABASE_SERVICE_ROLE_KEY` (a modern secret key is supported) and a random `YOUTUBE_POC_PLAYER_KEY` of at least 32 characters. Both player values are now configured. Retain POC 1 YouTube search credentials. Restart after configuration changes.
3. Start the local development UI against production with `node -e "process.loadEnvFile('.env.production.local'); require('node:child_process').spawn(process.execPath,['node_modules/next/dist/bin/next','dev'],{stdio:'inherit',env:process.env});"`. Do not pass `--env-file` to the Next dev CLI; it can propagate the flag into unsupported `NODE_OPTIONS`. Open `http://localhost:3000/relicas/musicas/player` (or the terminal's reported port). Enter the player key only in the setup form; no admin login is needed. Use browser fullscreen if desired.
4. Activate `INICIAR PLAYER` once if required. If browser policy still requires gestures between tracks, record a failed/manual blocker rather than claiming POC success.
5. Phones use `http://<TV-computer-LAN-IP>:3000/relicas/musicas/poc` (or the same deployment URL) on the same reachable server. `localhost` on a phone refers to the phone, not the TV computer. `next.config.ts` explicitly allows the current trusted LAN origin `192.168.1.7` through `allowedDevOrigins`; if the computer's IP changes, update that entry and restart Next. After a restart, reload the phone page to discard stale development assets. Keep local setup limited to the trusted POC environment; deployment uses HTTPS/Secure cookies.

## Verification and Pending Manual Validation
- User follow-up (2026-09-30): player playback and phone search were reported working; Safari does not show the Chrome-only hydration warning. This is partial manual evidence, not confirmation of the full Success Scenario. The user subsequently authorized separate production tasks under `docs/MUSIC_PRODUCTION.md`; this experiment remains unlinked and its outstanding manual criteria remain open.
- Application checks: unit tests, lint, typecheck and production build pass. HTTP smoke checks cover missing/forged authorization, cross-origin calls, malformed events, client tenant fields and retired generic lifecycle endpoints.
- SQL: isolated PostgreSQL passes RLS/grants, lifecycle, FIFO, non-interruption, inactive tenants, stale/cross-tenant events, history exclusion and eight concurrent claim/ENDED calls. Supabase Auth and `realtime.send` are modeled locally; this does not validate hosted WebSocket delivery.
- Initial hosted SQL inspection targeted the now-paused development project and timed out. Production connection was subsequently confirmed; both migrations were applied atomically on 2026-09-30 after user authorization, with history recorded and cache reloaded. Production table/API and RPC visibility checks pass; anonymous/member direct UPDATE and claim remain denied. Matching server/player keys are configured in `.env.production.local`. This is not yet a manual playback success result.
- Manual result: PARTIAL (user reports working playback and phone search). Full scenario evidence is still pending. Execute the exact Success Scenario with Phone A, Phone B and the TV, plus an unembeddable/unavailable request followed by a playable request. Confirm database statuses and that no human interaction is needed between tracks. Also refresh once to confirm recovery of the current playing request, then return to the exact scenario from an empty active queue.
- Known limits: one intended TV terminal per establishment; no device lease, timestamp resume or stale-playing timeout. Refresh restarts the current video. Session authorization expires after 12 hours. An IFrame API/network loading failure retains the playing row for recovery and may require reopening the terminal. Abuse protection and final device authorization remain later production design work.
