# TASK-006 — Create public establishment route and data loader

**Epic:** Public Menu  
**Status:** IN_PROGRESS  
**Dependencies:** TASK-004, TASK-005

## Objective
Resolve a public establishment by slug and load its visible menu data through the anonymous RLS path.

## Requirements
- Add the `/[slug]` App Router route and server-side loader for an active establishment, its active ordered categories and visible products.
- Respect the RLS rules from `docs/DATABASE.md`, including showing active unavailable products and hiding inactive tenants/categories/products.
- Public reads must not inherit an authenticated admin session that would hide another tenant's public menu.
- Handle unknown or inactive establishments without leaking private data.
- Do not build the final menu shell, category navigation or product presentation; those belong to later tasks.

## Acceptance criteria
- [ ] An active establishment's route resolves by slug and loads only publicly visible data in deterministic order.
- [ ] Unknown and inactive establishments are not exposed.
- [ ] Active unavailable products remain in the loaded result.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
