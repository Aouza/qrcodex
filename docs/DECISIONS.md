# Decisions Log

## ADR-001 — Prepare tenant boundary from day one
**Status:** Accepted  
All tenant-owned resources reference `establishment_id`. This keeps the Relica's MVP simple while avoiding a database redesign for a second bar. SaaS billing/onboarding remains out of scope.

## ADR-002 — Unavailable products remain visible
**Status:** Accepted  
Active but unavailable products appear in the public menu with `Esgotado` instead of disappearing.

## ADR-003 — No ordering/payment in MVP
**Status:** Accepted  
The MVP is menu presentation and administration only. Cart, table orders, payment and operational restaurant flows are explicitly excluded.

## ADR-004 — QR contains a permanent URL only
**Status:** Accepted  
Menu data is never encoded into the QR. Updating products/prices does not require reprinting QR codes.

## ADR-005 — Currency stored as integer cents
**Status:** Accepted  
Use `price_cents` rather than floating-point monetary values.

## ADR-006 — Categories are database-driven
**Status:** Accepted  
Initial Relica's categories are seed data, not hardcoded UI constants.

## ADR-007 — Enforce product/category tenant integrity in Postgres
**Status:** Accepted  
Categories guarantee uniqueness for `(id, establishment_id)`. Products reference categories through the composite key `(category_id, establishment_id)`, so a product cannot point to another establishment's category even if application checks are bypassed.

## ADR-008 — Defer multi-establishment selection
**Status:** Accepted  
`establishment_users` permits multiple memberships. During the MVP, a user with exactly one membership operates in that establishment automatically; every admin operation verifies membership server-side and RLS enforces isolation. A user with multiple memberships is not assigned an establishment implicitly. Selection UI is a future capability, not part of the MVP.

## ADR-009 — Separate illustrative defaults from product photography
**Status:** Accepted
Use a labeled, generated editorial illustration as a temporary Relica's menu hero while approved establishment media is unavailable. Scope the static fallback to Relica's; other establishments must not inherit it. Keep generated food photos only as development test fixtures; never attach them automatically to public products or imply they depict items sold by Relica's. Product images remain optional and are replaceable through the later admin upload flow. A future establishment setting may replace the editorial hero after its media contract is defined.

## ADR-010 — Illustrative category navigation defaults
**Status:** Accepted
Render a compact category illustration above each category name. Relica's seeded categories use local, optimized artwork matched by slug; categories added later and other establishments receive a neutral illustration. Category identity, order and visibility still come from the database. Persisted category images and replacement controls are deferred to category administration, without changing the schema for temporary artwork.

## ADR-011 — Neutral empty-state thumbnail for products without photos
**Status:** Accepted
Show the generic plate illustration when a product has no `image_url`, preserving list alignment without depicting a specific item. Keep `image_url` null in the database; a real uploaded photo replaces the UI-only fallback automatically. Development food photography must never be used as a product default.

## ADR-012 — Bootstrap the initial administrator manually
**Status:** Accepted
Do not expose public administrator sign-up. During MVP development, create the initial email/password user manually through Supabase Authentication and provision its `establishment_users` row from a trusted administrative context. Do not add a privileged Auth key to the application for bootstrap. Email invitations and custom SMTP are deferred onboarding capabilities because new Free-tier Supabase projects cannot customize Auth email templates with the default SMTP provider.

## ADR-013 — Public product-image bucket with tenant-protected writes
**Status:** Accepted
Product photos are public menu content, so `product-images` uses public CDN delivery. Storage RLS still protects every write and delete through establishment membership plus product ownership encoded in the object path. Versioned object names avoid stale CDN replacement; application rollback and delete cleanup prevent abandoned owned objects where possible without a privileged service-role client.

## ADR-014 — Persist optional category media without removing scoped defaults
**Status:** Accepted
Category images use nullable `categories.image_url` and public CDN delivery from `category-images`, while Storage writes remain protected by membership plus category ownership. A persisted image wins; otherwise Relica's known slugs retain their local illustrations and every other category receives the neutral fallback. This preserves fast defaults without making artwork the source of category identity.

## ADR-015 — Scope the local establishment logo fallback
**Status:** Accepted
Use the approved local Relica's logo only when the `relicas` establishment has no persisted `logo_url`. Uploaded logos use a public Storage bucket with membership-protected writes and take precedence over the fallback. Other establishments receive no Relica's branding and can add their own logo through protected settings.

## ADR-016 — Make the establishment Hub the permanent QR destination
**Status:** Accepted
The menu becomes the first and primary module of a broader establishment Hub. Before custom-domain cutover, the shared host uses `/[slug]` for the Hub and `/[slug]/cardapio` for the menu. After `relicas.com.br` is acquired and verified, `/` and `/cardapio` become canonical for Relica's while shared-host slug routes remain controlled fallbacks. Domain acquisition blocks only cutover and permanent QR generation. Agenda and Music are concrete later phases; do not build a generic module engine.

## ADR-017 — Use one modular Admin shell
**Status:** Accepted
Use one authenticated Admin and one server-resolved establishment context for Menu, Agenda, Music, Establishment and Account. Separate these capabilities into domain-specific routes, loaders, actions, tables and RLS policies; do not combine them into one management screen or create separate admin applications/logins. The overview is summaries plus shortcuts. Navigation exposes a module only after it is implemented. Shared code is limited to the shell, UI primitives, access resolution and common conventions; do not introduce a generic module engine or page builder.

