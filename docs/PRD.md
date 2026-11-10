# PRD — Relica's Rock Bar

**Version:** 3.0 — institutional evolution, 2026-11-10
**Status:** Approved for implementation  
**Platform:** Responsive web, mobile-first  
**Primary users:** bar customers and establishment administrators

## 1. Product vision
Evolve the current app into the institutional website of Relica's Rock Bar. Target `/` introduces the venue, shows, drinks/petiscos, gallery and location. The existing menu remains one action away at `/cardapio`; `/agenda` reuses implemented events. Preserve the shared-host Hub and slug routes. Maurício manages menu/events and approved institutional fields through one mobile-friendly admin. No rebuild, parallel catalog or second login.

This direction is authorized for documentation/backlog preparation; site/schema/deploy changes are not claimed implemented. See [site requirements](site/00-PRODUCT-SPEC.md) and [delivery plan](site/06-IMPLEMENTATION-PLAN.md). Original ZIP assumptions are superseded where audited contracts differ.

## 2. Problem
The physical menu makes price changes, availability updates and catalog maintenance expensive and slow. Customers also lack one reliable destination for the bar's menu, upcoming events and lightweight participation in the venue experience.

## 3. Product outcome
Visitor: `discover venue -> check shows/menu -> find location/contact`.
Existing QR visitor: `open permanent destination -> recognize bar -> choose experience`.
Admin: `sign in -> manage establishment content -> publish`.

The product is an establishment experience Hub, not a restaurant operations platform. The menu remains a presentation/consultation experience without ordering or payment.

## 4. Delivery phases
Phases A–C retain Hub/Menu/Agenda/Music history and contracts. The current delivery track is Phase D; do not repeat completed work or infer Music launch acceptance.

### Phase D — Institutional site (current direction; planned implementation)
- one existing Next.js app, `(site)` routes and shared domain loaders;
- section order: Header/Hero, Agenda, Drinks e petiscos, A Casa, Galeria, Localização, Footer;
- Hero links `Ver agenda` and `Ver cardápio`. The navbar offers `Reserve sua mesa` through the public WhatsApp configured for Relica’s, with the contact section as fallback;
- up to four relevant published events; empty state and isolated section failure;
- `/cardapio` and `/agenda` with all existing slug URLs preserved;
- approved institutional fields editable in existing settings; gallery editing is conditional scope;
- scoped dark editorial/red/paper theme and approved real media before release;
- small verifiable tasks across ten fronts in `docs/site/06-IMPLEMENTATION-PLAN.md`;
- domain/content/assets gate publication, not isolated local work.

### Phase A — Hub Foundation
- the QR destination becomes the establishment Hub;
- the existing menu moves to a dedicated `/cardapio` destination;
- the menu remains reachable in one tap and visually dominant;
- only real, implemented destinations are exposed;
- existing menu, admin, RLS and Storage behavior is preserved.

### Phase B — Agenda
- upcoming establishment events and shows;
- public chronological agenda;
- membership-scoped admin CRUD;
- required flyer/banner for published events and optional external CTA;
- drafts may be saved without media, but cannot become public until an event image is attached.

### Phase C — Music Requests
TASK-058 owner rehearsal exception: user approved Music in Relica's Hub and a Production deployment for testing during construction. This is not public-launch/commercial acceptance or completion. Hub availability is configuration-driven by the global feature flag and anonymous tenant-enabled boolean; backend admission still requires a ready authorized TV. Other tenants default OFF. See the canonical release runbook and recorded decision.

TASK-056 adds local membership-scoped `/admin/music` operations and navigation (pair/replace/revoke, module/admission controls, skip/remove and TV readiness), without enabling Music in the public Hub or changing Menu/Agenda. All production activation gates remain in TASK-058.

- customer YouTube requests in a backend-owned FIFO queue;
- dedicated playback-only TV terminal with automatic sequential playback;
- minimal admin queue operations and revocable device pairing;
- abuse prevention and rate protection designed before public writes;
- explicit copy that requests do not guarantee playback.

