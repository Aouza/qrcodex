# TASK-015 — Build admin dashboard/navigation shell

**Epic:** Authentication & Admin Shell
**Status:** DONE
**Dependencies:** TASK-014

## Objective
Build the authenticated, mobile-friendly admin shell that gives the establishment owner a clear starting point and navigation to the management areas planned for subsequent tasks.

## Requirements
- Render the server-resolved establishment identity in the admin shell.
- Provide responsive navigation for products, categories and establishment settings.
- Include a clear sign-out action using the existing authentication flow.
- Prioritize compact, work-focused UI and comfortable touch targets according to `docs/DESIGN_SYSTEM.md`.
- Keep every protected view behind `getAdminAccess`; do not accept an establishment ID from the browser.
- Preserve the controlled zero/multiple membership states from TASK-014.
- Do not implement product, category or settings CRUD yet.
- Keep the public menu anonymous and visually unaffected.

## Acceptance criteria
- [x] An authorized user sees the resolved establishment name and admin navigation.
- [x] Navigation works at mobile and desktop widths without overflow or overlap.
- [x] Products, categories and settings destinations have intentional pending states without implementing their CRUD tasks.
- [x] Sign-out remains available and returns the user to `/admin/login`.
- [x] Unauthenticated and unauthorized users receive no admin tenant data.
- [x] The public menu remains unaffected.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a shared protected App Router layout, responsive admin shell, active navigation, resolved establishment/account context, shared sign-out control, dashboard shortcuts and intentional pending destinations for products, categories and settings. Updated successful/already-authenticated login navigation to enter `/admin` directly.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (7 passing), `npm run build`, `git diff --check`, anonymous HTTP redirect checks for all four protected routes, public `/relicas` HTTP 200, and user-confirmed authenticated dashboard access.
- Acceptance criteria result: All criteria passed. Authorization remains in the shared server layout, all protected destinations inherit it, and no CRUD or browser-supplied tenant selection was introduced.
- Follow-up/risks: TASK-016 replaces the products pending state with a tenant-scoped list and category filtering. Every later mutation must independently call the server authorization layer despite inheriting route protection.
