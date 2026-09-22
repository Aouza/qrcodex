# First prompt for Codex

Read `AGENTS.md` and `tasks/CURRENT.md`, then inspect all documentation required by the active task.

Before editing code, give me a concise execution brief containing:
1. the active task and its acceptance criteria;
2. the files/directories you expect to create or change;
3. your implementation plan;
4. any blocker that genuinely prevents implementation.

Then implement the active task only.

After implementation:
- run the relevant lint/typecheck/tests available at this stage;
- verify the acceptance criteria one by one;
- update the task tracking files according to `AGENTS.md`;
- do not begin the next implementation task in the same run unless I explicitly ask.
