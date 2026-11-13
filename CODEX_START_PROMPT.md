# First prompt for Codex

Read `AGENTS.md`, `tasks/CURRENT.md` and the selected task, then use `docs/README.md` and the affected domain indexes to inspect the applicable contracts. Follow `docs/GOVERNANCE.md` for source ownership and synchronization; historical proposals are not current instructions.

For institutional tasks, start at `docs/site/README.md`; follow reconciled requirements, ADR-020 and the task plan, not the historical ZIP/extracted proposals. Preserve existing Menu/Agenda/admin/Music contracts.

Before editing code, give me a concise execution brief containing:
1. the active task and its acceptance criteria;
2. the files/directories you expect to create or change;
3. your implementation plan;
4. any blocker that genuinely prevents implementation.

Then implement the active task only.

After implementation:
- run the relevant lint/typecheck/tests available at this stage;
- verify the acceptance criteria one by one;
- synchronize the affected contracts and task tracking according to `AGENTS.md`/`docs/GOVERNANCE.md`; run `node scripts/check-docs.mjs` and repair links when moving a task;
- do not begin the next implementation task in the same run unless I explicitly ask.
