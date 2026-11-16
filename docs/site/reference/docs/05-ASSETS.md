# Asset production and delivery

## Principle
Use AI-generated images only for **concept and layout validation**. Before production, use authorized, authentic photos of the Relica's venue, its actual food/drinks and bands. Do not present AI images as real venue documentation.

## Asset inventory
| ID | File target | Purpose | Recommended source |
|---|---|---|---|
| A01 | `hero/hero-desktop.webp` | Main cinematic hero with negative space for text | Concept generated, replace with real photo |
| A02 | `hero/hero-mobile.webp` | Reframed mobile hero, subject visible | Dedicated crop/asset |
| A03 | `textures/torn-paper-top.svg` | Agenda top edge | Custom vector/mask |
| A04 | `textures/torn-paper-bottom.svg` | Agenda bottom edge | Custom vector/mask |
| A05 | `menu/drinks.webp` | Menu teaser | Real menu photo |
| A06 | `menu/petiscos.webp` | Optional menu secondary | Real menu photo |
| A07 | `venue/interior.webp` | A casa section | Real venue photo |
| A08–A10 | `gallery/*.webp` | Show, crowd, atmosphere | Licensed/approved real photos |
| A11 | `brand/logo-light.svg` | Light brand mark | Official vector |
| A12 | `brand/logo-dark.svg` | Dark brand mark | Official vector |
| A13 | `brand/favicon.svg` | Small brand mark | Approved brand source |
| A14 | `events/placeholder.webp` | Event fallback | Neutral branded asset |

## Asset handling
- Store static branding/illustration in `public/assets`; event flyers managed in existing QRCodex Storage.
- Use descriptive names, sensible responsive dimensions, WebP/AVIF where supported; SVG for clean vectors.
- Preserve focal point and space for overlay text; never bake UI copy into hero images.
- Provide image alt text separately, use empty alt for decorative assets.
- Ensure image licenses and permission for artist photos, logos and concert imagery.
- Prefer CSS for gradients and basic dividers; do not export unnecessary raster decorations.

## Initial production order
1. Hero desktop/mobile (initial concept already created in conversation).
2. Torn-paper top/bottom mask.
3. Approved venue/menu photography.
4. Gallery selection and crops.
5. Official logo variants and favicon.

## Delivery checklist
Check crop at 360px, 768px and 1440px; text contrast; file weight; image rights; actual source/credit; no invented venue identity; `next/image` sizing and lazy loading.