The first production release follows `docs/MUSIC_PRODUCTION.md` (TASK-053 through TASK-058), reusing the experimental implementation without treating it as production-ready. Voting, duplicate aggregation, queue reordering and fallback music are excluded. Public activation requires hosted/manual and commercial-review gates; the Music module defaults OFF. TASK-055 implements the unlinked production request/privacy routes and paired TV locally; it does not activate Music or replace the Hub's unavailable Music destination.

## 5. Existing menu contract
### Public menu
- permanent URL reachable by QR code;
- establishment identity;
- a compact editorial menu image; an explicitly illustrative default may be used until approved establishment media is available;
- active categories ordered by position;
- active products grouped by category;
- name, optional description, price and optional image;
- featured products;
- unavailable state shown as `Esgotado`;
- search by product name and description;
- responsive/mobile-first experience;
- loading, empty, search-empty and error states.

The public menu distinguishes an establishment with no active categories, one with categories but no active products, and an individual category without products. Loading preserves the page structure; data failures show a customer-friendly retry without technical details.

### Existing admin contract
- email/password authentication;
- no public administrator sign-up;
- protected admin routes;
- authenticated password change with current-password confirmation;
- product list/filter;
- create/edit product;
- toggle availability quickly;
- activate/deactivate/delete product as defined by implementation task;
- optional product image upload;
- create/edit/reorder/activate categories;
- basic establishment settings.

Basic settings include the public establishment name, replaceable logo and optional Instagram/WhatsApp contacts. The public slug remains permanent and read-only so printed QR codes continue to work.

The MVP account area lets an authenticated administrator replace their password without email delivery. Public sign-up remains disabled. Self-service password recovery and administrator invitations require production SMTP and remain future onboarding capabilities.

The product uses one authenticated Admin per resolved establishment, organized into independent work areas rather than separate admin applications or a single all-in-one management page:

```text
Visão geral
Cardápio -> Produtos, Categorias
Agenda -> Eventos
Música -> Fila de pedidos
Estabelecimento -> Perfil e aparência
Conta -> Senha e segurança
```

The overview provides summaries and shortcuts only. Each module owns its routes, loaders, validation and mutations while reusing the shared shell, membership resolution and RLS boundary. Agenda and Music navigation appears only when those modules are implemented.

## 6. Public routing and domain strategy
Current implemented shared-host routes (preserved):

```text
/relicas            -> Hub
/relicas/cardapio   -> menu
/relicas/agenda     -> Agenda
/relicas/musicas    -> Music Requests, controlled owner rehearsal
```

Planned institutional routes on explicitly approved hosts (local/Preview may precede domain acquisition):

```text
/           -> institutional homepage for Relica's
/cardapio   -> existing menu, institutional navigation context
/agenda     -> existing Agenda, institutional navigation context
```

`relicas.com.br` is the previously proposed domain, not proof of acquisition/DNS. Confirm canonical host before release. Resolve approved hosts server-side; unknown institutional hosts fail closed. Preserve `/[slug]` and check reserved-slug collisions before adding static paths. Initial cutover is additive, without permanent redirects. Later redirects must be host/path-specific and preserve supported query parameters. No global tenant redirect. Music stays on existing slug routes until separate origin/cookie/pairing validation. Verify canonical domain/DNS/routing before permanent QR generation; inventory printed/shared destinations first.

## 7. Explicitly out of scope
Cart, orders from tables, payments/Pix, commandas, kitchen workflow, stock management, fiscal issuance, loyalty, reservations, customer accounts, native apps and delivery integrations.

## 8. Initial categories
The seed data should support the current Relica's structure without hardcoding categories in UI:
- Porções
- Lanches
- Bebidas
- Drinks e Doses
- Cachaças
- Cervejas
- Caipirinhas
- Vinhos
- Whiskies

