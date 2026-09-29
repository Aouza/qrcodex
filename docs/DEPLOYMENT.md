# Production Deployment

## Endpoints
- Application: `https://qrcodex-eight.vercel.app`
- Current public Hub: `https://qrcodex-eight.vercel.app/relicas`
- Current public menu: `https://qrcodex-eight.vercel.app/relicas/cardapio`
- Current public Agenda: `https://qrcodex-eight.vercel.app/relicas/agenda` (not yet linked from Hub navigation; direct access only until TASK-052)
- Future canonical domain: `https://relicas.com.br` (not yet acquired/configured)
- Supabase project: `qrcodex-production` (`xybkiiuekjjchxxoxlyi`)

Production uses a Supabase project distinct from development. Vercel receives only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; database passwords and administrative keys must never be configured in the application deployment.

Hub, Agenda and Music development may continue before domain acquisition. Do not generate the permanent QR, declare `relicas.com.br` canonical, redirect the shared-host route or change Auth production URLs until domain ownership, DNS, TLS and Vercel routing are verified.

## Database rollout
Apply versioned migrations first, followed by `supabase/content/relicas_establishment.sql` and `supabase/content/relicas_menu.sql`. Never apply `supabase/seed.sql` to production.

The initial administrator is created through a trusted Supabase administrative path and then linked to the establishment with `supabase/bootstrap/014_initial_admin_membership.sql`. Application authorization continues to depend on `establishment_users`, server-side membership resolution and RLS.

## Authentication
The production Auth site URL is `https://qrcodex-eight.vercel.app`; the same origin is allow-listed for redirects. Custom SMTP and email invitations remain future onboarding capabilities.

## Release verification
Before a production release, run `npm run lint`, `npm run typecheck` and `npm run build`, then verify the public Hub, direct menu route, unauthenticated admin redirect, authenticated owner access and responsive layouts over HTTPS.

### Shared-host Hub release — 2026-09-24
The Bar Hub migration is live on the current shared Vercel host:

- `/relicas` renders the establishment Hub and exposes Cardápio as the primary destination;
- `/relicas/cardapio` renders directly and provides an explicit 44 px `Início` control back to the Hub;
- Hub → Cardápio → Hub, browser Back and direct menu access were verified over HTTPS;
- menu search returned the expected three Heineken products with no browser console errors;
- unauthenticated `/admin` access redirected to `/admin/login`;
- local lint, typecheck, 33 focused tests and the production build passed;
- deployment `dpl_Evq5g6Y33Npfy5v7ADGWrga37nHT` reached `READY` and was assigned to `qrcodex-eight.vercel.app`.

This route migration required no database change. It does not declare `relicas.com.br` canonical and does not authorize permanent QR generation. Those actions remain blocked on domain ownership, DNS, TLS and Vercel routing verification.

### Agenda admin CRUD release — 2026-09-25
Commit `3bd2aa3` (TASK-050, admin CRUD for events with flyer management) went live on the current shared Vercel host, on top of the already-live public Agenda experience (TASK-049):

- production Supabase (`qrcodex-production`) already had every committed migration applied — including `20260924000001_agenda_events.sql` and `20260924000002_event_image_storage.sql` — so this release required no `db push` or migration;
- pre-deploy checks passed: lint, typecheck, 45 focused tests and the production build;
- post-deploy smoke tests (public, non-destructive) confirmed `/relicas` (200, links to Cardápio), `/relicas/cardapio` (200, Heineken products present), `/relicas/agenda` (200, renders its empty state with no error/failure strings), and `/admin` plus `/admin/events` both redirecting an unauthenticated request to `/admin/login`;
- deployment `dpl_GTmgPT7jecmykzBRvVeaf2Sp4zd8` reached `READY` and was aliased to `qrcodex-eight.vercel.app`.

Agenda remains intentionally absent from Hub navigation; activating it is TASK-052.
