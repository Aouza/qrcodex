# TASK-026 — Import approved real menu content

**Epic:** Establishment & Release
**Status:** READY
**Dependencies:** TASK-021, TASK-024

## Objective
Import the approved Relica's menu catalog into the development database with accurate category, product and price data.

## Requirements
- Use only explicitly approved source material; do not invent products, prices or descriptions.
- Map every product to an existing category and preserve integer-cent money storage.
- Make the import repeatable without duplicating records or overwriting later admin edits unexpectedly.
- Keep product images optional and attach only approved item-specific media.
- Validate public rendering and representative availability/image states after import.

## Acceptance criteria
- [ ] Approved products, categories and prices match their source.
- [ ] Re-running the import creates no duplicates.
- [ ] Every product belongs to the correct establishment/category.
- [ ] Public menu remains responsive and usable with the real catalog size.
- [ ] Lint, typecheck, tests, SQL import verification and build pass.

## Completion notes
Fill this section when implemented.
