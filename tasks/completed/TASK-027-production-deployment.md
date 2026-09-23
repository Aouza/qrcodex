# TASK-027 — Production deployment and environment setup

**Epic:** Establishment & Release
**Status:** DONE
**Dependencies:** TASK-012, TASK-021, TASK-024, TASK-025

## Objective
Deploy the validated MVP to Vercel with a separate production Supabase project and production-safe configuration.

## Requirements
- Create or select a production Supabase project separate from development.
- Apply versioned migrations and approved production content in order.
- Configure Vercel environment variables without exposing secrets.
- Deploy the current `main` branch and verify public/admin routes over HTTPS.
- Configure production Auth redirect/site URLs and bootstrap the initial admin through the trusted process.
- Do not reuse development credentials or data unintentionally.

## Acceptance criteria
- [x] Production uses a distinct Supabase project.
- [x] All migrations and approved menu content are applied successfully.
- [x] Vercel deployment builds and serves the permanent menu URL over HTTPS.
- [x] Admin authentication and tenant authorization work in production.
- [x] No development-only secrets or unintended records are exposed.
- [x] Production smoke checks pass on mobile and desktop.

## Completion notes
- Created the isolated `qrcodex-production` Supabase project and applied all five versioned migrations.
- Added and applied the approved production establishment/category bootstrap followed by all 91 approved menu products; the content integrity/idempotence test passed.
- Configured Vercel Preview and Production with only the public Supabase URL and publishable key. Privileged credentials remain local and ignored by Git.
- Deployed the application to `https://qrcodex-eight.vercel.app` and configured that domain as the Supabase Auth site/redirect URL.
- Created the initial Auth identity through the trusted administrative API and provisioned its owner membership with the audited bootstrap SQL.
- Verified public menu HTTP 200/content, unauthenticated admin redirect, email/password Auth, owner membership under RLS, 320 px and 1440 px layouts, image loading and browser console errors.
- Checks run: `npm run lint`, `npm run typecheck`, `npm run build`, production menu content test and HTTPS smoke checks.
- Follow-up: the GitHub repository could not be connected automatically by the Vercel account integration. CLI deployment is operational; automatic deploy-on-push remains optional setup.
