# Quality, security, accessibility and SEO

## Test strategy
- Unit: date formatting/timezone, event filtering/sorting, data mappers, validation.
- Component: event cards, navigation, hero CTAs, empty states, mobile menu.
- Integration: published-only read, menu link/rewrite, event data mapping, error fallback.
- E2E smoke: home → agenda → event, home → menu, contact/directions, admin publish → public visibility (using safe test environment).

## Security
- Use existing Supabase Auth and membership authorization for admin; tenant scoping with `establishment_id` and RLS.
- Server-side authorization on every mutation; never rely on hidden buttons as security.
- No service-role keys in client or logs; secrets via environment configuration.
- Validate input, file uploads, links and image MIME/size; use safe redirect allowlists.
- Confirm storage policies, rate limiting as needed and production backups with QRCodex owner.

## Accessibility
- WCAG 2.2 AA as target; keyboard support, focus indicators, semantic structure, color contrast, accessible forms and navigation.
- Images have meaningful alt when informational; decorative assets hidden.
- Honor reduced-motion preferences; avoid autoplay audio/video.

## SEO
- Server-render important content; meaningful page titles/descriptions, canonical URLs, Open Graph images, sitemap and robots.
- Venue structured data only from verified facts; avoid invented reviews, ratings, ticket inventory and opening times.
- Events structured data only when dates/venues/prices are verified and published.

## Performance targets (initial, validate on real devices)
- Aim for Core Web Vitals good thresholds: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75.
- Optimize hero, avoid oversized images, reserve image dimensions, lazy-load gallery and map, limit third-party scripts.

## Launch checklist
Correct URLs; valid metadata; tested mobile; accessible CTAs; authorized images; confirmed address/hours/contact; no demo event data; admin tested; redirects and QR links intact; rollback plan documented.