The approved initial catalog is transcribed from both printed-menu images stored in `docs/cardapio/`. This source governs initial product names, descriptions and prices; later changes are made through the admin.

## 9. Product rules
A product has name, optional description, price, category, optional image, availability, featured state, active state and display position.

Unavailable products remain visible and show `Esgotado` in MVP.

Images are optional. Products without an image show a neutral illustrative empty-state thumbnail, never a generated representation of the specific item.

Generated sample product photography is for development tests only, not an automatic fallback for products on the public menu. Product images shown to customers must be attached to real products and may later be replaced through the admin image flow.

## 10. Category rules
Categories are data, not code constants. Admin can create, edit, order and activate/deactivate them. Public menu shows active categories in configured order.

The public category navigation presents an illustrative image or icon above each category name. Relica's initial categories may use local default artwork; newly created categories use a neutral illustration until category image management is available in the admin. Names and order always come from category data, not the artwork mapping.

## 11. Search
Search should be case-insensitive and match product name and description. Only public/active products should appear. Search UX must not require a page reload. Matching products remain grouped by category, with their featured and unavailable states preserved. Clearing the query restores the full menu; a query with no matches has an explicit empty state.

## 12. QR behavior
The new permanent Relica's QR stores only the verified canonical institutional homepage URL. Existing Hub/menu QR destinations remain compatible and need no replacement solely for content changes. Do not encode menu data or a provisional host as the new permanent asset. TASK-028 stays blocked until domain/routing verification.

## 13. Multi-establishment readiness
Relica's is the first establishment, but tenant-owned resources must use `establishment_id`. Do not build SaaS billing/onboarding in MVP.

The data model supports users belonging to multiple establishments. The MVP automatically resolves the establishment only for users with one membership; selection between multiple establishments is a future capability and has no MVP UI.

## 14. UX principles
- mobile-first;
- speed > clarity > visual effects;
- one-handed use;
- no public login;
- no unnecessary modals/animations;
- readable typography and comfortable touch targets;
- no dependency on color alone for status.

## 15. Legacy Hub regression acceptance scenario
1. Customer opens the retained shared-host `/relicas` Hub route.
2. Customer immediately recognizes Relica's and sees `Cardápio` as the dominant action.
3. Customer opens the existing menu in one tap.
4. Search, categories, prices, images and availability work as before.
5. Customer can return clearly to the Hub.
6. Admin changes a product and the menu reflects the change.
7. No QR replacement is required for future content/module changes.

## 16. Future opportunities — not commitments
Analytics, happy-hour automation, promotions, polls, quizzes, Wi-Fi helper, now-playing integration, call-waiter, ordering, tabs, payments, loyalty, administrator onboarding by email invitation and multi-tenant commercial plans.

## 17. Experimental Music queue and TV player (TASK-061)
TASK-061 is an unlinked POC, not production Phase C activation. Its canonical contract is `docs/experiments/YOUTUBE_MUSIC_QUEUE_POC.md`: the backend/Supabase owns an ephemeral FIFO queue and `/{slug}/musicas/player` is a playback-only TV terminal without an admin session. It uses YouTube IFrame playback and restricted technical-event reporting, waits when empty and adds no fallback music, human queue controls or production Hub link. The multi-phone/TV manual scenario must pass before POC success is declared; automated checks alone do not establish success.

## 18. Institutional acceptance scenario
1. `/` on an approved host identifies Relica's and follows the seven-section order.
2. Agenda and menu are reachable in one action.
3. Current/future published events are consistent across home and Agenda; drafts stay hidden.
4. Maurício edits approved menu/event/institutional content in one admin; tested public refresh needs no deployment.
5. Existing slug routes, tenant isolation, image-free product layouts and Music boundaries remain functional.
6. Record mobile/320px/keyboard, loading/empty/error, SEO and performance evidence.
7. Publish only verified venue facts/assets, after domain, compatibility and recovery gates pass.
