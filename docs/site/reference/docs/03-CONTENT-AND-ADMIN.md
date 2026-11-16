# Content model and administration

## Content governance
Maurício manages published events and, where supported, venue information. Menu products/categories remain in QRCodex. No guest account is required.

## Proposed event display contract (map from existing schema; not a migration)
```ts
type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  startsAt: string; // ISO timestamp with timezone
  endsAt?: string | null;
  description?: string | null;
  flyerUrl?: string | null;
  admissionLabel?: string | null;
  externalUrl?: string | null;
  status: 'published' | 'cancelled'; // map only supported statuses
};
```
Admin draft state is an editorial requirement; check QRCodex before changing database enums.

## Public rules
- Only authorized public events appear.
- Sort future shows ascending by start time in `America/Sao_Paulo`.
- If no future shows: display a friendly empty state and Instagram/contact link.
- Event details must never fabricate prices, performers or ticket URLs.
- External links should be explicitly labeled and validated.
- Past events can be hidden from default listing.

## Admin journeys
1. Sign in through existing QRCodex admin.
2. Open events list and select create/edit.
3. Complete required title/date, optional flyer/description/admission/external link.
4. Preview, publish, update or unpublish.
5. Public site reflects changes according to tested cache policy.

## Validation and safety
Validate input with Zod server-side, verify membership for every write, scope all records by `establishment_id`, apply RLS and Storage policies, limit file type/size, sanitize rendered content, use safe external links. Confirm delete behavior (soft delete vs hard delete) with current QRCodex model.

## Editorial content
Keep venue headline, intro, hours, address, social handles and contact in a typed config initially. Move to editable settings only if owner requires frequent updates; avoid a generic page builder.

## Menu
Use QRCodex as the source of truth. The public website links/embeds/routes to existing menu according to `04-QRCODEX-INTEGRATION.md`. No parallel menu editor.
