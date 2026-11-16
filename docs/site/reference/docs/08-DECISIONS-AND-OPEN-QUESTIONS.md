# Decisions, assumptions and open questions

## Accepted direction from design discussion
- Homepage order: hero → agenda → drinks/petiscos → a casa → gallery → location → footer.
- Dark cinematic editorial look, restrained red/off-white palette.
- Torn paper **only** around agenda section; fewer images and textures, more whitespace.
- Reuse QRCodex menu; owner needs event management.

## Proposed decisions (not yet approved)
- Separate Next.js site initially; integrate QRCodex rather than duplicating backend.
- Existing QRCodex admin remains source of truth for events if audit confirms sufficient functionality.
- Start menu integration as link; consider unified routing after audit.
- Venue static content in typed configuration initially, not general-purpose CMS.

## Decisions needed before implementation
1. Is the new website a separate repo/deployment or a redesign of the existing QRCodex public app?
2. Which QRCodex environment/repository is authoritative now? Verify, don't assume old URLs are current.
3. Is existing `/admin/events` complete enough for Maurício (draft/publish, flyer, pricing, event editing)?
4. Does the public menu need to appear under the same domain, or is navigation to existing menu acceptable for MVP?
5. Official logo/vector, actual photos, approved hero, event flyers and image permissions.
6. Exact address, hours, social links, booking policy, contact number and who receives inquiries.
7. Domain and analytics/consent requirements.

## ADR template
`ADR-XXX: Title` → Context / Options / Decision / Consequences / Rollback.

## Risks
- Duplicated event/menu models create conflicting content.
- Rewrites/proxy can break assets, auth or SEO.
- Incorrect RLS exposes another establishment's data.
- Synthetic images misrepresent the physical venue.
- Too many visual textures harm usability/performance.
