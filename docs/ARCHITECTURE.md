# Architecture

## Goals
Keep the Bar Hub concrete, secure, mobile-first and ready for a second establishment without prematurely building a generic CMS or SaaS module platform. Preserve the existing menu and admin foundation as the first module.

## Stack
This is the target stack. Add dependencies only when the active backlog task needs them; documented future dependencies do not belong in the bootstrap by default.

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase: Postgres + Auth + Storage
- Zod
- React Hook Form where client form state benefits from it
- Vercel

## Rendering/data strategy
- Prefer Server Components for initial public/admin data reads.
- Use Client Components only for interactive behavior such as category scrolling, search UI, toggles, drag/reorder and forms where needed.
- Mutations should execute on the server boundary and validate input with Zod.
- Revalidate/invalidate affected views after mutations so admin changes become visible predictably.

## Route plan
Public:
- shared host `/[slug]` — establishment Hub
- shared host `/[slug]/cardapio` — public menu
- shared host `/[slug]/agenda` — Agenda when implemented
- shared host `/[slug]/musicas` — Music Requests when implemented
- custom host `/`, `/cardapio`, `/agenda`, `/musicas` — equivalent clean routes after domain cutover

Admin:
- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/events` — Agenda list
- `/admin/events/new` — event creation
- `/admin/events/[id]` — event editing, flyer and delete
- `/admin/music` — operational Music queue when implemented
- `/admin/settings`
- `/admin/account`

Exact route grouping may use App Router route groups without changing public URLs.

Until `relicas.com.br` is acquired and configured, development continues on the shared-host `/relicas` routes. Domain acquisition blocks only canonical-host cutover and permanent QR generation, not Hub, Agenda or Music implementation.

Custom-domain tenant resolution must happen server-side from a normalized, allow-listed host associated uniquely with an active establishment. Unknown hosts fail closed. Shared-host routes resolve by slug. Neither host headers supplied through client forms nor arbitrary establishment IDs are authorization boundaries; admin authorization continues to derive from authenticated membership and RLS.

## Suggested source organization
```text
src/
  app/
  components/
    menu/
    admin/
    ui/
  lib/
    supabase/
    validation/
    auth/
  types/
supabase/
  migrations/
  seed.sql
