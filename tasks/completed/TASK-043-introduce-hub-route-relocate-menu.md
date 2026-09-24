# TASK-043 — Introduce Hub route and relocate menu

**Epic:** Bar Hub Foundation
**Status:** DONE
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
- [x] `/relicas` renders the Hub shell.
- [x] `/relicas/cardapio` preserves search, categories, products, availability and media.
- [x] Direct menu deep links work without passing through the Hub.
- [x] Public reads remain anonymous and RLS-protected.
- [x] Loading, error and not-found behavior remains controlled.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Introduced a real shared-host Hub shell at `/[slug]` with establishment identity and only the implemented menu destination.
- Moved the existing menu page and its loading/error states to `/[slug]/cardapio` without changing the anonymous loader or catalog behavior.
- Updated admin links and cache revalidation to target the nested menu route; establishment settings also refresh the Hub.
- Deployed and smoke-tested `/relicas` and `/relicas/cardapio` in production.
- Checks: 30 unit tests, `npm run lint`, `npm run typecheck`, `npm run build`.
