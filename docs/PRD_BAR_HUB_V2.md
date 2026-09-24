# PRD --- Relica's Bar Hub

**Version:** 2.0\
**Status:** Proposed evolution of the current MVP\
**Product:** Digital experience hub for bars accessed by a permanent QR
Code\
**Platform:** Responsive web, mobile-first\
**Initial establishment:** Relica's\
**Primary users:** bar customers and establishment administrators

------------------------------------------------------------------------

## 0. Purpose of this document

This document supersedes the product framing of **"QR Code → digital
menu"** with **"QR Code → establishment hub"** without discarding the
menu, admin, tenant isolation, security model, production deployment or
database work already implemented.

The menu becomes the first and most important module of a broader
establishment experience.

This PRD also acts as the development tracking contract for Codex. It
separates:

1.  **existing foundation that must be preserved;**
2.  **existing menu/admin work that still belongs to the product;**
3.  **new Bar Hub work to implement now;**
4.  **next modules;**
5.  **future ideas that must not leak into the current scope.**

A task may only be marked `DONE` after its acceptance criteria are
satisfied in the repository.

------------------------------------------------------------------------

# 1. Product evolution

## Previous model

``` text
QR Code
   ↓
/[slug]
   ↓
Digital Menu
```

## New model

``` text
QR Code
   ↓
relicas.com.br/
   ↓
BAR HUB
   │
   ├── Cardápio
   ├── Agenda
   ├── Pedir música
   └── External / informational experiences
```

The permanent QR Code represents the **establishment**, not a specific
feature. A custom establishment domain resolves its tenant from the
request host, so the establishment slug does not need to appear in the
customer-facing URL.

For Relica's:

``` text
https://relicas.com.br/
```

becomes the permanent public hub.

The menu moves conceptually to:

``` text
https://relicas.com.br/cardapio
```

Future modules can use:

``` text
https://relicas.com.br/agenda
https://relicas.com.br/musicas
```

The QR Code must never need to be reprinted when modules, products,
events or content change. It must only be generated after the custom
domain, DNS and production routing have been validated.

------------------------------------------------------------------------

# 2. Product vision

Create a lightweight digital layer for the physical bar experience.

A customer scans one QR Code and gains access to the things that are
useful **while they are at the bar** and to selected content that can
increase return visits.

The product should help an establishment with three jobs:

### Utility

Help the customer find information quickly.

Examples:

-   menu;
-   prices;
-   availability;
-   agenda;
-   bar information.

### Engagement

Give the customer lightweight ways to participate in the venue
experience.

Examples:

-   request a song;
-   vote for already requested songs;
-   future polls or interactive experiences.

### Retention

Give the customer reasons to remain connected to the establishment.

Examples:

-   upcoming shows;
-   Instagram;
-   future opt-in communication or loyalty features.

The product is **not** a restaurant ordering platform.

------------------------------------------------------------------------

# 3. Product principles

1.  **The menu remains the primary action.**\
    Most QR scans at a table are likely to be menu-driven. The hub must
    not make menu access harder.

2.  **One QR, permanent destination.**\
    Relica's QR points to `https://relicas.com.br/`. Shared platform
    domains may continue to use `/[slug]` as a technical fallback.

3.  **Modules are establishment-scoped.**\
    No Relica's content may leak to another tenant.

4.  **Do not build a generic page builder.**\
    Each module is implemented as a concrete product feature until
    repeated patterns justify abstraction.

5.  **Progressive expansion.**\
    The hub may expose only the modules actually supported by that
    establishment.

6.  **Mobile-first.**\
    The primary environment is a phone inside a noisy, low-light venue.

7.  **No fake functionality.**\
    Disabled or future modules must not look interactive.

8.  **Preserve security boundaries.**\
    Browser input never determines tenant authorization.

9.  **No ordering/payment unless a future PRD explicitly changes this
    decision.**

------------------------------------------------------------------------

# 4. Success outcome

## Customer

``` text
scan
  ↓
recognize the bar
  ↓
choose what they need
  ↓
complete the task quickly
```

Examples:

``` text
scan → menu → find beer → see price
scan → agenda → see next show
scan → music → request/vote for a song
```

## Administrator

``` text
sign in
  ↓
manage establishment content
  ↓
publish
  ↓
customer sees the update
```

------------------------------------------------------------------------

# 5. Scope from now on

