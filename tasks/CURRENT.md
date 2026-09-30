# Current Development

## Active task
`TASK-061 — POC YouTube Music Queue & TV Player` is IN_PROGRESS with validation state READY_FOR_MANUAL_VALIDATION. Approved implementation/checks are complete; stop for manual validation. See `tasks/active/TASK-061-youtube-music-queue-tv-player-poc.md` and the canonical `docs/experiments/YOUTUBE_MUSIC_QUEUE_POC.md`.

## Next READY task
`TASK-053 — Design Music lifecycle, security and abuse controls` remains READY but is intentionally paused during TASK-061. Stop at the POC manual-validation handoff; do not begin another task.

## Status
TASK-061 is the only task IN_PROGRESS; no further implementation task is active. POC success and DONE await manual phone A / phone B / TV validation. Production migrations and player credentials are configured following explicit user authorization; use the production-loading launch command in the canonical specification because development is paused. POC 1 implementation remains preserved; its historical BLOCKED status is not evidence of a current POC 2 failure.

## Rule
TASK-061 is experimental only and must not expose Music in the public Hub. POC 2 may design and, after approval, implement a Supabase-backed ephemeral queue and TV player, but must not add fallback playlists, voting, admin dashboards, analytics, production Music activation or POC 3 behavior. The YouTube playlist from POC 1 must not be used as the playback queue.
