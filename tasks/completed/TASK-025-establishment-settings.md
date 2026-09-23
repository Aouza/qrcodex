# TASK-025 — Build basic establishment settings

**Epic:** Establishment & Release
**Status:** DONE
**Dependencies:** TASK-015

## Objective
Allow an authorized administrator to update the basic public identity and contact settings of the current establishment.

## Requirements
- Replace the settings placeholder with a tenant-scoped form.
- Support establishment name, Instagram and WhatsApp fields with server-side validation.
- Keep the permanent public slug read-only so settings cannot invalidate printed QR codes.
- Resolve membership independently in the loader and Server Action; never accept establishment ownership from the browser.
- Revalidate dashboard, settings and public menu paths after success.
- Do not add establishment image upload unless the existing schema/storage contract makes it coherent within the task.

## Acceptance criteria
- [x] Current settings load for the authorized establishment only.
- [x] Name and optional contact values can be updated with clear validation.
- [x] The permanent slug is visible but cannot be edited.
- [x] Unknown/cross-tenant establishments cannot be changed.
- [x] Form works at 320px and desktop widths.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Implementation summary: Replaced the placeholder with a tenant-scoped settings form for name and normalized optional contacts, kept slug read-only, and exposed safe public Instagram/WhatsApp links.
- Checks run: lint, typecheck, 24 unit tests and production build.
- Acceptance criteria result: All criteria pass through RLS plus ID scoping, boundary validation and responsive form/header styling.
- Follow-up/risks: Establishment logo/editorial media remains deferred because no approved storage contract is part of this task.
