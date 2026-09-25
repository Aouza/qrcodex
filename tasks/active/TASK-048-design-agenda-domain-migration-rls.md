# TASK-048 — Design Agenda domain and add migration/RLS

**Epic:** Agenda
**Status:** READY
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
- [ ] A versioned migration creates the Agenda schema and indexes.
- [ ] Cross-tenant event writes fail under RLS.
- [ ] Anonymous reads expose only eligible active events.
- [ ] Validation/security tests cover the important event boundaries.
- [ ] Database and architecture documentation are synchronized.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