## ADR-018 — POC-only playback terminal boundary
**Status:** Accepted for TASK-061 only
The TV is a playback terminal, not an admin client. Supabase owns queue ordering/state; server-only lifecycle RPCs serialize on the active establishment and validate current-request technical events. Restrict direct authenticated UPDATE and browser lifecycle execution. Use a server-validated POC key to issue a tenant-bound HttpOnly cookie; it grants only playback-state/event capabilities and never admin access.

A server-only service-role Supabase client is permitted for this experiment's scoped RPC boundary; never send its credential to the TV. Anonymous Realtime receives only empty wake-up broadcasts on opaque, server-issued tenant topics. This avoids exposing queue records or giving the TV an admin/JWT role. An exposed/forged wake-up alone cannot transition anything. Initial IFrame activation may need one gesture; reuse the IFrame between tracks. No fallback music or human queue controls are included. This is not the final production device-auth design; the canonical specification and mandatory manual success scenario remain in `docs/experiments/YOUTUBE_MUSIC_QUEUE_POC.md`.

## ADR-019 — Promote the Music queue through explicit production gates
TASK-057 hardening: sign the random HttpOnly TV token with the independent Music secret and tenant context to reject forged cookies before database traffic. The stored random-token digest and authoritative device/lease checks stay unchanged. Body reads are bounded by size and time. These are boundary refinements, not new admin/TV capabilities; local evidence does not establish hosted/commercial release readiness.

TASK-056 implementation note: admin uses publishable/session clients and an authenticated-only snapshot RPC, not private-table SELECT grants or service-role admin operations. Snapshot privacy and atomic consistency preserve the existing tenant/lifecycle boundary. This does not authorize a production rollout.

**Status:** Accepted direction for TASK-053 through TASK-058; schema/application implemented locally, release pending
On 2026-09-30 the user authorized advancing toward production after reporting working playback. Reuse the FIFO queue and playback-only terminal; do not introduce voting/aggregation or treat a working POC as full release evidence. `docs/MUSIC_PRODUCTION.md` owns the first production contract and configurable operational defaults.

Replace shared POC authorization with tenant-scoped single-use pairing, revocable device sessions and one fenced playback lease. Validate playback generation as well as current request to reject stale events after refresh. Server-only privileged Music RPC calls are permitted only behind this narrow boundary; no other module gains service-role access. Administrative human controls use existing membership authentication and narrow membership-checked RPCs, never the TV. Revoke public POC admission and disable hosted legacy mutation/setup endpoints before activation; durable limits cannot be bypassed through direct Supabase RPC access.

Default Music/admission OFF. Only TASK-058 may enable a reviewed deployment after security, privacy/retention, hosted/manual playback, actual API quota and commercial-use review. Preview may mutate production data if configured to use that database; explicit target selection and deployment approval remain required. TASK-061 retains its own incomplete manual checklist rather than being marked successful retroactively.

TASK-054 follow-up: local migrations implement this boundary; no remote application occurred. Also revoke direct service-role queue writes and legacy service RPC execution, keeping owner-only reuse of the POC claim mechanism. Pairing attempts count successes as well as failures so a failed attempt cannot be rolled back by an error return. Quota configuration distinguishes search/video buckets according to current API guidance and defaults both OFF. These defaults are conservative production gates, not automatic configuration of the live POC. New schema must deploy with the compatible TASK-055 application, never alone.

TASK-055 follow-up: production uses an independent consent/signing secret and read-only YouTube API key, configured-origin validation, provider-trusted network HMAC and HttpOnly pairing. Web Locks prevent cloned tabs sharing one instance; unsupported/non-secure TV contexts fail closed. Local POC stays available only in development; all built/hosted POC endpoints are closed regardless of their old key. Hourly cleanup uses conservative 29-day/23-hour thresholds. Monitoring, quota budgets, actual HTTPS browser behavior and commercial/privacy review remain release gates.

TASK-058 scheduler decision (2026-09-30, user-approved): use Supabase Cron rather than Vercel hourly cron or a paid-plan upgrade. Cleanup runs directly in the database through one trusted-owner job, not in a TV/browser session. Closing/crashing the TV does not delete queue/history; lease expiry and retention are distinct. Keep protected HTTP cleanup only as an optional manual fallback. Verify backup/restore before enabling the integration/job, then verify successful runs and failure monitoring before release. No Hub activation or commercial acceptance is implied.

TASK-058 controlled production rehearsal: user explicitly authorized deploying the feature branch to Production and exposing Music in Relica's Hub for an imminent owner test, while the product is under construction and not yet publicly launched. This supersedes the earlier no-Production/no-Hub restriction for this tenant only. No main merge, commercial acceptance, POC SUCCESS or TASK completion is inferred. The production URL is accessible to anyone with the link; not a private Preview. Initial app caps: 80 searches/day (reserve against observed Google limit 100) and 100 metadata calls/day (Google general quota 10,000); costs remain one per respective bucket, existing usage is not reset. Trusted operator initializes these budgets/tenant flags once; subsequent human controls remain membership-authenticated admin RPCs, never the TV. Other tenants remain OFF; retain pending physical/endurance, rights/privacy and monitoring gates before public launch.
