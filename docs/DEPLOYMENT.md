# Production Deployment

## Endpoints
- Application: `https://qrcodex-eight.vercel.app`
- Public menu: `https://qrcodex-eight.vercel.app/relicas`
- Supabase project: `qrcodex-production` (`xybkiiuekjjchxxoxlyi`)

Production uses a Supabase project distinct from development. Vercel receives only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; database passwords and administrative keys must never be configured in the application deployment.

## Database rollout
Apply versioned migrations first, followed by `supabase/content/relicas_establishment.sql` and `supabase/content/relicas_menu.sql`. Never apply `supabase/seed.sql` to production.

The initial administrator is created through a trusted Supabase administrative path and then linked to the establishment with `supabase/bootstrap/014_initial_admin_membership.sql`. Application authorization continues to depend on `establishment_users`, server-side membership resolution and RLS.

## Authentication
The production Auth site URL is `https://qrcodex-eight.vercel.app`; the same origin is allow-listed for redirects. Custom SMTP and email invitations remain future onboarding capabilities.

## Release verification
Before a production release, run `npm run lint`, `npm run typecheck` and `npm run build`, then verify the public menu, unauthenticated admin redirect, authenticated owner access and responsive layouts over HTTPS.