## Phase A --- Hub Foundation

Implement now:

-   `relicas.com.br/` becomes the public Bar Hub;
-   menu moves to `relicas.com.br/cardapio`;
-   the permanent Relica's QR destination is the custom-domain root;
-   shared-host `/[slug]` routes remain a fallback for establishments
    without a custom domain;
-   menu remains the visually dominant hub action;
-   hub supports only real, available destinations;
-   establishment identity is reused;
-   existing menu/admin functionality is preserved;
-   production redirects/routes are updated safely.

## Phase B --- Agenda

Implement after Hub Foundation:

-   public upcoming events/shows page;
-   establishment-scoped events;
-   admin event CRUD;
-   event activation/deactivation;
-   chronological ordering;
-   optional event image;
-   optional external CTA URL when genuinely configured.

## Phase C --- Music Requests

Implement after Agenda:

-   public music request page;
-   request a song;
-   detect/aggregate repeated requests for the same normalized song;
-   voting/upvoting;
-   admin live request queue;
-   request status/moderation;
-   basic anti-spam/rate protection;
-   clear copy that requests do not guarantee playback.

## Future modules

Not current commitments:

-   polls;
-   quizzes;
-   Wi-Fi helper;
-   promotions/happy hour automation;
-   "now playing" integration;
-   call waiter;
-   loyalty;
-   customer accounts;
-   notifications;
-   reservations;
-   table ordering;
-   payments;
-   tabs/commandas.

------------------------------------------------------------------------

# 6. Explicitly out of scope

The following remain outside the current product scope:

``` text
Cart
Basket
Order
OrderItem
Checkout
Payment
PaymentMethod
Pix checkout
Quantity
Delivery
DeliveryAddress
Kitchen workflow
Fiscal issuance
Stock management
Customer account
Order history
Table order
Comanda
Loyalty
Reservations
Native app
```

The new music-request feature is **not** a food/drink ordering
mechanism.

------------------------------------------------------------------------

# 7. Information architecture

## Public routes

``` text
Relica's custom domain
/                     → Bar Hub
/cardapio             → Digital Menu
/agenda               → Events / shows
/musicas              → Music requests

Shared platform fallback
/[slug]               → Bar Hub
/[slug]/cardapio      → Digital Menu
/[slug]/agenda        → Events / shows
/[slug]/musicas       → Music requests
```

Only implemented/enabled modules should be linked from the hub.
The application resolves the establishment from the custom host when one
is configured and otherwise from the slug. Browser input never selects
the tenant authorization boundary.

## Admin routes

Existing:

``` text
/admin/login
/admin
/admin/products
/admin/products/new
/admin/products/[id]
/admin/categories
/admin/settings
/admin/account
```

Planned:

``` text
/admin/events
/admin/events/new
/admin/events/[id]
/admin/music
```

Do not introduce `/admin/modules` until there is a concrete need for
configurable module management.

------------------------------------------------------------------------

# 8. Hub UX

## Primary hierarchy

The first screen must answer:

> "What do you want to do at this bar?"

But it must not look like a generic Linktree.

Recommended hierarchy:

``` text
Establishment identity

[ CARDÁPIO ]
Comidas, bebidas e preços
        ↑
large primary destination

[ Próximos shows ] [ Pedir música ]

Secondary links / bar information
```

### Cardápio

-   highest visual priority;
-   accessible within one tap from the hub;
-   should be recognizable immediately;
-   must not be buried below promotional content.

### Agenda

-   shows next event summary when useful;
-   leads to full agenda.

### Music

-   engagement-oriented;
-   may use copy such as `Peça uma música`;
-   must explain that requests are suggestions, not guarantees.

### External links

Instagram and similar destinations are secondary actions, not
first-class internal modules.

------------------------------------------------------------------------

# 9. Existing menu contract --- preserve

The menu still supports:

-   active categories ordered by position;
-   active products grouped by category;
-   name;
-   optional description;
-   price;
-   optional image;
-   featured products;
-   `Esgotado`;
-   local search;
-   loading/empty/error states;
-   mobile-first navigation;
-   category media;
-   product media;
-   establishment logo;
-   public active-only reads.

The menu remains a **presentation/consultation experience**.

No cart, quantity, checkout or payment affordances may be introduced.

------------------------------------------------------------------------

# 10. Existing admin contract --- preserve

The admin continues to support the current product management
foundation:

