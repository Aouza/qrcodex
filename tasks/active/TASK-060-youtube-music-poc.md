# TASK-060 - YouTube Music Requests POC

**Epic:** Experiments
**Status:** BLOCKED
**Dependencies:** TASK-052

## Objective
Validate whether a customer can search YouTube from an experimental Relica's route and add a selected video to a YouTube playlist controlled by the bar.

## Requirements
- Create `/{slug}/musicas/poc` as an unlinked experimental route.
- Create internal YouTube POC API endpoints for search and playlist insertion.
- Keep all YouTube-specific experimental code under `youtube-poc` naming.
- Keep credentials server-side; do not expose OAuth secrets or tokens to the browser.
- Read `YOUTUBE_PLAYLIST_ID` only from server-side configuration.
- Accept only `videoId` from the request endpoint.
- Require at least 3 search characters, use an explicit `Buscar` action and keep result count small.
- Handle `videoAlreadyInPlaylist` as a controlled user-facing case.
- Do not add Supabase tables or integrate the route into the public Hub.
- Do not implement playback, TV player, queue management, admin, cooldown, blacklist, analytics or POC 2 functionality.

## Acceptance criteria
- [ ] Search returns real YouTube video results for a query such as `Deftones Change`.
- [x] Results display title, channel and thumbnail when search succeeds.
- [x] Selecting a result and submitting sends only `videoId` to the backend.
- [ ] Backend inserts the selected video into the configured playlist via `playlistItems.insert`.
- [x] Duplicate playlist insertion is shown as a controlled case.
- [x] No OAuth credential or token is exposed to the browser by implementation.
- [x] Lint, typecheck and build pass.
- [x] End-to-end result or OAuth/credential blocker is documented in `docs/experiments/YOUTUBE_MUSIC_POC.md`.

## Completion notes
- Implemented the experimental unlinked route `/{slug}/musicas/poc`.
- Added internal API routes `GET /api/youtube/poc/search` and `POST /api/youtube/poc/request`.
- Added server-side `youtube-poc` helpers for OAuth refresh, YouTube search and playlist insertion.
- Search is user-triggered through an explicit `Buscar` button before result selection and `Pedir musica`.
- Added validation tests for search length, minimal `videoId` payload and duplicate playlist error mapping.
- Stopped before end-to-end validation because `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` and `YOUTUBE_PLAYLIST_ID` are not configured locally.
- Checks run: `node --test tests/youtube-poc-validation.test.mjs`, `node --test tests/*.test.mjs`, `npm run lint`, `npm run typecheck`, `npm run build`.
