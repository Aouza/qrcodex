# Relica's Rock Bar

Institutional website evolution of the existing mobile-first menu, Hub, Agenda and unified admin. The initial home at `/` presents the institutional navigation. The full site and its integrated routes are tracked in the incremental plan.

## Source of truth
Start at [Documentation by platform and product](docs/README.md). It maps Site, Card?pio, Agenda, Hub, M?sica and Admin to their authoritative contracts, code and tasks. [Documentation governance](docs/GOVERNANCE.md) defines what to update with each change; `node scripts/check-docs.mjs` checks links, coverage and task consistency.

- Product: `docs/PRD.md`
- Agent workflow: `AGENTS.md`
- Current work: `tasks/CURRENT.md`
- Backlog: `tasks/BACKLOG.md`
- Architecture: `docs/ARCHITECTURE.md`
- Data/security: `docs/DATABASE.md`
- UI rules: `docs/DESIGN_SYSTEM.md`
- Decisions: `docs/DECISIONS.md`
- Site entry point: [docs/site/README.md](docs/site/README.md)
- Incremental site plan: [docs/site/06-IMPLEMENTATION-PLAN.md](docs/site/06-IMPLEMENTATION-PLAN.md)

## Start development
Open the repository in Codex and use the prompt in `CODEX_START_PROMPT.md`. Check `tasks/CURRENT.md` for the next task.

Site preparation is now the execution priority. Music manual/release gates remain pending and independent. The source ZIP and extracted `docs/site/reference/` are historical proposals; follow the reconciled documents directly under `docs/site/`.

The optional development seed is `supabase/seed.sql`; see `docs/DATABASE.md` before applying it to a confirmed development database. It is not a production migration.
