# Product specification — Relica's Rock Bar

**Status:** Proposed baseline for validation. **Owner:** Relica's / Maurício. **Product:** Public marketing website + manageable show agenda, connected to existing QRCodex digital menu.

## Goals
- Help visitors discover upcoming shows quickly, explore drinks/petiscos, learn about the venue and find it.
- Give Maurício a simple, secure way to publish, edit, unpublish and reorder events without developer assistance.
- Reuse existing QRCodex menu, admin and data instead of recreating them.
- Make the website easy to maintain and fast on mobile.

## Audiences
- Guests checking today's/next shows, admission information, address and hours.
- Prospective guests looking for atmosphere, food and drinks.
- Venue owner/admin managing event content and venue information.

## Public information architecture
- `/` — Homepage: header → cinematic hero → torn-paper upcoming shows → drinks/petiscos → about the venue → gallery → location/hours → footer.
- `/agenda` — Full agenda with upcoming events, optional past events and event details.
- `/agenda/[slug]` — Event details, only if justified by content; external ticket link where provided.
- `/cardapio` — Entry to existing QRCodex menu, integration approach TBD.
- `/sobre` and `/contato` — Optional pages only if homepage cannot cover needs.
- Existing QRCodex `/<establishment-slug>`, `/<establishment-slug>/cardapio`, `/<establishment-slug>/agenda` must remain compatible until migration is approved.

## Homepage sections
1. **Hero:** venue identity or featured upcoming show; primary CTA `Ver agenda`, secondary `Ver cardápio` or contact. Hero content must not imply an event is happening today unless verified.
2. **Agenda:** 3–4 upcoming published events, readable date/title/time, optional admission and image, link to complete agenda. Single torn-paper treatment.
3. **Drinks & petiscos:** one dominant photo, short copy, `Ver cardápio` CTA; do not invent menu items.
4. **A casa:** venue photo, short introduction, real features (live shows, karaoke, bands).
5. **Galeria:** curated real venue photography, limited images.
6. **Localização:** verified address, hours, external directions and contact.
7. **Footer:** navigation, social links, contact and legal information.

## Admin MVP
- Secure sign-in and access only for authorized establishment users.
- Event list with draft/published/cancelled states (verify existing model before adding any state).
- Create/edit event: title, slug, start datetime with timezone, optional end, description, flyer, cover/tribute, admission text or amount, external URL, status.
- Publish/unpublish, upload/replace flyer, sort by event start, preview and delete with confirmation.
- Venue settings and gallery management are later-phase unless already supported by QRCodex.
- Menu management remains in existing QRCodex admin.

## MVP exclusions
Online payments, ticketing engine, table-booking engine, user accounts for guests, generic CMS, newsletter platform, loyalty, music voting/queue UI, multi-tenant SaaS onboarding, billing, advanced analytics dashboard.

## Success criteria
- Visitors can reach next shows and menu quickly from mobile.
- Owner can manage agenda without a code deployment.
- Published events update publicly; unpublished events do not leak.
- Existing menu works unchanged, including mobile and QR links.
- Site remains accessible, performant and easy to extend.

## Known content (verify before publishing)
Brand: Relica's Rock Bar. Instagram: `@relicasrockbar`. Venue is in southern São Paulo. Screenshots show Rua Manoel de Lima, 178 and hours Wed–Thu 19:30–02:00, Fri–Sat 19:30–05:00; these are **unverified operational details** and must be confirmed. Contact shown in screenshots: (11) 91146-0550, **verify usage and permission**.
