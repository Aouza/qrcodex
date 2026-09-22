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
