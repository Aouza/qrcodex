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
