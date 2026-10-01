# Music production — local security review (TASK-057)

2026-09-30, `feat/music-production`. Scope: integrated local TASK-054–056 application and five unapplied production migrations. No live database changes, hosted deployment or external API requests. This is checkpoint evidence, not production/POC SUCCESS or commercial permission.

## Evidence

| Boundary | Reproducible evidence | Local result |
| --- | --- | --- |
| RLS, direct table/RPC/legacy bypass and tenant isolation | SQL `014`/`015`, feature ON/OFF built-server HTTP fixtures | PASS |
| Independent admin membership, fixed mutations, stale/foreign IDs, snapshot privacy | `music-admin-actions`, `music-admin-ui`, SQL `015` | PASS |
| Persistent visitor/network/tenant/project limits, failed pairing, separate quota buckets | SQL `014` plus eight concurrent reservations/admissions | PASS |
| One-playing FIFO, duplicate ENDED, skip/remove races, stale ENDED after skip | PostgreSQL local runner, eight concurrent callers | PASS |
| Two instances, refresh generations, lease loss, revocation/session expiry | SQL `014`, production terminal tests | PASS |
| Independent phones sharing one network | Two different visitor digests, same network digest, both atomically accepted | PASS (simulated) |
| Consent, signatures, configured origin, trusted proxy, malformed/stalled payloads | Security tests and isolated HTTP smoke | PASS |
| Server-only metadata/embedding, receipts before upstream retry, bounded upstream calls | Admission tests and HTTP fixture | PASS |
| Retention, cron authorization and default-OFF/legacy closure | SQL cleanup assertions; HTTP ON/OFF; cron configuration assertion | PASS (not scheduled remotely) |

## Hardening during review

- TV cookie now carries a tenant-bound HMAC signature. Invalid raw/tampered cookies fail before database RPC dispatch; signed sessions still require authoritative database tenant/expiry/revocation and generation validation. Database keeps only the random token digest, not its signature/raw value. Key rotation invalidates cookies; explicit admin replacement/consent may be needed. No shared POC key or browser signing secret.
- JSON reader cancels stalled bodies after five seconds and enforces exact JSON MIME and 4KiB maximum, including absent/forged Content-Length. No slow stream can hold this application parser indefinitely.
- Added concurrent admin skip/remove plus stale technical event tests and legitimate distinct visitor admission on shared Wi-Fi. No public queue/history/private-identity exposure introduced.

## Verification and limitations

Commands: `node --test tests/*.test.mjs` (93 passing cases); `node tests/run-music-queue-local.mjs --production`; lint; typecheck; build; `node tests/music-production-http-smoke.mjs` and `--disabled`; diff whitespace and browser-bundle server-secret-identifier scan.

SQL models Supabase Auth/Realtime and HTTP mocks external fetches. SSR/style tests are not an actual 320px rendering check. Browser locks/autoplay/audio, real Realtime, Proxy/SSR session cookies and forwarded headers on the actual host, admin mobile confirmations, multiple physical phones, long playback and operational cron execution still require TASK-058 evidence. This review does not claim resistance to arbitrary volumetric traffic; platform protection/monitoring must be reviewed before enabling public writes. Browser reset identity is mitigated by network/global caps, not treated as a customer identity guarantee.

No unresolved mutation/tenant/generation bypass was found in the tested local boundary. Release stays OFF until host/manual, quota budget, backup, supported scheduler/monitoring, privacy and commercial venue-rights review are approved. See `docs/MUSIC_RELEASE_RUNBOOK.md` and the canonical `docs/MUSIC_PRODUCTION.md`.
