# TASK-050 — Build Agenda admin CRUD

**Epic:** Agenda
**Status:** DONE
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
- [x] Authorized admins can list, create, edit and delete only their establishment's events.
- [x] Date ranges and external URLs are validated at the server boundary.
- [x] Flyer upload/replacement/removal follows tenant-safe Storage paths and rollback behavior.
- [x] Draft/public status is clear and an event without media cannot be published.
- [x] Admin navigation works on mobile and desktop without exposing another tenant.
- [x] Focused validation tests plus lint, typecheck, tests and build pass.

## Completion notes
- Added the missing admin route surface: `events/page.tsx` (list), `events/new/page.tsx` (create), `events/[id]/page.tsx` (edit, flyer, delete), plus `loading.tsx`/`error.tsx`/`[id]/not-found.tsx`, mirroring the existing Products route pattern. The server actions, `EventForm`, `EventImageForm`, `DeleteEventForm` and `load-admin-events.ts` loaders already existed from prior work; they were unwired (no page rendered them) until this pass.
- Reused existing components/styles throughout — no new CSS modules; `admin-content.module.css` (heading/actions/pending), `admin-categories.module.css` (toolbar/success) and `admin-products.module.css` (skeleton/noResults) cover the events list, loading and error states.
- Fixed an unused-var lint warning in `events/[id]/actions.ts` (`void _state;` in `deleteEvent`, matching the pattern already used in `image-actions.ts`).
- Added `tests/event-validation.test.mjs` (7 cases) covering `parseEventInput`: minimal valid event, short title, invalid start date, end-before-start, valid end-after-start, non-HTTP(S) external URL, valid HTTPS URL. Agenda now has validation test coverage matching every other domain (product/category/establishment/account).
- **Environment root cause found and fixed during manual smoke test:** `/admin/events` initially failed with "Failed to load admin events." The real Supabase error (confirmed via direct PostgREST query, not assumed) was `PGRST205 — Could not find the table 'public.events' in the schema cache`. Root-caused via `supabase migration list` against the confirmed DEV project (`wbzabonhfyuxjeuhcixt`, distinct from the `qrcodex-production` project documented in `docs/DEPLOYMENT.md`): DEV was 3 migrations behind — `20260924000000_establishment_logo_storage.sql`, `20260924000001_agenda_events.sql` and `20260924000002_event_image_storage.sql` had never been applied to it, though they were already committed and had been applied to production/recorded in `docs/DATABASE.md`. All three were reviewed line-by-line (additive only — no `drop`/`delete`/`truncate`, upsert-safe bucket inserts) and applied to DEV only via `supabase db push`. Production was never accessed or modified. Post-push, `public.events` and the `event-images`/`establishment-images` buckets were confirmed reachable via read-only PostgREST/Storage checks.
- Checks run: `node --test tests/*.test.mjs` (45 passed), `npm run lint` (0 problems), `npm run typecheck` (clean), `npm run build` (succeeds; `/admin/events`, `/admin/events/new`, `/admin/events/[id]` present as dynamic routes).
- Follow-up: none required for this task. `docs/DATABASE.md`'s claim that the Agenda migrations were "applied and recorded remotely" was accurate for production but did not hold for the DEV project used in this environment — worth keeping in mind that DEV and production migration state can silently drift since there's no automated check; no doc change made here since the statement is still true for the intended (production) reading.
