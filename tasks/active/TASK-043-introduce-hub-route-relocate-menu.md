# TASK-043 — Introduce Hub route and relocate menu

**Epic:** Bar Hub Foundation
**Status:** READY
**Dependencies:** TASK-042

## Objective
Create the public Hub route and move the existing menu experience to a dedicated nested route without rewriting menu behavior.

## Requirements
- `/[slug]` renders the establishment Hub shell.
- `/[slug]/cardapio` renders the existing menu experience.
- Reuse existing menu components, loader and public RLS path.
- Preserve controlled behavior for unknown or inactive establishments.
- Keep the temporary shared-host deployment working without `relicas.com.br`.
- Do not implement Agenda or Music destinations yet.

## Acceptance criteria
- [ ] `/relicas` renders the Hub shell.
- [ ] `/relicas/cardapio` preserves search, categories, products, availability and media.
- [ ] Direct menu deep links work without passing through the Hub.
- [ ] Public reads remain anonymous and RLS-protected.
- [ ] Loading, error and not-found behavior remains controlled.
- [ ] Lint, typecheck, tests and build pass.

## Completion notes
Fill this section when implemented.