```

Do not create abstractions before they have a concrete use.

## Tenant boundary
All tenant-owned records use `establishment_id`. Admin authorization must derive accessible establishments from the authenticated user, not from arbitrary client input.

`establishment_users` supports multiple establishments per user. In the MVP, a user with exactly one membership uses that establishment automatically. Every admin operation resolves and verifies membership server-side, with RLS enforcing tenant isolation. Multiple-membership selection UI is out of scope; do not silently select an establishment when more than one membership exists.

Product/category tenant integrity is enforced in Postgres with a unique `(id, establishment_id)` constraint on categories and a composite foreign key from products `(category_id, establishment_id)` to categories `(id, establishment_id)`.

## Supabase clients
`src/lib/supabase/client.ts` creates the browser client and `src/lib/supabase/server.ts` creates a request-scoped server client with cookie access. `src/lib/supabase/public.ts` creates a cookie-free anonymous server client for public menu reads, so an admin session cannot narrow visibility on another establishment's public route. All three use the publishable key, so RLS applies to their queries. No privileged Supabase client is part of the MVP foundation.

`src/proxy.ts` runs only on `/admin/:path*`, refreshes expired sessions and performs an optimistic redirect to `/admin/login` when no signed claim is available. The public menu stays outside this Proxy. Proxy is not an authorization boundary: protected Server Components and every future admin mutation must call the server-only access layer, which validates the user with Supabase Auth, derives membership from `establishment_users` and relies on RLS as the final tenant boundary. The browser never chooses the resolved `establishment_id`.

`src/lib/auth/get-admin-access.ts` permits tenant data only when the authenticated user has exactly one membership. Zero memberships produce an access-not-configured state; multiple memberships produce a future-selection state without selecting either tenant. Multi-establishment selection remains outside the MVP.

Protected admin pages live under the URL-neutral `src/app/admin/(protected)` route group. Its shared layout calls `getAdminAccess` before rendering the dashboard shell, so the dashboard and all management destinations inherit the same server-side session and membership boundary. The shell provides navigation only; each later mutation must still perform its own membership check.

### Unified admin information architecture
Menu, Agenda and Music share one authenticated Admin shell and one server-resolved establishment context. They do not share domain models or become one generic CRUD surface. Organize navigation into:

- Overview — status summaries and shortcuts, never every module's forms;
- Menu — Products and Categories;
- Agenda — Events;
- Music — live request/moderation queue;
- Establishment — public identity and appearance;
- Account — personal authentication and security.

On desktop, groups live in the existing compact sidebar. On mobile, the shell exposes a compact navigational surface while preserving the current work area and establishment identity. Module links are added only after the corresponding feature is implemented.

Each domain owns its loaders, validation schemas, Server Actions, database tables and focused tests. Shared infrastructure is limited to the admin shell, UI primitives, `getAdminAccess`, Supabase clients and common error conventions. Every mutation resolves membership independently and relies on its resource RLS policy. Do not create separate logins, separate admin applications, a generic modules table, a page builder or an all-in-one management screen.

### Agenda domain
Agenda owns `public.events` and does not reuse categories, products or a generic content table. Each event belongs directly to one establishment and carries title, optional description, start/end instants, optional media/CTA references and explicit publication state. Postgres rejects blank titles and inverted time ranges.

Anonymous Agenda reads use the cookie-free public client and rely on RLS to expose only active events of active establishments. Date filtering and chronological grouping belong to the public Agenda loader, not to the RLS policy. Admin loaders and every event mutation must resolve membership server-side, scope by both event and establishment IDs where applicable, and retain RLS as the final tenant boundary.

`src/lib/agenda/load-public-agenda.ts` keeps Agenda reads separate from Hub and menu reads. Its pure resolver retains upcoming and currently running events, orders by start time, requires persisted media defensively and strips non-HTTP(S) external links. The direct `/{slug}/agenda` route owns its loading, empty and error states. The Hub uses a lightweight Agenda availability read rather than composing the full public Agenda payload.

TASK-048 creates no public route or admin navigation item. TASK-051 adds the dedicated `event-images` bucket before either interface: event rows begin as drafts, media paths encode tenant plus event ownership, and the database requires a flyer/banner before `active` can become true. Public and admin surfaces remain owned respectively by TASK-049 and TASK-050, so an unfinished Agenda module never appears in the Hub or Admin.

### Development administrator bootstrap
The MVP has no public sign-up. For development, create the initial administrator manually in Supabase Dashboard through `Authentication > Users > Create new user`, with an email and password. Do not add a secret/service-role key to the application for this bootstrap.

The Auth user and its establishment membership are separate records. After the user exists, provision its initial `establishment_users` row from a trusted database/admin context with `supabase/bootstrap/014_initial_admin_membership.sql`. Custom SMTP and email-invitation onboarding are future capabilities because new Free-tier Supabase projects do not support customizing Auth email templates with the default SMTP provider.

The protected account page changes passwords without email delivery. Its Server Action resolves authorized admin access, validates the current password through `signInWithPassword`, applies the new password with `updateUser`, and revokes other refresh-token sessions while preserving the current session. Application validation requires letters, numbers and at least 12 characters; hosted Supabase Auth independently enforces the 12-character minimum. Password values are never persisted or returned in action state. Self-service recovery remains deferred until production SMTP is configured.

Basic establishment settings load and update only the server-resolved membership record. Name, logo and normalized optional Instagram/WhatsApp contacts are editable; the slug remains read-only because it is the permanent QR destination. Public contact links are constructed from normalized values rather than accepting arbitrary URLs.

## Public Hub and menu data
`src/lib/hub/load-public-hub.ts` loads only active public establishment identity and already-supported public links through the cookie-free anonymous client. It selects name, slug, logo and approved contacts from `establishments`; it does not query categories or products. Module links appear only when their implementation and required data are genuinely available. Agenda is exposed from the Hub only when the active establishment has at least one public, current or upcoming published event with media.

`src/lib/menu/load-public-menu.ts` resolves an active establishment by slug and returns active categories with their active products in position/ID order. The anonymous RLS policies also enforce active parent records. Featured items are selected from those visible category products and repeated in a compact section while remaining in their category lists. Unavailable active products remain visible with an `Esgotado` label in both contexts.

The server page passes this public, active-only menu data to `MenuCatalog`, a Client Component that filters in memory by normalized product name or description. Search makes no new Supabase request. The category navigation and featured area derive from the same filtered categories, so status and grouping remain consistent; an empty query restores the original data.

## Images
Product images live in Supabase Storage. Store paths/URLs in the product record according to the storage implementation chosen in the relevant task. Images are optional and should be optimized in delivery.

When `products.image_url` is null, the public list displays the local neutral `public/images/categories/generic.webp` thumbnail as an empty state. This does not write a fallback URL to the product record and is replaced automatically by a real product image.

The public product list uses `next/image` with a remote pattern limited to the configured Supabase Storage origin (`/storage/v1/object/**`). Establishment logos use the same restricted Storage origin. Relica's uses `public/images/logo/relicas-logo.jpg` only when `logo_url` is null; other tenants never inherit that asset.

Uploaded establishment logos live in the public `establishment-images` bucket at `<establishment_id>/logo/<version>.<extension>`. Storage writes require current membership for the path tenant, while the settings Server Actions independently resolve the establishment and handle replacement/removal rollback. Removing a persisted Relica's logo restores its local fallback.

The Relica's Hub and menu shell currently use the optimized local `public/images/menu-editorial.webp` as a temporary, explicitly illustrative hero. It is scoped to the `relicas` slug so another tenant never inherits Relica's imagery. The Hub treats it as decorative media behind a solid dark readability layer, while the establishment logo remains the identity signal. A future establishment setting can replace it with approved media; do not add a Storage field or uploader until that task. `tests/fixtures/images/fries.webp` is a development-only image fixture for responsive product-list checks, not public menu data and not an automatic product fallback.

Category navigation prefers nullable `categories.image_url` media from the public `category-images` bucket. When null, it uses optimized local illustrations in `public/images/categories/` for Relica's initial category slugs; a neutral image covers new categories and other establishments. Category names and ordering remain database-driven. Upload, replacement and removal resolve the tenant server-side and use paths containing the establishment and category IDs.

## Error handling
Expected validation/auth failures should produce user-friendly UI. Unexpected failures should not expose secrets or raw database errors to users.

`src/app/[slug]/loading.tsx` and `error.tsx` cover establishment Hub loading/failure. The nested `src/app/[slug]/cardapio/` route owns the menu skeleton and retry state. `MenuCatalog` distinguishes no categories, no products across all categories, an individual empty category, and search with no matches. These states do not require database writes or a public account.

The Hub and menu loaders intentionally remain separate: Hub reads must stay lightweight as Agenda and Music destinations are added, while the menu loader owns catalog composition.

## Experimental Music TV player (TASK-061)
The canonical contract is `docs/experiments/YOUTUBE_MUSIC_QUEUE_POC.md`. Supabase owns the ephemeral queue; the TV at `/{slug}/musicas/player` renders video only. POC 1 playlist/OAuth code remains isolated and preserved.

The setup Server Action verifies `YOUTUBE_POC_PLAYER_KEY` and issues a signed, tenant-bound, 12-hour HttpOnly cookie. `/api/youtube/poc/player` accepts only state, ended and error operations, rejects cross-origin/malformed/unauthorized calls, rechecks the active tenant and returns minimal playback instructions. The TV needs no admin session. A server-only `SUPABASE_SERVICE_ROLE_KEY` client is a deliberate POC exception to the baseline's publishable-only clients; it calls restricted database RPCs and never ships credentials or admin capabilities to the browser.

Lifecycle RPCs serialize on the establishment row. `advance_music_player` validates the current request, transitions it and claims next in one transaction. Public/authenticated browser roles have no lifecycle execution or direct table-update privilege. The TV's independent anonymous Realtime client listens on an opaque topic for empty wake-up broadcasts; the backend remains authoritative. Slow 15-second idle/event-delivery recovery never polls healthy active playback. The same IFrame instance is reused between tracks to preserve initial activation.

Tests: `node --test tests/*.test.mjs`; `node tests/run-music-queue-local.mjs` for isolated PostgreSQL assertions and concurrent claims/events (requires PostgreSQL binaries; models Supabase Auth/Realtime functions locally); hosted SQL requires separate confirmed-target approval. Historical POC HTTP checks use `node tests/music-player-http-smoke.mjs` only against local development on port 3100, with production Music disabled. TASK-055 closes all POC endpoints in built/hosted environments. Manual multi-phone/TV validation remains mandatory before POC success.

## Production Music design (TASK-053)
The approved direction and implementation contract are in `docs/MUSIC_PRODUCTION.md`. TASK-054 adds local production migrations/RPCs and isolated tests, not remotely deployed capabilities. They extend the existing FIFO/database-owned lifecycle rather than introducing a second queue. Production replaces the POC global key with tenant-scoped pairing, revocable HttpOnly device sessions and a single fenced playback lease. Browser technical events must match both lease and playback generations, including refresh of the same request. The TV never becomes an admin client.

Narrow server-only RPC wrappers may use a privileged client solely for validated Music operations; browser clients never receive that credential. Device/visitor authentication and membership-scoped admin RPCs remain separate. Persistent database limits and revocation of public POC admission execution prevent bypass of the HTTP boundary. Customer INSERT wakes never interrupt active tracks, while authenticated admin instruction wakes must re-resolve state even during playback. Module availability and request admission are separate default-OFF controls.

Release TASK-058 owns HTTPS Preview, manual evidence, commercial/policy review and explicitly approved production deployment. Do not expose the Hub link until those gates pass; preserve Menu/Agenda. POC setup/mutation routes must not remain an alternative public production boundary.

Database implementation and RPC grants are documented in `docs/DATABASE.md`. TASK-055 implements trusted token/visitor/network digests, cookie/consent checks, server metadata/embeddability validation and reserved quota calls. A stable per-tab instance and new refresh boot nonce fence playback; bootstrap retries retain their boot nonce. Ordinary reads never restart the instruction. Pairing is readiness-independent, but customer admission requires a ready, live TV. Apply production migrations only alongside the compatible application; old POC callers intentionally lose RPC access.

### Production Music application (TASK-055, protected Preview)
TASK-057 adds tenant-bound signed TV cookies (cheap forged-cookie rejection before RPC, authoritative database revocation still mandatory) and five-second stalled-body cancellation. Review evidence and remaining actual-host/manual gates are in `docs/experiments/MUSIC_PRODUCTION_SECURITY_REVIEW.md`; release preparation is `docs/MUSIC_RELEASE_RUNBOOK.md`. This does not replace database fencing or authorize deployment.

`/{slug}/musicas` and `/privacidade` are unlinked, feature-gated routes. `/api/music/public` accepts only consent/search/request, with strict bounded bodies, configured-origin checks, versioned HttpOnly visitor consent and server-authoritative metadata/receipts. Read-only `YOUTUBE_MUSIC_API_KEY` is independent of OAuth/playlist. Signing/network HMAC uses independent `MUSIC_SESSION_SECRET`; trusted network identity comes only from Vercel's dedicated provider header, or an explicit fixed local development identity. Other hosting fails closed until a trusted adapter is approved. Never use browser Host/XFF as authority.

`/{slug}/musicas/player` pairs through a native Server Action; `/api/music/player` only dispatches validated state/heartbeat/technical events to fixed RPCs. Production replaces the POC cookie/key. HttpOnly Secure SameSite=Strict cookies do not grant admin access. Web Locks prevent cloned tabs sharing an instance; the TV requires HTTPS/localhost and Web Locks support. Heartbeat every 20 seconds, conservative local stop after at most 85 seconds without renewal, serialized exact-generation event retries and 15-second failure recovery preserve database-owned playback. Anonymous opaque Realtime wakes remain hints: INSERT never replaces a playing video; instruction re-resolves even during playback.

Supabase Cron is the approved hourly scheduler. The trusted operator applies `supabase/operations/music-cleanup-cron.sql` after backup and compatible migrations; one named job calls `public.music_cleanup()` directly with bounded timeouts, no bearer secret or browser scheduler privilege. Vercel has no duplicate cron. `/api/music/cleanup` remains an optional server-only `CRON_SECRET` protected manual fallback. Migration `00005` provides conservative 29-day metadata/receipt and 23-hour rate thresholds; monitoring must detect failed/missed runs. TASK-058 still owns hosted execution, quota, secret and manual validation before publication.

Run `node tests/music-production-http-smoke.mjs` after `npm run build`: it launches a temporary loopback built server with fake credentials and a preload blocking all remote fetches. It covers consent, pairing Server Action, cookie attributes, search/metadata/receipts, events, cleanup authorization, rendered UI and hosted POC closure. Repeat with `--disabled` to verify the default-OFF boundary and absence of the legacy bypass. `tests/music-production-*.test.mjs` cover pure security/lifecycle and lightweight SSR/mobile-style checks. Actual browser layout, autoplay, Web Locks, Realtime and multi-phone endurance remain TASK-058 gates, not fixture-proven behavior.

`node tests/run-music-queue-local.mjs --production` tests the additive baseline, private resources, narrow grants, admin tenant membership, pairing/expiry, offline recovery, stale generations, retry/capacity/limits/quotas and concurrent production events. Set `PG_BIN` when PostgreSQL binaries are outside the runner's Windows PostgreSQL 18 default. The runner never loads `.env` or connects to a remote database.

## Testing strategy
Production Admin Music (`TASK-056`) lives at `/admin/music` inside the existing protected shell. Loader and every action independently resolve exactly one authenticated membership, then use the request-scoped publishable client/JWT and fixed `music_admin_*` RPCs. The TV/service client cannot execute the membership-only snapshot. The snapshot serializes on the tenant and returns only settings, readiness/pairing booleans, current track and FIFO queue (at most the configured maximum of 100), plus an opaque wake topic. It never reveals token/pairing hashes, visitor identities or history. No direct queue UPDATE is introduced.

Admin refreshes from empty Realtime signals and a visibility-aware 20-second recovery timer with five-second coalescing. Skip/remove/revoke/replace require explicit confirmation; stale track IDs produce a refresh-needed message instead of mutating a replacement. Pair codes are shown once only in authorized action state, not URLs, with ten-minute clearing. Configuration remains environment-gated and public Hub activation remains separate. `music-admin-actions.test.mjs`, `music-admin-ui.test.mjs`, SQL `015_music_admin_snapshot.sql` and concurrent admin assertions cover this boundary; actual browser/mobile operation remains a release gate.

Minimum MVP checks:
- lint;
- TypeScript typecheck;
- unit tests for important pure validation/business logic when introduced;
- targeted component/integration tests for critical flows where practical;
- manual mobile smoke test for the MVP acceptance scenario.

Do not introduce a heavy testing stack before a task needs it; when test tooling is added, document the command here.

The public-menu featured selection and search filtering have focused tests in `tests/get-featured-products.test.mjs` and `tests/filter-menu-categories.test.mjs`. Membership cardinality is covered by `tests/resolve-membership.test.mjs`. Run them with `node --test tests/*.test.mjs` on the workspace Node 24 runtime.

Public Agenda result filtering and safe CTA handling are covered by `tests/load-public-agenda.test.mjs`. Event-image validation/path ownership helpers are covered by `tests/event-image-validation.test.mjs`.

The admin product page resolves authorization again in its server-only loader, explicitly scopes category and product reads to the resolved establishment, and hands the safe result to a Client Component for in-memory name search and category filtering. It accepts no tenant identifier from the browser. Filter behavior is covered by `tests/filter-admin-products.test.mjs`.

Product creation uses a Server Action under `/admin/products/new`. The action resolves admin access independently, validates the form with Zod, parses the textual BRL amount into integer cents, verifies the selected active category against both its ID and the resolved establishment, and inserts with the server-derived `establishment_id`. It then revalidates the admin list and public menu. Money parsing and boundary validation are covered by `tests/product-validation.test.mjs`.

Product editing reuses the same form and validation contract at `/admin/products/[id]`. Both its loader and bound Server Action scope the product by `id` plus the server-resolved `establishment_id`; unknown and cross-tenant IDs expose no product data. The update repeats active-category ownership validation and revalidates admin and public views.

The product list exposes availability as a dedicated Server Action rather than requiring the full edit form. It binds the requested next state, resolves authorization again, updates only `available` with both product and resolved-establishment filters, and reports success only after the database confirms a row. Admin and public paths are revalidated after the mutation.

Product removal distinguishes reversible deactivation from permanent deletion. The edit form changes `active` through the existing tenant-scoped update; inactive products remain in admin reads but disappear from the anonymous public query. Permanent deletion is a separate Server Action that reloads the product under the resolved tenant and accepts only an explicit confirmation submitted by the named-product dialog before issuing a tenant-scoped delete.

Category ordering uses the atomic `reorder_category` database function. The function verifies membership, locks the tenant's category rows, swaps the requested neighbor and normalizes every position to a contiguous zero-based sequence. The Server Action supplies only the server-resolved tenant and revalidates both admin and public paths.