-   email/password authentication;
-   no public admin sign-up;
-   protected routes;
-   membership-based tenant authorization;
-   password change;
-   product management;
-   availability toggle;
-   activation/deactivation;
-   permanent deletion with explicit confirmation;
-   product images;
-   category management;
-   category ordering;
-   category images;
-   establishment settings;
-   logo management.

New modules must use the same authorization principles.

------------------------------------------------------------------------

# 11. Multi-establishment contract

All tenant-owned resources use `establishment_id`.

The browser must never be trusted to select the authorization boundary.

Every admin mutation must:

1.  authenticate the user;
2.  resolve allowed establishment membership server-side;
3.  validate input;
4.  scope reads/writes to the resolved establishment;
5.  rely on RLS as the final database boundary.

A user with more than one establishment membership must continue to fail
closed until establishment selection is deliberately implemented.

------------------------------------------------------------------------

# 12. Data model evolution

## Existing tables --- preserve

``` text
establishments
establishment_users
categories
products
```

Do not redesign them for the Hub.

Custom-domain routing may add a nullable, normalized and unique
`establishments.custom_domain` field. For Relica's, its value is
`relicas.com.br`. Public server reads resolve an establishment from an
allow-listed custom host when present, or from the route slug on the
shared platform host. The client cannot submit a host or establishment ID
to choose the tenant boundary. Unknown hosts fail closed.

## Agenda --- planned

Proposed table:

``` text
events
- id uuid PK
- establishment_id uuid FK
- title text
- description text null
- starts_at timestamptz
- ends_at timestamptz null
- image_url text null
- external_url text null
- active boolean default true
- position integer or deterministic time ordering
- created_at
- updated_at
```

Public access:

-   active events;
-   active establishment;
-   upcoming/relevant events only according to application rules.

Admin access:

-   membership-scoped CRUD through RLS.

## Music --- planned

Do **not** model this as `products` or generic content.

Proposed entities:

``` text
music_requests
- id
- establishment_id
- song_title
- artist_name
- normalized_key
- status
- request_count
- created_at
- updated_at
```

Potential voting/session data should be designed during the Music task
after anti-spam requirements are defined.

Do not prematurely introduce a generic `modules` table or JSON-driven
content schema.

------------------------------------------------------------------------

# 13. Security

Existing security decisions remain mandatory:

-   RLS on tenant-owned tables;
-   public anonymous reads only for intentionally public data;
-   authenticated writes restricted by establishment membership;
-   server-side authorization on every admin mutation;
-   no service-role key in the client/application foundation;
-   no arbitrary `establishment_id` accepted as authorization;
-   Storage paths scoped by tenant/resource;
-   validation with Zod at mutation boundaries;
-   customer-facing errors never expose raw Supabase/database details.

Agenda and Music require their own RLS tests before completion.

Music additionally requires abuse controls because it introduces public
writes.

------------------------------------------------------------------------

# 14. Analytics direction

Analytics are useful for validating the Bar Hub, but should not block
Hub Foundation.

When analytics are introduced, useful events include:

``` text
hub_view
hub_menu_click
hub_agenda_click
hub_music_click
menu_search
event_view
music_request_submit
music_vote
external_instagram_click
```

Do not collect unnecessary personal data.

The most important initial product question is:

> After scanning the QR, which experiences do customers actually use?

------------------------------------------------------------------------

# 15. Migration strategy from the current product

The current temporary production URL is
`https://qrcodex-eight.vercel.app/relicas`. The definitive public domain
will be `https://relicas.com.br`.

The custom domain must become canonical before the permanent QR is
generated. The existing shared-host route remains available as a safe
fallback and should redirect to the canonical custom domain only after
DNS and production routing are verified.

Migration:

``` text
BEFORE
qrcodex-eight.vercel.app/relicas → menu

AFTER
relicas.com.br/ → hub
relicas.com.br/cardapio → menu
qrcodex-eight.vercel.app/relicas → compatible fallback
```

The permanent printed QR is created only after this migration and points
to `https://relicas.com.br/`.

Existing menu components and loaders should be moved/reused rather than
rewritten without reason.

The migration task must verify:

-   `https://relicas.com.br/` loads the hub;
-   `https://relicas.com.br/cardapio` loads the existing menu;
-   shared-host `/relicas` behavior remains controlled during migration;
-   admin changes still appear in the menu;
-   public RLS behavior is unchanged;
-   loading/error states still work;
-   direct links to the new menu URL work;
-   production deployment does not expose secrets.

