# TASK-045 — Build public Hub UI foundation

**Epic:** Bar Hub Foundation
**Status:** DONE
**Dependencies:** TASK-044

## Objective
Turn the functional Hub shell into the polished, mobile-first establishment landing experience defined by the design system.

## Requirements
- Establishment identity is the first-viewport signal.
- Cardápio is the dominant destination and remains reachable in one tap.
- Only real destinations and approved contacts appear.
- Layout follows the dark contemporary Relica's identity without resembling a generic link list.
- Loading and error states align with the finished Hub composition.
- Do not add Agenda or Music placeholders.

## Acceptance criteria
- [x] The Hub is polished and coherent from 320 px through desktop.
- [x] The Cardápio destination has clear hierarchy and accessible focus/touch behavior.
- [x] Logo, long establishment names and optional contacts do not overflow.
- [x] No ordering/payment affordance or fake module is present.
- [x] Production screenshots confirm the first viewport and navigation.
- [x] Lint, typecheck, tests and build pass.

## Completion notes
- Rebuilt the Hub around a full-bleed, establishment-first hero with Relica's scoped editorial image, solid readability layer, logo, name and concise context.
- Promoted Cardápio to the only primary full-width destination and kept optional real contacts tertiary; no future-module placeholders were added.
- Aligned loading and error states with the new visual language.
- Verified production at 320 x 720 and 1280 x 800 with no horizontal overflow, then exercised the Cardápio navigation successfully.
- Checks: `node --test tests/*.test.mjs` (33 passed), `npm run lint`, `npm run typecheck`, `npm run build`, and Vercel production build.
