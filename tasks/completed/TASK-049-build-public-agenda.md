# TASK-049 — Build public Agenda

**Epic:** Agenda
**Status:** DONE
**Dependencies:** TASK-048, TASK-051

## Objective
Build a fast, mobile-first public Agenda that lists eligible establishment events chronologically without exposing unfinished Hub navigation.

## Requirements
- Add the shared-host route `/{slug}/agenda` with a focused anonymous loader.
- Resolve only active establishments and active events through the public Supabase client/RLS.
- Present upcoming events in chronological order with required flyer/banner, title, date/time, optional description and optional external CTA.
- Provide clear loading, empty, error and direct-deep-link states.
- Do not expose Agenda from the Hub until TASK-052.

## Acceptance criteria
- [x] Direct Agenda URLs render without authentication.
- [x] Inactive events and events from inactive establishments are not exposed.
- [x] Events are chronologically ordered and mobile-friendly from 320 px.
- [x] Required event media is optimized and description/CTA remain optional without breaking layout.
- [x] Loading, empty and error states are customer-friendly.
- [x] Focused loader tests plus lint, typecheck, tests and build pass.

## Completion notes
- Added the direct `/{slug}/agenda` route with a focused cookie-free anonymous loader and RLS-backed reads.
- Added chronological filtering for upcoming/ongoing events, defensive media enforcement and HTTP(S)-only external CTAs.
- Built the mobile-first flyer presentation plus loading, empty and error states; the Agenda remains intentionally absent from the Hub.
- Added three focused resolver tests and synchronized architecture/design documentation.
- Production at 320 px rendered the empty state with no overflow or console errors; Vercel deployment `dpl_GFJWSj6eShdKVfkFyEXPvdwyQz98` reached READY.
- Checks: 38 Node tests, lint, typecheck, local build and Vercel production build passed.