------------------------------------------------------------------------

# 16. Backlog status conventions

Use only:

``` text
DONE
IN_PROGRESS
TODO
BLOCKED
DEFERRED
```

Rules:

-   `DONE` means code + acceptance criteria + relevant checks exist.
-   `IN_PROGRESS` means the current implementation task.
-   `TODO` means approved next work.
-   `BLOCKED` requires a documented blocker.
-   `DEFERRED` is explicitly not part of the active delivery sequence.

Codex must update the backlog at the end of each completed task.

------------------------------------------------------------------------

# 17. Baseline already implemented / documented

The repository documentation indicates the following foundation already
exists and must be treated as protected baseline rather than rebuilt.

### FOUNDATION

**TASK-001 --- Project foundation** --- `DONE`\
Next.js App Router, strict TypeScript, Tailwind target stack and project
structure.

**TASK-002 --- Supabase client architecture** --- `DONE`\
Browser, server and anonymous public clients with publishable-key/RLS
strategy.

**TASK-003 --- Initial database schema** --- `DONE`\
Establishments, memberships, categories and products.

**TASK-004 --- Tenant-safe product/category integrity** --- `DONE`\
Composite category/product tenant constraint.

**TASK-005 --- RLS tenant authorization** --- `DONE`\
Public active-only reads and membership-scoped admin access.

**TASK-006 --- Development seed/content foundation** --- `DONE`\
Relica's establishment/categories and approved menu content workflow.

### PUBLIC MENU

**TASK-007 --- Public menu loader** --- `DONE`

**TASK-008 --- Public menu UI** --- `DONE`

**TASK-009 --- Search/filter behavior** --- `DONE`

**TASK-010 --- Menu loading/empty/error states** --- `DONE`

**TASK-011 --- Product image behavior/storage** --- `DONE`

**TASK-012 --- Category media behavior/storage** --- `DONE`

### AUTH / ADMIN

**TASK-013 --- Admin authentication foundation** --- `DONE`

**TASK-014 --- Initial administrator bootstrap and tenant membership**
--- `DONE`

**TASK-015 --- Protected admin shell/access layer** --- `DONE`

**TASK-016 --- Admin product listing/filtering** --- `DONE`

**TASK-017 --- Product creation** --- `DONE`

**TASK-018 --- Product editing** --- `DONE`

**TASK-019 --- Quick availability toggle** --- `DONE`

**TASK-020 --- Product deactivation/permanent deletion** --- `DONE`

**TASK-021 --- Category administration and ordering** --- `DONE`

**TASK-022 --- Establishment settings/logo** --- `DONE`

**TASK-023 --- Account/password management** --- `DONE`

### PRODUCTION

**TASK-024 --- Production environment/deployment foundation** --- `DONE`

These statuses reflect the supplied project documentation. If repository
code contradicts the docs, Codex must stop, record the discrepancy, and
reconcile the backlog before proceeding.

------------------------------------------------------------------------

# 18. New active roadmap

## EPIC HUB --- Permanent establishment landing experience

### TASK-025 --- Update product docs for Bar Hub

**Status:** `TODO`\
**Priority:** P0

Update:

``` text
docs/PRD.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
docs/DECISIONS.md
docs/DEPLOYMENT.md
docs/BACKLOG.md
```

Acceptance:

-   custom-domain `/` is documented as Hub;
-   custom-domain `/cardapio` is documented as menu;
-   shared-host `/[slug]` routing is documented as fallback;
-   no ordering/payment scope regression;
-   agenda/music are separated by phase;
-   existing security decisions remain unchanged.

------------------------------------------------------------------------

### TASK-026 --- Introduce Hub route and relocate menu

**Status:** `TODO`\
**Priority:** P0\
**Depends on:** TASK-025

Goal:

Change public routing without rewriting the menu.

Implementation:

``` text
relicas.com.br/            → Hub
relicas.com.br/cardapio    → existing menu experience

shared host /[slug]        → compatible Hub fallback
```

Acceptance:

-   existing menu functionality survives;
-   existing menu data loader is reused where sensible;
-   `relicas.com.br/` renders Hub;
-   `relicas.com.br/cardapio` renders menu;
-   shared-host `/relicas` remains controlled during migration;
-   unknown/inactive establishments preserve controlled behavior;
-   public reads remain anonymous/RLS-protected;
-   the permanent QR can use the clean custom-domain root.

