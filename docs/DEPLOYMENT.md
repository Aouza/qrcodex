# Production Deployment

## Endpoints
- Application: `https://qrcodex-eight.vercel.app`
- Current public Hub: `https://qrcodex-eight.vercel.app/relicas`
- Current public menu: `https://qrcodex-eight.vercel.app/relicas/cardapio`
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
