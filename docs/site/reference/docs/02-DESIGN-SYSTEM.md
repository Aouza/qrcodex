# Design system — Rock Editorial Minimal

## Creative direction
Dark cinematic rock venue + modern editorial clarity. The design is energetic but **not visually noisy**. Keep the reference homepage's section order and one off-white torn-paper agenda section. No repetitive distressed backgrounds.

## Color tokens (provisional)
| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#101012` | Main dark background |
| `--color-surface` | `#19191C` | Cards, panels |
| `--color-foreground` | `#F0EDE7` | Primary text |
| `--color-muted` | `#A9A5A3` | Secondary text |
| `--color-accent` | `#C52D32` | CTA and accents |
| `--color-paper` | `#E9E3D9` | Agenda background |
| `--color-ink` | `#171719` | Text on paper |
| `--color-border` | `#353438` | Dividers |

Contrast must be verified; do not use accent red for small text without contrast checks.

## Typography
- Headings: condensed display family (e.g. **Barlow Condensed** or **Oswald**); avoid excessive distress on UI text.
- Body: modern readable sans (e.g. **Inter**).
- Fluid headline sizing via `clamp`, deliberate line-height and limited widths; all UI labels readable on mobile.
- Keep real text in HTML, not baked into hero photography.

## Layout and spacing
- Desktop max-width ~1200–1280px; mobile horizontal padding ~20px; tablet ~32px; desktop ~48px.
- Spacing scale 4/8/12/16/24/32/48/64/96; use responsive section padding.
- Clear hierarchy: one primary visual focus per section.
- Avoid more than one large photographic focal point in a section, except curated gallery and event cards.

## Sections
- Header: compact, clear nav, visible booking/contact action only if actually supported.
- Hero: one cinematic image with negative space on left, title, short subtitle and 1–2 CTAs.
- Agenda: **only** section with torn paper. Off-white background, readable event cards with optional flyers, date and action.
- Drinks: one strong food/drink photo and concise copy.
- A casa: real venue photography plus description and 2–3 features.
- Gallery: curated asymmetrical layout, not an infinite wall.
- Location: functional info, external directions; embed map only if it does not harm performance.
- Footer: compact brand and links.

## Component behavior
Buttons: primary solid accent, secondary outline; focus-visible ring, hover/active/disabled/loading states. Cards: clickable target, consistent aspect ratio, accessible labels. Motion: subtle 150–250ms transitions, respect `prefers-reduced-motion`. No automatic carousels.

## Responsive rules
- Mobile-first: stack hero text and imagery intelligently; ensure headline doesn't cover subject.
- Events can scroll horizontally with visible affordance, or use a vertical list; test usability before deciding.
- Navigation uses accessible mobile disclosure; no hover-only functionality.
- Tap targets ~44px; avoid fixed bars obscuring content.

## Accessibility
Semantic landmarks, heading hierarchy, keyboard navigation, alt text for meaningful photos, decorative images hidden, form labels, WCAG AA contrast targets, visible focus and reduced motion.
