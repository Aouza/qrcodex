# AGENTS.md — Relica's Rock Bar

## Mission
Build a responsive, accessible, fast, maintainable website for Relica's Rock Bar, with a manageable event agenda and integration with the existing QRCodex menu. Preserve existing QRCodex behavior and data isolation.

## Read before changing code
1. `docs/00-PRODUCT-SPEC.md`
2. `docs/01-ARCHITECTURE.md`
3. `docs/02-DESIGN-SYSTEM.md`
4. `docs/03-CONTENT-AND-ADMIN.md`
5. `docs/04-QRCODEX-INTEGRATION.md`
6. `docs/05-ASSETS.md`
7. `docs/06-IMPLEMENTATION-PLAN.md`
8. `docs/07-QUALITY-AND-SECURITY.md`
9. `docs/08-DECISIONS-AND-OPEN-QUESTIONS.md`

## Agent working rules
- Inspect the repository and existing QRCodex contracts before coding. Documentation describes target architecture, not proof of current implementation.
- Work in small, reviewable increments; provide plan, affected files, validation, and tradeoffs.
- Do not modify QRCodex production schema, RLS, storage, auth or routes without an explicit approved integration plan.
- Do not auto-commit, push, deploy, apply migrations, or alter production data without explicit authorization.
- Do not fabricate show dates, ticket prices, opening hours, menu items, reviews, availability, booking functionality or venue photographs.
- Avoid premature abstractions, speculative features, additional dependencies and duplicated CRUD.
- Use server components by default; client components only for interactive behavior.
- All admin mutations must be authenticated, authorized server-side, validated and scoped to establishment.
- Never expose service-role secrets in client bundles. RLS is mandatory, not optional.
- Accessibility, responsive behavior, image optimization and performance are acceptance criteria.
- Preserve the approved visual concept: cinematic dark editorial, restrained red, one torn-paper agenda section, generous negative space.
- Run available lint/typecheck/tests/build as appropriate; report anything not executed.
- Ask for a decision when integration contracts or product requirements are genuinely unknown.

## Definition of done
Functionality meets acceptance criteria, mobile and desktop are checked, empty/loading/error states exist, accessibility is considered, no unauthorized tenant data can be accessed, and changes are documented.
