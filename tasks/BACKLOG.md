# Product Backlog

Status: `PLANNED | READY | IN_PROGRESS | BLOCKED | DONE`

Update this file whenever a task changes status. Do not reorder IDs after development starts.

## EPIC 01 — Foundation
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-001 | Bootstrap Next.js application and quality scripts | DONE | — |
| TASK-002 | Add environment contract and Supabase clients | DONE | TASK-001 |
| TASK-003 | Create initial database schema migration | DONE | TASK-002 |
| TASK-004 | Implement RLS policies and tenant authorization | READY | TASK-003 |
| TASK-005 | Add Relica's development seed data | PLANNED | TASK-003 |

## EPIC 02 — Public Menu
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-006 | Create public establishment route and data loader | PLANNED | TASK-004, TASK-005 |
| TASK-007 | Build public menu shell/header and visual tokens | PLANNED | TASK-006 |
| TASK-008 | Build category navigation | PLANNED | TASK-007 |
| TASK-009 | Render products grouped by category | PLANNED | TASK-008 |
| TASK-010 | Add featured and unavailable states | PLANNED | TASK-009 |
| TASK-011 | Add client-side menu search | PLANNED | TASK-009 |
| TASK-012 | Add loading/empty/error states and mobile polish | PLANNED | TASK-010, TASK-011 |

## EPIC 03 — Authentication & Admin Shell
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-013 | Implement admin login/logout | PLANNED | TASK-004 |
| TASK-014 | Protect admin routes and resolve current establishment | PLANNED | TASK-013 |
| TASK-015 | Build admin dashboard/navigation shell | PLANNED | TASK-014 |

## EPIC 04 — Product Administration
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-016 | Build admin product list and category filtering | PLANNED | TASK-015 |
| TASK-017 | Add create-product flow with validation | PLANNED | TASK-016 |
| TASK-018 | Add edit-product flow | PLANNED | TASK-017 |
| TASK-019 | Add fast availability toggle | PLANNED | TASK-018 |
| TASK-020 | Add product deactivate/delete flow | PLANNED | TASK-018 |
| TASK-021 | Add product image storage/upload | PLANNED | TASK-018 |

## EPIC 05 — Category Administration
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-022 | Build category list/create/edit flows | PLANNED | TASK-015 |
| TASK-023 | Add category active toggle | PLANNED | TASK-022 |
| TASK-024 | Add category reordering | PLANNED | TASK-022 |

## EPIC 06 — Establishment & Release
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-025 | Build basic establishment settings | PLANNED | TASK-015 |
| TASK-026 | Import approved real menu content | PLANNED | TASK-021, TASK-024 |
| TASK-027 | Production deployment and environment setup | PLANNED | TASK-012, TASK-021, TASK-024, TASK-025 |
| TASK-028 | Generate permanent QR asset and printable test sheet | PLANNED | TASK-027 |
| TASK-029 | Run MVP end-to-end acceptance and mobile smoke test | PLANNED | TASK-028 |
| TASK-030 | Fix launch blockers and release MVP | PLANNED | TASK-029 |

> Note: if task IDs are referenced in code/PRs, keep them stable. Correct typos in dependency text without renumbering tasks.

## Post-MVP parking lot
Not scheduled: multi-establishment selection UI, analytics, search analytics, happy hour automation, promotions, events/shows, call waiter, ordering, commandas, payment, loyalty, commercial SaaS onboarding/billing.
