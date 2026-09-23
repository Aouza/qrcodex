# TASK-027 — Production deployment and environment setup

**Epic:** Establishment & Release
**Status:** READY
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
- [ ] Production uses a distinct Supabase project.
- [ ] All migrations and approved menu content are applied successfully.
- [ ] Vercel deployment builds and serves the permanent menu URL over HTTPS.
- [ ] Admin authentication and tenant authorization work in production.
- [ ] No development-only secrets or unintended records are exposed.
- [ ] Production smoke checks pass on mobile and desktop.

## Completion notes
Fill this section when implemented.