------------------------------------------------------------------------

### TASK-027 --- Hub public data loader

**Status:** `TODO`\
**Priority:** P0\
**Depends on:** TASK-026

Goal:

Load only public establishment information required by the Hub.

Initial data:

-   establishment name;
-   logo;
-   slug;
-   Instagram;
-   other already-approved public settings.

Do not fetch the full menu merely to render the Hub.

Acceptance:

-   active establishment required;
-   tenant-safe;
-   anonymous public client;
-   no admin/session coupling;
-   controlled not-found/error behavior.

------------------------------------------------------------------------

### TASK-028 --- Hub UI foundation

**Status:** `TODO`\
**Priority:** P0\
**Depends on:** TASK-027

Goal:

Create a modern establishment landing experience.

Required:

-   establishment identity;
-   dominant Cardápio destination;
-   space for secondary modules;
-   mobile-first 320 px+;
-   dark Relica's identity;
-   accessible touch targets;
-   loading/error states;
-   no fake disabled modules.

Initial secondary content may include only real destinations already
supported, such as Instagram.

Acceptance:

-   menu reachable in one tap;
-   page does not resemble a generic link list;
-   no ordering/payment affordance;
-   responsive and keyboard accessible.

------------------------------------------------------------------------

### TASK-029 --- Hub/menu navigation integration

**Status:** `TODO`\
**Priority:** P0\
**Depends on:** TASK-028

Required:

-   menu has a clear path back to the establishment Hub;
-   browser back behavior remains natural;
-   deep-linking to `/cardapio` works;
-   no forced redirect through Hub.

Acceptance:

-   Hub → Menu → Hub is obvious;
-   direct menu visitors are not blocked.

------------------------------------------------------------------------

### TASK-030 --- Hub production migration

**Status:** `TODO`\
**Priority:** P0\
**Depends on:** TASK-029

Update production documentation and verify:

``` text
https://relicas.com.br/
https://relicas.com.br/cardapio
https://qrcodex-eight.vercel.app/relicas (migration fallback)
```

Acceptance:

-   custom domain and DNS are verified before QR generation;
-   the custom-domain root is canonical and the shared-host route has
    controlled fallback behavior;
-   no database destructive migration required;
-   smoke tests pass;
-   `lint`, `typecheck`, `build` pass;
-   admin remains functional.

------------------------------------------------------------------------

## EPIC AGENDA --- Upcoming shows and events

### TASK-031 --- Agenda domain design + migration

**Status:** `TODO`\
**Priority:** P1\
**Depends on:** TASK-030

Create `events` schema through a versioned migration.

Must include:

-   `establishment_id`;
-   event identity/content;
-   start time;
-   optional end time;
-   optional image;
-   optional external URL;
-   active state;
-   timestamps;
-   RLS.

Acceptance:

-   cross-tenant writes fail;
-   anonymous users only read allowed active public events;
-   migration and RLS tests exist.

------------------------------------------------------------------------

### TASK-032 --- Public Agenda

**Status:** `TODO`\
**Priority:** P1\
**Depends on:** TASK-031

Route:

``` text
/agenda on a custom domain
/[slug]/agenda on the shared platform host
```

Required:

-   upcoming events ordered chronologically;
-   date/time;
-   title;
-   optional description/image;
-   optional external CTA;
-   empty state;
-   mobile-first design.

------------------------------------------------------------------------

### TASK-033 --- Agenda admin CRUD

**Status:** `TODO`\
**Priority:** P1\
**Depends on:** TASK-031

Routes:

``` text
/admin/events
/admin/events/new
/admin/events/[id]
```

Required:

-   list;
-   create;
-   edit;
-   activate/deactivate;
-   delete with explicit confirmation;
-   membership-scoped server actions.

------------------------------------------------------------------------

### TASK-034 --- Event image storage

**Status:** `TODO`\
**Priority:** P1\
**Depends on:** TASK-033

Use the existing tenant-protected Storage pattern rather than inventing
a new security model.

------------------------------------------------------------------------

### TASK-035 --- Activate Agenda on Hub

**Status:** `TODO`\
**Priority:** P1\
**Depends on:** TASK-032, TASK-033

Hub gains a real Agenda destination.

Optional preview:

