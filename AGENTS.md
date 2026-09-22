# AGENTS.md — Relica's Digital Menu

## Mission
Build the MVP defined in `docs/PRD.md`: a mobile-first digital menu accessed by QR code, with a simple admin area for the bar owner to manage categories, products, prices, images, featured status and availability.

## Mandatory reading order
Before changing code:
1. `AGENTS.md`
2. `tasks/CURRENT.md`
3. the active task referenced by CURRENT
4. `docs/PRD.md` sections relevant to the task
5. `docs/ARCHITECTURE.md`
6. `docs/DATABASE.md` when data/auth is involved
7. `docs/DESIGN_SYSTEM.md` when UI is involved
8. `docs/DECISIONS.md`

## Scope guardrails
MVP includes public menu, search, categories, featured/unavailable products, admin authentication, product/category CRUD, image upload, ordering and basic establishment settings.

Do NOT implement unless a task explicitly adds them: cart, table ordering, payments/Pix, tabs/commandas, kitchen workflow, inventory, fiscal features, loyalty, reservations, native apps, delivery integrations, customer accounts.

## Technical baseline
- Next.js App Router + TypeScript strict mode
- Tailwind CSS
- Supabase Postgres, Auth and Storage
- Zod for boundary validation
- React Hook Form for non-trivial client forms when useful
- Vercel target deployment
- Server Components by default; Client Components only for browser interaction/state
- Money must not use floating-point storage
- Tenant-owned data must be scoped by `establishment_id`
- RLS is mandatory for tenant-owned admin data
- Never expose Supabase service-role credentials to the browser

## Engineering rules
- Inspect existing code before editing.
- Implement only the active task and its necessary prerequisites.
- Prefer the smallest coherent change that satisfies acceptance criteria.
- Do not silently redesign documented architecture. Record material changes in `docs/DECISIONS.md`.
- Avoid duplicated business logic and oversized presentation components.
- Public menu must work well at 320px width and on weak mobile connections.
- The public menu must never require authentication.
- The layout must work when a product has no image.

## Definition of Done
A task is DONE only when:
1. all acceptance criteria are satisfied;
2. relevant lint/typecheck/tests pass;
3. no known regression was introduced;
4. documentation affected by the implementation is synchronized;
5. `tasks/BACKLOG.md` status is updated;
6. task completion notes contain what changed, checks run and any follow-up;
7. `tasks/CURRENT.md` points to the next READY task or states that no task is active.

## Status model
`PLANNED -> READY -> IN_PROGRESS -> BLOCKED -> DONE`

Only one implementation task should normally be `IN_PROGRESS`.

## Documentation synchronization
- Product behavior/scope change -> `docs/PRD.md`
- Architecture change -> `docs/ARCHITECTURE.md`
- Schema/RLS/storage change -> `docs/DATABASE.md`
- Visual/UI convention change -> `docs/DESIGN_SYSTEM.md`
- Important irreversible/non-obvious decision -> `docs/DECISIONS.md`
- Task progress -> `tasks/BACKLOG.md`, `tasks/CURRENT.md`, active task file

## Start-of-session protocol
Before coding, report briefly:
- active task and objective;
- relevant existing implementation;
- files likely to change;
- implementation plan;
- blockers/questions, if any.

If the active task is clear, do not ask for permission for routine implementation details.

## End-of-task protocol
After implementation:
- run relevant checks;
- verify every acceptance criterion explicitly;
- update task status and completion notes;
- move a completed task from `tasks/active/` to `tasks/completed/`;
- update `tasks/BACKLOG.md`;
- set the next unblocked task to READY/active in `tasks/CURRENT.md`.

Do not mark a task DONE just because code was written.
