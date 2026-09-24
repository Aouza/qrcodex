# PRD — Relica's Bar Hub

**Version:** 2.0
**Status:** Approved for implementation  
**Platform:** Responsive web, mobile-first  
**Primary users:** bar customers and establishment administrators

## 1. Product vision
A single permanent QR code opens a lightweight digital Hub for the establishment. The menu remains the first and most important module; Agenda and Music Requests expand the in-venue experience in later phases. The owner manages establishment content from the existing mobile-friendly admin without replacing the printed QR when content or modules change.

## 2. Problem
The physical menu makes price changes, availability updates and catalog maintenance expensive and slow. Customers also lack one reliable destination for the bar's menu, upcoming events and lightweight participation in the venue experience.

## 3. Product outcome
Customer: `scan -> recognize the bar -> choose an experience -> complete the task`.
Admin: `sign in -> manage establishment content -> publish`.

The product is an establishment experience Hub, not a restaurant operations platform. The menu remains a presentation/consultation experience without ordering or payment.

## 4. Delivery phases
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
- optional event image and external CTA.

### Phase C — Music Requests
- customer song suggestions and voting;
- normalized duplicate aggregation;
- admin moderation queue;
- abuse prevention and rate protection designed before public writes;
- explicit copy that requests do not guarantee playback.

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

## 6. Public routing and domain strategy
Before the custom domain is acquired and configured, the shared production host uses:

```text
/relicas            -> Hub
/relicas/cardapio   -> menu
/relicas/agenda     -> Agenda, when implemented
/relicas/musicas    -> Music Requests, when implemented
```

After `relicas.com.br` is acquired, connected and verified, canonical routes become:

```text
https://relicas.com.br/           -> Hub
https://relicas.com.br/cardapio   -> menu
https://relicas.com.br/agenda     -> Agenda
https://relicas.com.br/musicas    -> Music Requests
```

Shared-host `/[slug]` routes remain a compatibility/fallback strategy for establishments without a custom domain. The permanent Relica's QR must only be generated after the custom domain, DNS and production routing are verified.

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
The QR stores only the permanent establishment Hub URL, never menu data or a module-specific URL. Product, event, module and content changes must never require generating a new QR.

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

## 15. Hub release acceptance scenario
1. Customer opens the temporary `/relicas` route or, after cutover, `https://relicas.com.br/`.
2. Customer immediately recognizes Relica's and sees `Cardápio` as the dominant action.
3. Customer opens the existing menu in one tap.
4. Search, categories, prices, images and availability work as before.
5. Customer can return clearly to the Hub.
6. Admin changes a product and the menu reflects the change.
7. No QR replacement is required for future content/module changes.

## 16. Future opportunities — not commitments
Analytics, happy-hour automation, promotions, polls, quizzes, Wi-Fi helper, now-playing integration, call-waiter, ordering, tabs, payments, loyalty, administrator onboarding by email invitation and multi-tenant commercial plans.