``` text
Próximo show
Band Name
Sex • 22:00
```

Only show preview when real event data exists.

------------------------------------------------------------------------

## EPIC MUSIC --- Customer music requests

### TASK-036 --- Music request product/security design

**Status:** `TODO`\
**Priority:** P2\
**Depends on:** TASK-035

Before schema/code, define:

-   request lifecycle;
-   duplicate normalization;
-   voting model;
-   anonymous session strategy;
-   abuse prevention;
-   rate limiting;
-   moderation;
-   reset/archive behavior for a night/session;
-   privacy implications.

This task is intentionally design-first because Music introduces
anonymous public writes.

Deliverables:

``` text
docs/MUSIC_REQUESTS.md
ADR entry
schema proposal
threat/abuse notes
```

No public write endpoint before this task is approved.

------------------------------------------------------------------------

### TASK-037 --- Music request database/RLS

**Status:** `TODO`\
**Priority:** P2\
**Depends on:** TASK-036

Implement the approved schema with migrations and tests.

------------------------------------------------------------------------

### TASK-038 --- Public Music UI

**Status:** `TODO`\
**Priority:** P2\
**Depends on:** TASK-037

Route:

``` text
/musicas on a custom domain
/[slug]/musicas on the shared platform host
```

Initial experience:

``` text
Search/type song
↓
Submit request
↓
See popular requests
↓
Vote where allowed
```

Copy must state:

> Pedidos são sugestões e não garantem que a música será tocada.

------------------------------------------------------------------------

### TASK-039 --- Admin Music Queue

**Status:** `TODO`\
**Priority:** P2\
**Depends on:** TASK-037

Route:

``` text
/admin/music
```

Required:

-   requested songs;
-   request/vote count;
-   chronological/popularity views;
-   status/moderation actions;
-   mobile-friendly operation.

------------------------------------------------------------------------

### TASK-040 --- Music abuse controls

**Status:** `TODO`\
**Priority:** P2\
**Depends on:** TASK-038, TASK-039

Validate the controls defined in TASK-036 under realistic repeated
requests.

This task must be complete before public production activation.

------------------------------------------------------------------------

### TASK-041 --- Activate Music on Hub

**Status:** `TODO`\
**Priority:** P2\
**Depends on:** TASK-040

Only then expose `Pedir música` as an active Hub destination.

------------------------------------------------------------------------

# 19. Deferred backlog

### TASK-050 --- Module configuration UI

**Status:** `DEFERRED`

Only build when at least several real modules need
establishment-specific enable/disable/reordering.

Do not create a generic module engine now.

### TASK-051 --- Multi-establishment selector

**Status:** `DEFERRED`

### TASK-052 --- Production SMTP/admin invitation onboarding

**Status:** `DEFERRED`

### TASK-053 --- Analytics

**Status:** `DEFERRED` until Hub usage needs validation instrumentation.

### TASK-054 --- Promotions/happy hour

**Status:** `DEFERRED`

### TASK-055 --- Wi-Fi module

**Status:** `DEFERRED`

### TASK-056 --- Polls/quiz

**Status:** `DEFERRED`

### TASK-057 --- Now-playing integration

**Status:** `DEFERRED`

------------------------------------------------------------------------

# 20. Development sequence

Codex should work in this order:

``` text
TASK-025
   ↓
TASK-026
   ↓
TASK-027
   ↓
TASK-028
   ↓
TASK-029
   ↓
TASK-030
   ↓
──────── HUB RELEASE ────────
   ↓
TASK-031
   ↓
TASK-032 + TASK-033
   ↓
TASK-034
   ↓
TASK-035
   ↓
────── AGENDA RELEASE ───────
   ↓
TASK-036
   ↓
TASK-037
   ↓
TASK-038 + TASK-039
   ↓
TASK-040
   ↓
TASK-041
   ↓
────── MUSIC RELEASE ────────
```

Do not start Music while Hub Foundation is incomplete.

------------------------------------------------------------------------

# 21. Codex context protocol

To avoid losing project state between context windows, Codex must treat
repository docs as durable memory.

At the beginning of a task, read:

``` text
AGENTS.md
docs/PRD.md
docs/BACKLOG.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/DECISIONS.md
docs/DESIGN_SYSTEM.md
```

Then read only task-specific code/docs.

At the end of every task:

