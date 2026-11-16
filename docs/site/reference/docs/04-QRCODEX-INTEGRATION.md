# QRCodex integration plan — audit before implementation

## Known context from previous project work
Existing product: **QRCodex**, Next.js App Router + TypeScript + Supabase, with establishment-based tenancy and RLS. Previous route conventions include `/relicas`, `/relicas/cardapio`, `/relicas/agenda`, and admin routes such as `/admin/events`, `/admin/products`, `/admin/categories`. Existing menu tables were described as `categories` and `products` with `establishment_id`. **These are historical project notes, not verified current repository contracts.**

## Non-negotiables
- No rebuild of menu CRUD, no second source of truth, no weakening of RLS.
- Preserve existing QR code destinations and routes unless an approved redirect strategy exists.
- Do not assume QRCodex's internal database is a public API.
- Do not reuse a privileged Supabase service key in the browser.

## Integration options, in recommended order
**A. Public menu link (MVP, safest):** `/cardapio` redirects or links to QRCodex `/relicas/cardapio`; optionally style the entry page and keep return navigation. Fastest, lowest risk; visual continuity limited by existing menu.

**B. Reverse proxy / rewrite:** branded `/cardapio` route points to existing public menu. Validate routing, assets, cookies, CSP, auth and SEO before adoption; avoid assuming a rewrite will work without testing.

**C. Shared UI/data contract:** site renders menu via a versioned, published-only read API or shared package. Requires explicit stable contract, authorization and caching; use only when a unified experience is worth maintenance.

**D. Merge into QRCodex:** if repository audit shows that a single Next.js app can host both the branded homepage and existing menu/admin with minimal risk, consider one deployment. Requires separate migration/rollback plan and approval.

## Event integration
QRCodex has historically included event administration and public agenda. Inspect whether it already meets owner needs; **prefer reuse** over creating new event tables. Map published events into site presentation; validate tenant scoping and publish state.

## Audit checklist
- Locate repository, deployed URLs and active environments.
- Verify public routes, admin routes, schemas, migrations and RLS policies.
- Verify event CRUD, flyer storage, category/product visibility and role management.
- Check current `establishment_id` resolution, published-only reads and cache invalidation.
- Confirm whether QRCodex is to remain independently deployed or become the main app.
- Record chosen integration option in ADR before coding.

## Acceptance tests
- Existing QR links still open menu.
- Product changes in QRCodex appear in public menu.
- Event changes appear on homepage and agenda after expected cache interval.
- Another establishment's records cannot be read or changed through admin.
- Failure of external menu does not break homepage; show useful fallback link.
