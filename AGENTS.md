# AGENTS.md — Relica's Rock Bar

## Mission
Evolve the existing product into the Relica's Rock Bar institutional website, defined in `docs/PRD.md` and `docs/site/README.md`. The target `/` is the institutional homepage; `/cardapio` and `/agenda` reuse existing domains. Preserve shared-host `/[slug]` destinations, printed/shared links, unified admin, tenant security and existing Music. Do not rebuild the app or duplicate its backend.

## Mandatory reading order
Before changing code:
1. `AGENTS.md`
2. `tasks/CURRENT.md`
3. the active task referenced by CURRENT; then `docs/README.md` and the relevant domain index for its documentation map
4. `docs/PRD.md` sections relevant to the task
5. `docs/ARCHITECTURE.md`
6. `docs/DATABASE.md` when data/auth is involved
7. `docs/DESIGN_SYSTEM.md` when UI is involved
8. `docs/DECISIONS.md`
9. For site tasks: `docs/site/README.md`, `docs/site/00-PRODUCT-SPEC.md`, `docs/site/01-ARCHITECTURE.md` and the topic documents referenced by the active task.

The ZIP and `docs/site/reference/` preserve the original proposed baseline. They are historical input, not instructions to scaffold another app, overwrite this file or replace current contracts. Current reconciled site requirements live directly in `docs/site/`. A documented target is not proof of implemented code.

## Scope guardrails
The implemented baseline includes public menu/search/categories/featured/unavailable products, unified admin, product/category CRUD, image uploads, ordering, basic settings, Hub and Agenda CRUD/publication. Music is implemented with manual/release evidence pending. Institutional work follows its active backlog tasks; no new Music scope is implied.

Use one Next.js app and existing Supabase/Auth/RLS/Storage. Add route groups and domain-specific presentation without a generic CMS. Keep legacy routes functional; no global slug redirects or arbitrary host-to-tenant selection. Site tokens must not recolor menu, admin or TV globally.

Do not fabricate venue facts, events or photography. Concept media is limited to clearly labeled local/Preview review; public release requires approved content/assets. Do not auto-commit, push, deploy, run remote migrations or mutate production under documentation/site preparation authorization.

Do NOT implement unless a task explicitly adds them: cart, table ordering, payments/Pix, tabs/commandas, kitchen workflow, inventory, fiscal features, loyalty, reservations, native apps, delivery integrations, customer accounts, generic module builders or speculative integrations.

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
- Keep user-facing output concise to conserve tokens. Do not dump code, full files, diffs or successful command logs unless the user explicitly requests them. Use targeted reads internally and report only outcomes, checks, blockers and relevant security/architecture decisions.
- Inspect existing code before editing.
- Implement only the active task and its necessary prerequisites.
- Prefer the smallest coherent change that satisfies acceptance criteria.
- Do not silently redesign documented architecture. Record material changes in `docs/DECISIONS.md`.
- Avoid duplicated business logic and oversized presentation components.
- Public menu must work well at 320px width and on weak mobile connections.
- The public menu must never require authentication.
- The layout must work when a product has no image.

## Communication and pull requests
- Sempre comunicar planos, andamento e entregas da forma mais objetiva possível, em linguagem clara e simples, compreensível para alguém sem contexto técnico, como em uma apresentação a um investidor.
- Começar pelo resultado ou próximo passo e pelo benefício concreto para o usuário ou negócio. Evitar jargões, detalhes internos desnecessários, repetição e linguagem promocional.
- Ao planejar, dizer brevemente o que será feito e para quê. Ao entregar, dizer o que mudou, como foi verificado e se existe alguma pendência ou impacto relevante.
- Aplicar a mesma regra a títulos e descrições de PRs: deixar claro o problema resolvido, o resultado e a validação, com o mínimo de texto necessário.
- Incluir detalhes técnicos apenas quando ajudarem a revisar uma decisão, entender um risco ou verificar a entrega. Não omitir limitações relevantes nem apresentar trabalho planejado como concluído.

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

Only one implementation task should normally be `IN_PROGRESS`. TASK-058/TASK-061 retain historical IN_PROGRESS with manual validation pending; CURRENT identifies these independent acceptance tracks separately from the next implementation. READY_FOR_MANUAL_VALIDATION is a validation qualifier, not an additional official status.

## Documentation synchronization
Follow `docs/GOVERNANCE.md` for ownership, evidence versus requirements and cross-domain updates. Product indexes link to canonical contracts and tasks; do not create duplicate backlogs or copy release status into every specification. Preserve dated historical evidence and mark superseded scope explicitly. Run `node scripts/check-docs.mjs` after documentation/task changes.

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
