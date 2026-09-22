# TASK-001 — Bootstrap Next.js application and quality scripts

**Epic:** Foundation  
**Status:** DONE  
**Dependencies:** None

## Objective
Create a clean, runnable application foundation matching the documented stack so subsequent tasks can build on a stable baseline.

## Requirements
- Initialize Next.js using App Router and TypeScript.
- Enable TypeScript strict mode.
- Configure Tailwind CSS using the current stable setup supported by the generated Next.js project.
- Use `src/` directory.
- Add a minimal root layout and placeholder home page; do not implement the Relica's menu UI yet.
- Add/confirm scripts for development, build, lint and typecheck.
- Add a sensible `.gitignore` and `.env.example` placeholder without secrets.
- Preserve the repository documentation/task structure.
- Do not install Supabase in this task; that belongs to TASK-002.

## Acceptance criteria
- [x] `npm install` succeeds.
- [x] `npm run dev` can start the application.
- [x] `npm run build` succeeds.
- [x] `npm run lint` succeeds.
- [x] `npm run typecheck` succeeds.
- [x] TypeScript strict mode is enabled.
- [x] App Router uses the `src/app` structure.
- [x] No Supabase implementation exists yet.
- [x] Existing `docs/` and `tasks/` files remain intact.

## Likely files
- `package.json`
- `tsconfig.json`
- `next.config.*`
- `postcss.config.*`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `.gitignore`
- `.env.example`

## Non-goals
- Database
- Authentication
- Supabase
- Final branding
- Menu components
- Admin components

## Completion notes
- Implementation summary: Confirmed the Next.js App Router and strict TypeScript baseline; configured Tailwind CSS and PostCSS, added the typecheck script, and added a tracked `.env.example` placeholder.
- Checks run: `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build` all passed. The existing `next dev` server at `http://localhost:3000` returned HTTP 200.
- Acceptance criteria result: All criteria satisfied.
- Follow-up/risks: Supabase environment contract and clients belong to TASK-002; no TASK-002 implementation was started.
