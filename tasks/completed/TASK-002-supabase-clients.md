# TASK-002 — Add environment contract and Supabase clients

**Epic:** Foundation  
**Status:** DONE  
**Dependencies:** TASK-001

## Objective
Define the environment variables and Supabase client boundaries needed by subsequent database, public-menu and admin tasks.

## Requirements
- Document required public and server-only environment variables in `.env.example` without secrets.
- Add only the Supabase packages needed for browser and server clients.
- Create server and browser clients using the current Next.js and Supabase guidance when this task is implemented.
- Keep secrets out of browser bundles and source control.
- Avoid database schema, migrations, auth flows, admin UI and menu implementation in this task.

## Acceptance criteria
- [x] `.env.example` describes the required variables without real credentials.
- [x] Server and browser client modules can be imported from their intended runtimes.
- [x] No service-role key is exposed to client code.
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass.

## Completion notes
- Implementation summary: Added `@supabase/supabase-js` and `@supabase/ssr`, a browser client and a request-scoped server client, and an environment contract for the project URL and publishable key. Both clients use the publishable key and therefore remain subject to RLS.
- Checks run: `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed. Source scan found no privileged key usage.
- Acceptance criteria result: All criteria satisfied. Modules compile in their intended Next.js runtimes; no live Supabase connection was attempted because project credentials are not configured.
- Follow-up/risks: Implement session refresh through the Next.js Proxy before protected admin authentication. Database schema and RLS belong to subsequent tasks.
