# TASK-026 — Import approved real menu content

**Epic:** Establishment & Release
**Status:** DONE
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
- [x] Approved products, categories and prices match their source.
- [x] Re-running the import creates no duplicates.
- [x] Every product belongs to the correct establishment/category.
- [x] Public menu remains responsive and usable with the real catalog size.
- [x] Lint, typecheck, tests, SQL import verification and build pass.

## Completion notes
- Implementation summary: Transcribed all 91 approved products from both printed-menu images into a deterministic, non-overwriting SQL import and applied it to the configured development database.
- Checks run: import in a rollback transaction, repeated live import, `supabase/tests/009_relicas_menu_content.sql`, public browser smoke check, lint, typecheck, 24 unit tests, build and diff check.
- Acceptance criteria result: All criteria pass; representative prices/descriptions, tenant ownership, count and rerun idempotence are asserted in SQL.
- Follow-up/risks: The pre-existing manually created test product remains intentionally untouched. Printed-menu food photography was not attached because it is illustrative rather than item-specific media.
