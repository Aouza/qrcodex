# TASK-013 — Implement admin login/logout

**Epic:** Authentication & Admin Shell
**Status:** DONE
**Dependencies:** TASK-004

## Objective
Let an establishment administrator sign in and out through Supabase Auth without exposing tenant data or privileged credentials.

## Requirements
- Add an admin login page with email/password validation and clear failure feedback.
- Use the existing Supabase browser/server clients and configure session refresh at the Next.js request boundary as required by `docs/ARCHITECTURE.md`.
- Add logout and redirect to the login page after sign-out.
- Keep public menu access anonymous and unaffected.
- Do not yet implement admin tenant resolution, dashboard or CRUD; those belong to TASK-014 onward.

## Acceptance criteria
- [x] A valid administrator can sign in and has a refreshed session across requests.
- [x] Invalid credentials show a safe, helpful message without leaking secrets.
- [x] Logout ends the session and returns to the login page.
- [x] The public menu remains accessible without authentication.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added a server-validated email/password form, safe authentication feedback, signed-in/logout state, and an admin-only Proxy that refreshes session cookies and propagates cache headers. Added Zod for boundary validation. Aligned the authentication page with the shared Relica's dark/amber tokens and updated the design-system guidance.
- Checks run: `npm run lint`, `npm run typecheck`, `npm run build`; browser tests of invalid and valid credentials; live refresh-persistence and logout-persistence smoke tests; anonymous HTTP 200 for `/admin/login` and `/relicas`; desktop visual review and 320px layout/overflow checks; public-menu background regression check.
- Acceptance criteria result: All criteria passed. A manually created Supabase Auth user signed in, remained authenticated after refresh, signed out successfully and remained signed out after refresh.
- Follow-up/risks: TASK-014 must provision/resolve the user's `establishment_users` membership and protect admin routes; authentication alone grants no tenant access. Email invitations and custom SMTP remain future onboarding work.