1.  run relevant checks;
2.  update `docs/BACKLOG.md`;
3.  update architecture/database/design docs if behavior changed;
4.  add ADR only for a meaningful durable decision;
5.  record migrations/tests created;
6.  state the next recommended task;
7.  do not mark incomplete work as DONE.

The backlog, not chat history, is the source of truth for task status.

------------------------------------------------------------------------

# 22. Recommended BACKLOG.md structure

``` markdown
# Backlog

## Current
TASK-025 — Update product docs for Bar Hub
Status: IN_PROGRESS

## Next
TASK-026 — Introduce Hub route and relocate menu
TASK-027 — Hub public data loader
TASK-028 — Hub UI foundation

## Completed
TASK-001 ...
...
TASK-024 ...

## Deferred
TASK-050 ...
```

Keep detailed acceptance criteria in this PRD. Keep `BACKLOG.md`
concise.

------------------------------------------------------------------------

# 23. Architecture constraints for new work

Do:

-   reuse the current Next.js/Supabase foundation;
-   prefer Server Components for initial reads;
-   use Client Components only for actual interaction;
-   validate mutations with Zod;
-   use versioned migrations;
-   maintain RLS;
-   maintain tenant-scoped Storage;
-   revalidate affected public/admin routes;
-   add focused tests around business/security rules;
-   keep public pages fast.

Do not:

-   rewrite working menu/admin features to fit the new naming;
-   create a microservice;
-   create a generic CMS;
-   create a generic plugin architecture;
-   store all module content in JSON;
-   add Redux/global state without concrete need;
-   expose service-role secrets;
-   accept tenant authorization from browser state;
-   couple the QR to a specific module;
-   implement speculative modules.

------------------------------------------------------------------------

# 24. Design evolution

The existing menu Design System remains authoritative **inside the
menu**.

The Hub extends it with a new page type:

### Hub visual goals

-   rock bar contemporary;
-   dark;
-   high contrast;
-   establishment identity first;
-   strong primary card;
-   secondary module cards;
-   minimal text;
-   no e-commerce patterns.

### Hub hierarchy

``` text
Logo / establishment
Contextual headline

PRIMARY
Cardápio

SECONDARY
Agenda
Pedir música

TERTIARY
Instagram / information
```

The menu itself must remain optimized for finding products rather than
being redesigned as the Hub.

Agenda and Music should inherit the same visual tokens but use UX
appropriate to their jobs.

------------------------------------------------------------------------

# 25. Acceptance scenario --- Hub release

1.  Customer scans the definitive Relica's QR.
2.  `https://relicas.com.br/` opens.
3.  Customer immediately recognizes Relica's.
4.  `Cardápio` is the dominant action.
5.  Customer taps it.
6.  `https://relicas.com.br/cardapio` opens the existing menu.
7.  Search/categories/products/prices/availability work as before.
8.  Customer can return to the Hub.
9.  Administrator changes a product.
10. Menu reflects the change.
11. Future module or content changes require no QR replacement.

------------------------------------------------------------------------

# 26. Acceptance scenario --- Agenda release

1.  Owner signs in.
2.  Creates an upcoming show.
3.  Activates it.
4.  Customer opens `https://relicas.com.br/`.
5.  Agenda is available.
6.  Customer opens `https://relicas.com.br/agenda`.
7.  Event information is visible in chronological context.
8.  Owner deactivates the event.
9.  It no longer appears publicly.

------------------------------------------------------------------------

# 27. Acceptance scenario --- Music release

1.  Customer opens `https://relicas.com.br/musicas`.
2.  Requests a song.
3.  Another customer requests/votes for the same normalized song.
4.  The system aggregates according to the approved Music rules.
5.  Admin sees the request in the queue.
6.  Admin can moderate/update its status.
7.  Abuse controls prevent trivial repeated spam.
8.  Customer is never promised that the request will be played.

------------------------------------------------------------------------

# 28. Definition of product success for this stage

The project should no longer be thought of as:

> "a digital menu that might have other features later."

It should be implemented as:

> **a permanent digital hub for the establishment, with the menu as its
> first and primary module.**

However, architecture must remain intentionally concrete.

We are building:

``` text
Hub
├── Menu
├── Agenda
└── Music
```

not:

``` text
Generic SaaS Platform
└── Universal configurable modules engine
```

That distinction protects development speed, security and
maintainability while giving the product room to prove which bar
experiences actually create value.
