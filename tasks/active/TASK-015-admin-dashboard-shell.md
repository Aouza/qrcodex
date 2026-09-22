# TASK-015 — Build admin dashboard/navigation shell

**Epic:** Authentication & Admin Shell
**Status:** READY
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
- [ ] An authorized user sees the resolved establishment name and admin navigation.
- [ ] Navigation works at mobile and desktop widths without overflow or overlap.
- [ ] Products, categories and settings destinations have intentional pending states without implementing their CRUD tasks.
- [ ] Sign-out remains available and returns the user to `/admin/login`.
- [ ] Unauthenticated and unauthorized users receive no admin tenant data.
- [ ] The public menu remains unaffected.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
