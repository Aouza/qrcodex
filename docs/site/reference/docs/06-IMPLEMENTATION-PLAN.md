# Delivery plan and milestones

## Phase 0 — Discovery and decisions
- Audit QRCodex codebase, data model, routes, RLS, deployments and event admin.
- Confirm public domain, canonical URLs, branding assets and actual venue details.
- Select integration strategy (link/rewrite/shared contract/merge) and document ADR.
- Create backlog with acceptance criteria; do not change production yet.

## Phase 1 — Site foundation
- Scaffold Next.js + TypeScript + Tailwind, formatting, linting, test setup.
- Create tokenized design system, layout container, header/footer, button, section heading.
- Establish mobile-first responsive grid and accessible navigation.
- Implement homepage with placeholders and static fixture data clearly marked as demo.

## Phase 2 — Visual homepage
- Hero with image and CTAs.
- Torn-paper agenda section with event card component.
- Drinks/petiscos, A casa, gallery, location, footer.
- Visual QA at mobile/tablet/desktop; replace concepts with approved assets.

## Phase 3 — Real content integration
- Integrate published events through approved QRCodex contract.
- Connect `/cardapio` entry to existing QRCodex menu.
- Validate empty/error/loading states and public content consistency.
- Verify admin workflow with Maurício and cache behavior.

## Phase 4 — Quality and launch
- Unit/component tests; a small number of end-to-end smoke tests.
- Accessibility, SEO metadata, sitemap/robots, social cards, performance budget.
- Preview review, verified contact/operating hours, domain, redirects and rollback.
- Production launch only after explicit approval.

## Suggested first Codex task
**Read all docs, inspect repository (if available), identify assumptions/conflicts and produce a proposed implementation plan. Do not edit files, install packages, commit or deploy until plan is approved.**

## Out of scope for launch
Guest login, payments, ticket sales, reservations engine, newsletters, loyalty, song request integration, full CMS, complex analytics.
