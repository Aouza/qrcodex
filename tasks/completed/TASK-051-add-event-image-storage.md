# TASK-051 — Add event image storage

**Epic:** Agenda
**Status:** DONE
**Dependencies:** TASK-048

## Objective
Provide tenant-safe flyer/banner storage and guarantee that only events with an attached image can be published.

## Requirements
- Create a dedicated public `event-images` bucket for optimized JPEG, PNG and WebP media.
- Scope object paths to `<establishment_id>/<event_id>/<version>.<extension>`.
- Restrict Storage writes/deletes to authenticated members who own the referenced event.
- Allow drafts without media but enforce `image_url` whenever an event is active.
- Add reusable image validation/path helpers for the later admin flow.

## Acceptance criteria
- [x] Bucket limits and MIME types are explicit.
- [x] Own-event uploads are allowed and cross-tenant/malformed paths are rejected.
- [x] Active events without an image are rejected at database level.
- [x] Draft events remain valid without an image.
- [x] Storage/RLS tests and validation tests pass.
- [x] Database, product and architecture documentation are synchronized.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Applied migration `20260924000002_event_image_storage.sql` remotely, creating the public 768 KB `event-images` bucket and membership-plus-event Storage policies.
- Events now default to draft and the database rejects `active = true` while `image_url` is null.
- Added event image validation/path helpers and focused Node tests.
- Added and remotely passed `supabase/tests/012_event_image_storage.sql`, covering bucket settings, draft/publication rules, own-event writes, malformed paths and cross-tenant denial.
- Updated PRD, database and architecture documentation for required published-event flyers.
- Checks: SQL test passed and rolled back; 35 Node tests, lint, typecheck and build passed.
