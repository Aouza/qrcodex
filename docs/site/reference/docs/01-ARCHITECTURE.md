# Technical architecture and stack

## Guiding choice
Start with a **separate public website** (Next.js) that integrates with the existing QRCodex product. Do not duplicate its menu schema, admin, or event CRUD. Reassess whether to unify into the QRCodex repository only after auditing actual routes, deployment, and shared ownership.

## Recommended stack
- Next.js App Router + React + strict TypeScript (use compatible stable versions pinned by lockfile).
- Tailwind CSS, CSS custom properties for design tokens; custom UI components; Radix primitives only where needed.
- Supabase PostgreSQL, Auth, Storage and RLS **through existing QRCodex contracts**, subject to integration audit.
- Zod for validation; React Hook Form only for complex interactive forms.
- Server Components by default; Route Handlers/Server Actions for approved authenticated operations.
- Vitest + React Testing Library; Playwright for a few critical smoke journeys when ready.
- Vercel hosting, image optimization, basic Web Vitals/analytics after consent review.

## Proposed repository structure
```text
src/
  app/
    (site)/page.tsx
    (site)/agenda/page.tsx
    (site)/agenda/[slug]/page.tsx
    (site)/cardapio/page.tsx
    layout.tsx
  components/
    layout/  home/  events/  ui/
  features/
    events/      # domain models, public queries, view models
    venue/       # opening hours, contact and address
    menu/        # integration adapter, no duplicate menu CRUD
  lib/
    env.ts
    qrcodex/     # audited integration contract
    supabase/    # only if required by chosen approach
  styles/
    globals.css
public/assets/
  brand/ hero/ textures/ menu/ venue/ gallery/ events/
```
If admin is reused from QRCodex, do **not** create a second `/admin` in this repository.

## Data ownership
- **QRCodex owns** existing menu products/categories, venue identity and current event data/admin if those are implemented.
- **Relica's site owns** presentation, static/editorial content and display adapters.
- One authoritative event source; no manual synchronization of two event databases.

## Event read flow
Visitor → Next.js server render → authorized public/published-only read contract → map data to `EventCard` → cached public page. Define revalidation/invalidation based on actual integration (webhook, tag revalidation or short TTL); do not promise immediate updates until tested.

## Performance
Optimize hero and event images, reserve aspect ratios, lazy-load below fold, preload only critical fonts, avoid autoplay video and heavy animation libraries. Ensure layout works without JS where feasible.

## Deployment environments
Local, preview and production. Separate environment variables and secrets. Never copy production service-role credentials to public frontend. Confirm canonical domain, redirects, analytics and preview access before deployment.

## Explicitly not needed
Redux, GraphQL, microservices, separate Express API, message queue, custom auth service, generalized CMS and duplicated menu backend.
