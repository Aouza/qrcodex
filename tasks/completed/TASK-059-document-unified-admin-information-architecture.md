# TASK-059 — Document unified admin information architecture

**Epic:** Administration Architecture
**Status:** DONE
**Dependencies:** TASK-015, TASK-042

## Objective
Define how Menu, Agenda, Music, establishment settings and account management coexist without creating a crowded single screen or separate administration applications.

## Acceptance criteria
- [x] One authenticated admin shell is the documented product boundary.
- [x] Menu, Agenda and Music remain independent feature domains and routes.
- [x] Dashboard, desktop and mobile navigation responsibilities are explicit.
- [x] Tenant authorization remains server-resolved and enforced per mutation.
- [x] Generic module engines and all-in-one CRUD screens are explicitly rejected.
- [x] PRD, architecture, design system and decisions are synchronized.

## Completion notes
- Documented one shared admin organized into Overview, Menu, Agenda, Music, Establishment and Account areas.
- Kept each module's loaders, validation, Server Actions and RLS boundaries independent.
- Defined a summary/shortcut dashboard instead of combining operational forms.
- Added ADR-017 and verified documentation with `git diff --check`.
