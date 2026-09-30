# YouTube Music Requests POC

**Status:** PARTIAL
**Owner:** Relica's Digital Hub
**Branch:** `poc/youtube-music`
**Production feature:** No
**Hub visibility:** No

## Context
Relica's currently uses YouTube as the music source in the bar. The responsible person chooses videos on a phone and plays them on the establishment TV.

This experiment validates whether a customer can search YouTube from an experimental Relica's page, choose a video and have the backend add that video to a YouTube playlist controlled by the bar.

This POC is not the definitive Music Requests architecture.

## Success Criterion
The POC is technically successful when this flow works end to end:

1. Open `/{slug}/musicas/poc` on a phone.
2. Search for a song, for example `Deftones Change`.
3. See real YouTube results.
4. Select a result.
5. Tap `Pedir musica`.
6. The backend calls `playlistItems.insert`.
7. The configured YouTube playlist contains the selected video.

When this works once, stop development and document the result.

## Explicit Non-Goals
- No playback.
- No TV player.
- No YouTube IFrame Player.
- No realtime synchronization.
- No Supabase tables.
- No `music_requests` table.
- No request history, voting, ranking or queue position.
- No customer authentication.
- No cooldown, blacklist or advanced rate limiting.
- No admin panel.
- No public Hub integration.
- No analytics.
- No multi-establishment support.
- No generic `MusicProvider` abstraction.
- No POC 2 functionality.

## Experimental Routes
Frontend:

```text
/{slug}/musicas/poc
```

Internal API:

```text
GET  /api/youtube/poc/search?q=...
POST /api/youtube/poc/request
```

Temporary local-only OAuth bootstrap:

```text
GET /api/youtube/poc/oauth/start
GET /api/youtube/poc/oauth/callback
```

The route is intentionally not linked from the public Hub.

## YouTube API Usage
Use YouTube Data API v3:

- `search.list` for search.
- `playlistItems.insert` for playlist insertion.

Current official quota interpretation for this POC:

- `search.list` uses the separate default quota of 100 `search.list` calls per day, with each request consuming 1 call from that search bucket.
- `playlistItems.insert` costs 50 units from the general quota.

Do not document or treat `search.list` as costing 100 general quota units per request.

References:

- https://developers.google.com/youtube/v3/docs/search/list
- https://developers.google.com/youtube/v3/docs/playlistItems/insert

## Environment Variables
The POC reads configuration server-side:

```env
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=
YOUTUBE_PLAYLIST_ID=
```

`YOUTUBE_REFRESH_TOKEN` in `.env.local` is acceptable for this POC only. This is not the intended production OAuth architecture. A production Music module must use a safer authorization/storage lifecycle before public writes are enabled.

Never commit real credential values.

To obtain the POC refresh token locally, open:

```text
http://localhost:3000/api/youtube/poc/oauth/start
```

The callback exchanges the authorization code server-side and writes/updates `YOUTUBE_REFRESH_TOKEN` in `.env.local`. The token is not shown in the browser response.

## Security Rules
- Never send OAuth credentials, refresh tokens or access tokens to the browser.
- Never accept `playlistId` from the client.
- `YOUTUBE_PLAYLIST_ID` always comes from server-side configuration.
- `POST /api/youtube/poc/request` accepts only `videoId`.
- Validate `videoId` format server-side.
- Reject unexpected request fields.
- Log no full tokens.
- Keep all YouTube-specific experimental code under `youtube-poc` naming.

## Search Quota Protection
The experimental UI protects search quota by:

- requiring at least 3 characters;
- avoiding searches on every keystroke;
- using an explicit `Buscar` button as the search trigger;
- keeping the result count small.

## User-Facing Error Handling
Do not expose raw YouTube or OAuth errors.

Controlled cases:

- search unavailable;
- invalid or missing video;
- `videoAlreadyInPlaylist`;
- playlist insertion failure.

## Manual Tests
### Test A - Search
Search `Deftones Change`.

Expected: real YouTube video results appear.

### Test B - Insertion
Select one result and submit.

Expected: the video appears in the configured `Relica's - Pedidos POC` playlist.

### Test C - Error
Simulate API failure or missing credentials.

Expected: the UI presents a controlled error message.

### Test D - Security
Inspect browser bundle/network.

Expected: no OAuth secrets or private tokens are exposed.

## Result
Status: `PARTIAL`

### Worked
- Experimental route `/{slug}/musicas/poc` builds successfully.
- Search UI requires at least 3 characters, uses an explicit `Buscar` button and uses a small server-side result limit.
- Internal API routes were added for YouTube POC search and playlist insertion.
- `POST /api/youtube/poc/request` accepts only `videoId`; `playlistId` always comes from server-side configuration.
- `videoAlreadyInPlaylist` is mapped to a controlled user-facing state.
- No Supabase tables or Hub integration were added.

### Did Not Work
- End-to-end YouTube validation was not run because the required local OAuth/playlist environment variables are not configured.

### Limitations Found
- The POC depends on a manually created YouTube playlist and a Google OAuth refresh token with permission to insert playlist items.
- The refresh token in `.env.local` is acceptable only for this POC and is not the intended production OAuth architecture.

### Quotas / API
- The POC documents `search.list` using the separate default quota of 100 search calls per day, with each request consuming 1 call from that bucket.
- `playlistItems.insert` is documented as costing 50 units from the general quota.

### OAuth
- Blocked pending `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` and `YOUTUBE_PLAYLIST_ID`.

### UX
- Minimal mobile-first UI exists for search, selection, submit, loading, success, duplicate and error states.

### Observations
- Checks passed before stopping: focused YouTube POC tests, full Node test suite, lint, typecheck and production build.

## Stop Rule
Stop when `search -> select -> request -> playlistItems.insert` is validated end to end, or when blocked by OAuth/credentials. Report the result before continuing beyond that point.
