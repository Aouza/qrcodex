# TASK-049 — Build public Agenda

**Epic:** Agenda
**Status:** READY
**Dependencies:** TASK-048

## Objective
Build a fast, mobile-first public Agenda that lists eligible establishment events chronologically without exposing unfinished Hub navigation.

## Requirements
- Add the shared-host route `/{slug}/agenda` with a focused anonymous loader.
- Resolve only active establishments and active events through the public Supabase client/RLS.
- Present upcoming events in chronological order with title, date/time, optional description and optional external CTA.
- Provide clear loading, empty, error and direct-deep-link states.
- Do not expose Agenda from the Hub until TASK-052.

## Acceptance criteria
- [ ] Direct Agenda URLs render without authentication.
- [ ] Inactive events and events from inactive establishments are not exposed.
- [ ] Events are chronologically ordered and mobile-friendly from 320 px.
- [ ] Missing optional media, description or CTA does not break layout.
- [ ] Loading, empty and error states are customer-friendly.
- [ ] Focused loader tests plus lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
