# TASK-013 — Implement admin login/logout

**Epic:** Authentication & Admin Shell
**Status:** READY
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
- [ ] A valid administrator can sign in and has a refreshed session across requests.
- [ ] Invalid credentials show a safe, helpful message without leaking secrets.
- [ ] Logout ends the session and returns to the login page.
- [ ] The public menu remains accessible without authentication.
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
