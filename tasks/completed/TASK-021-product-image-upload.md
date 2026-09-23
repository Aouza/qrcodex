# TASK-021 — Add product image storage/upload

**Epic:** Product Administration
**Status:** DONE
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
- [x] An authorized admin can attach an image to an owned product and see it in admin/public views.
- [x] Valid type and size limits reject unsafe or oversized files with clear feedback.
- [x] Cross-tenant upload, replacement and removal are denied by server checks and Storage policies.
- [x] Replacing an image removes or supersedes the previous object without leaving an orphan.
- [x] Removing an image restores `image_url` to null and the neutral fallback appears publicly.
- [x] Products without images remain fully usable.
- [x] Product deletion cleans up any owned image object or follows a documented safe cleanup strategy.
- [x] Upload UI works at 320px and desktop widths without overflow or overlap.
- [x] Storage policy tests plus `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added the public `product-images` bucket with tenant-aware write policies, server-side type/size/ownership validation, edit-page upload/replacement/removal controls, public/admin revalidation and image cleanup when a product is deleted.
- Checks run: `npm run lint`, `npm run typecheck`, `node --test tests/*.test.mjs` (18 passing), `npm run build`, and `supabase/tests/006_product_image_storage.sql` against the configured Supabase project.
- Acceptance criteria result: All criteria passed. The user confirmed the authenticated upload, replacement/removal and public presentation flow manually.
- Follow-up/risks: Images are limited to 768 KB so multipart uploads remain below the default Server Action request limit. Category images remain scoped to TASK-022.
