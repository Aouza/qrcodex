# TASK-025 — Build basic establishment settings

**Epic:** Establishment & Release
**Status:** READY
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
- [ ] Current settings load for the authorized establishment only.
- [ ] Name and optional contact values can be updated with clear validation.
- [ ] The permanent slug is visible but cannot be edited.
- [ ] Unknown/cross-tenant establishments cannot be changed.
- [ ] Form works at 320px and desktop widths.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
