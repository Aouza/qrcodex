# TASK-050 — Build Agenda admin CRUD

**Epic:** Agenda
**Status:** READY
**Dependencies:** TASK-048, TASK-051

## Objective
Let an authorized establishment administrator create, edit, publish and remove Agenda events, including their required flyer/banner.

## Requirements
- Add Events to the existing Admin navigation and create focused list/new/edit routes.
- Validate title, description, start/end date-times and optional HTTP(S) external CTA with Zod.
- Derive `establishment_id` from server-side membership for every read and mutation.
- Create events as drafts, then support protected flyer upload/replacement/removal.
- Permit publication only after an image exists; removing media returns the event to draft.
- Provide explicit permanent-delete confirmation and clean up owned media.

## Acceptance criteria
- [ ] Authorized admins can list, create, edit and delete only their establishment's events.
- [ ] Date ranges and external URLs are validated at the server boundary.
- [ ] Flyer upload/replacement/removal follows tenant-safe Storage paths and rollback behavior.
- [ ] Draft/public status is clear and an event without media cannot be published.
- [ ] Admin navigation works on mobile and desktop without exposing another tenant.
- [ ] Focused validation tests plus lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
