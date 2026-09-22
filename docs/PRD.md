# PRD — Relica's Digital Menu

**Version:** 1.0 MVP  
**Status:** Approved for implementation  
**Platform:** Responsive web, mobile-first  
**Primary users:** bar customers and establishment administrators

## 1. Product vision
A QR code opens a fast, installation-free digital menu. Customers can browse/search categories and products. The owner can update the menu from a mobile-friendly admin panel without developer intervention. Changes must appear without replacing the printed QR code.

## 2. Problem
The physical menu makes price changes, availability updates and catalog maintenance expensive and slow. It also limits discoverability and makes future measurement difficult.

## 3. MVP outcome
Customer: `scan -> find -> choose`.  
Admin: `sign in -> change -> publish`.

The MVP is a menu presentation/management system, not a restaurant operations platform.

## 4. MVP scope
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

### Admin
- email/password authentication;
- no public administrator sign-up;
- protected admin routes;
- product list/filter;
- create/edit product;
- toggle availability quickly;
- activate/deactivate/delete product as defined by implementation task;
- optional product image upload;
- create/edit/reorder/activate categories;
- basic establishment settings.

## 5. Explicitly out of scope
Cart, orders from tables, payments/Pix, commandas, kitchen workflow, stock management, fiscal issuance, loyalty, reservations, customer accounts, native apps and delivery integrations.

## 6. Initial categories
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

## 7. Product rules
A product has name, optional description, price, category, optional image, availability, featured state, active state and display position.

Unavailable products remain visible and show `Esgotado` in MVP.

Images are optional. Products without an image show a neutral illustrative empty-state thumbnail, never a generated representation of the specific item.

Generated sample product photography is for development tests only, not an automatic fallback for products on the public menu. Product images shown to customers must be attached to real products and may later be replaced through the admin image flow.

## 8. Category rules
Categories are data, not code constants. Admin can create, edit, order and activate/deactivate them. Public menu shows active categories in configured order.

The public category navigation presents an illustrative image or icon above each category name. Relica's initial categories may use local default artwork; newly created categories use a neutral illustration until category image management is available in the admin. Names and order always come from category data, not the artwork mapping.

## 9. Search
Search should be case-insensitive and match product name and description. Only public/active products should appear. Search UX must not require a page reload. Matching products remain grouped by category, with their featured and unavailable states preserved. Clearing the query restores the full menu; a query with no matches has an explicit empty state.

## 10. QR behavior
The QR stores only a permanent menu URL. Product/price changes must never require generating a new QR.

## 11. Multi-establishment readiness
Relica's is the first establishment, but tenant-owned resources must use `establishment_id`. Do not build SaaS billing/onboarding in MVP.

The data model supports users belonging to multiple establishments. The MVP automatically resolves the establishment only for users with one membership; selection between multiple establishments is a future capability and has no MVP UI.

## 12. UX principles
- mobile-first;
- speed > clarity > visual effects;
- one-handed use;
- no public login;
- no unnecessary modals/animations;
- readable typography and comfortable touch targets;
- no dependency on color alone for status.

## 13. MVP acceptance scenario
1. Owner signs in.
2. Creates `Heineken 600ml`, price `R$ 19,90`, category `Cervejas`.
3. Customer opens the permanent menu URL and sees it.
4. Owner marks it unavailable.
5. Customer refreshes and sees the same product marked `Esgotado`.

## 14. Future opportunities — not commitments
Analytics, happy-hour automation, promotions, events/shows, call-waiter, ordering, tabs, payments, loyalty, administrator onboarding by email invitation and multi-tenant commercial plans.
