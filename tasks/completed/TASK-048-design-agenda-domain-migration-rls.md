# TASK-048 — Design Agenda domain and add migration/RLS

**Epic:** Agenda
**Status:** DONE
**Dependencies:** TASK-047

## Objective
Define the tenant-owned Agenda event model and introduce it through a versioned migration with public-read and administrator-write RLS boundaries.

## Requirements
- Define event identity, content, start time, optional end time, optional image, optional external URL, active state and timestamps.
- Scope every event to `establishment_id` with database-enforced referential integrity.
- Permit anonymous reads only for active public events belonging to active establishments.
- Permit writes only for authenticated members of the owning establishment.
- Document schema, RLS and storage implications before public or admin Agenda UI work.

## Acceptance criteria
- [x] A versioned migration creates the Agenda schema and indexes.
- [x] Cross-tenant event writes fail under RLS.
- [x] Anonymous reads expose only eligible active events.
- [x] Validation/security tests cover the important event boundaries.
- [x] Database and architecture documentation are synchronized.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Added and remotely applied migration `20260924000001_agenda_events.sql` with tenant-owned events, chronological index, timestamp trigger, title/time-range checks, RLS and explicit grants.
- Anonymous reads require both an active event and active establishment; authenticated CRUD requires membership in the event's establishment through `private.is_establishment_member`.
- Added `supabase/tests/011_agenda_events.sql`, covering schema checks, public visibility, denied anonymous writes, permitted own-tenant CRUD and denied cross-tenant access. The remote transactional run passed and rolled back.
- Synchronized `docs/DATABASE.md` and `docs/ARCHITECTURE.md`, including the decision to defer event Storage to TASK-051.
- Checks: remote migration history matched; Supabase DB lint found no Agenda issue (it retained the existing `reorder_category` variable warning); 33 Node tests, lint, typecheck and build passed.
