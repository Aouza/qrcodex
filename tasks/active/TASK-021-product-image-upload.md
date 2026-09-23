# TASK-021 — Add product image storage/upload

**Epic:** Product Administration
**Status:** READY
**Dependencies:** TASK-018

## Objective
Allow an authorized administrator to upload, replace and remove an optional product image using tenant-aware Supabase Storage.

## Requirements
- Define and document the `product-images` bucket, delivery strategy, object path convention and tenant-aware Storage policies.
- Add versioned SQL/migration changes required for the bucket and policies; keep RLS and Storage authorization mandatory.
- Accept common web image formats with explicit size/type validation at the server boundary.
- Upload images only for products belonging to the server-resolved establishment.
- Use object paths that include the resolved `establishment_id` and product ID without accepting tenant ownership from the browser.
- Add image controls to product create/edit flows where coherent; a product must still be valid without an image.
- Support replacement and removal while preventing orphaned old objects.
- Keep the neutral empty-state thumbnail when `image_url` is null.
- Revalidate admin and public views after image changes.

## Acceptance criteria
- [ ] An authorized admin can attach an image to an owned product and see it in admin/public views.
- [ ] Valid type and size limits reject unsafe or oversized files with clear feedback.
- [ ] Cross-tenant upload, replacement and removal are denied by server checks and Storage policies.
- [ ] Replacing an image removes or supersedes the previous object without leaving an orphan.
- [ ] Removing an image restores `image_url` to null and the neutral fallback appears publicly.
- [ ] Products without images remain fully usable.
- [ ] Product deletion cleans up any owned image object or follows a documented safe cleanup strategy.
- [ ] Upload UI works at 320px and desktop widths without overflow or overlap.
- [ ] Storage policy tests plus `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
Fill this section when implemented:
- Implementation summary:
- Checks run:
- Acceptance criteria result:
- Follow-up/risks:
