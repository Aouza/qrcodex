# TASK-009 — Render products grouped by category

**Epic:** Public Menu  
**Status:** DONE  
**Dependencies:** TASK-008

## Objective
Show the public menu's active products within their ordered category sections so customers can scan names, descriptions and prices.

## Requirements
- Use the products already returned by the public menu loader; do not hardcode menu content.
- Render each product within its matching active category section in configured order.
- Show name, optional description, price formatted as Brazilian currency and optional image.
- Keep the layout polished when an image or description is absent and usable at 320px.
- Keep category navigation and section anchors working after product content is added.
- Do not implement featured/unavailable presentation, search or empty/error states; those belong to later tasks.
- Do not add ordering or cart controls.

## Acceptance criteria
- [x] Active products appear under their matching active category in configured order.
- [x] Names, optional descriptions, prices and optional images render correctly without breaking no-image products.
- [x] The menu remains readable at 320px and category links reach the corresponding product sections.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Rendered loader-provided products under their matching category headings with a compact list item. Names, optional two-line descriptions, Brazilian prices and optional optimized Storage images are supported. Aligned the public shell with the updated design specification: near-black tokens, compact identity header, selected yellow category chips and scroll-aware navigation. No reference mockup imagery or fabricated product data was published.
- Checks run: Lint, typecheck and build passed. An isolated server render checked image/no-image, optional description and currency formatting. A temporary local preview with test-only products verified the visual layout at 320px and desktop, then was removed. The real `/relicas` route was checked at 320px for navigation, sticky behavior, category targeting and no horizontal overflow.
- Acceptance criteria result: All criteria satisfied in code and isolated fixtures. The development seed has no products, so product rows cannot yet be inspected on the live Supabase route.
- Follow-up/risks: TASK-010 handles featured/unavailable presentation; TASK-011 handles search; TASK-012 handles empty/error states. Approved product photography and real content are needed before the visual menu can match the photo-led references. Lint retains one non-failing warning in an unrelated `src/lib/supabase/server.ts` change.
