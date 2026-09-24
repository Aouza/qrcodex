# Product Backlog

Status: `PLANNED | READY | IN_PROGRESS | BLOCKED | DONE`

Update this file whenever a task changes status. Do not reorder IDs after development starts.

## EPIC 01 — Foundation
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-001 | Bootstrap Next.js application and quality scripts | DONE | — |
| TASK-002 | Add environment contract and Supabase clients | DONE | TASK-001 |
| TASK-003 | Create initial database schema migration | DONE | TASK-002 |
| TASK-004 | Implement RLS policies and tenant authorization | DONE | TASK-003 |
| TASK-005 | Add Relica's development seed data | DONE | TASK-003, TASK-004 |

## EPIC 02 — Public Menu
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-006 | Create public establishment route and data loader | DONE | TASK-004, TASK-005 |
| TASK-007 | Build public menu shell/header and visual tokens | DONE | TASK-006 |
| TASK-008 | Build category navigation | DONE | TASK-007 |
| TASK-009 | Render products grouped by category | DONE | TASK-008 |
| TASK-010 | Add featured and unavailable states | DONE | TASK-009 |
| TASK-011 | Add client-side menu search | DONE | TASK-009 |
| TASK-012 | Add loading/empty/error states and mobile polish | DONE | TASK-010, TASK-011 |

## EPIC 03 — Authentication & Admin Shell
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-013 | Implement admin login/logout | DONE | TASK-004 |
| TASK-014 | Protect admin routes and resolve current establishment | DONE | TASK-013 |
| TASK-015 | Build admin dashboard/navigation shell | DONE | TASK-014 |
| TASK-031 | Add authenticated password security | BLOCKED | TASK-014, TASK-027; manual acceptance pending |
| TASK-032 | Compact public category navigation | DONE | TASK-008, TASK-022 |

## EPIC 04 — Product Administration
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-016 | Build admin product list and category filtering | DONE | TASK-015 |
| TASK-017 | Add create-product flow with validation | DONE | TASK-016 |
| TASK-018 | Add edit-product flow | DONE | TASK-017 |
| TASK-019 | Add fast availability toggle | DONE | TASK-018 |
| TASK-020 | Add product deactivate/delete flow | DONE | TASK-018 |
| TASK-021 | Add product image storage/upload | DONE | TASK-018 |

## EPIC 05 — Category Administration
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-022 | Build category list/create/edit flows | DONE | TASK-015 |
| TASK-023 | Add category active toggle | DONE | TASK-022 |
| TASK-024 | Add category reordering | DONE | TASK-022 |

## EPIC 06 — Establishment & Release
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-025 | Build basic establishment settings | DONE | TASK-015 |
| TASK-026 | Import approved real menu content | DONE | TASK-021, TASK-024 |
| TASK-027 | Production deployment and environment setup | DONE | TASK-012, TASK-021, TASK-024, TASK-025 |
| TASK-028 | Generate permanent QR asset and printable test sheet | BLOCKED | TASK-027; relicas.com.br acquisition, DNS and production routing required |
| TASK-029 | Run MVP end-to-end acceptance and mobile smoke test | PLANNED | TASK-028 |
| TASK-030 | Fix launch blockers and release MVP | PLANNED | TASK-029 |
| TASK-033 | Add establishment logo management | DONE | TASK-004, TASK-015, TASK-025 |
| TASK-034 | Refine unavailable product state | DONE | TASK-008 |

## EPIC 07 — Bar Hub Foundation
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-042 | Adopt Bar Hub product architecture | DONE | TASK-027, TASK-033 |
| TASK-043 | Introduce Hub route and relocate menu | READY | TASK-042 |
| TASK-044 | Add focused public Hub data loader | PLANNED | TASK-043 |
| TASK-045 | Build public Hub UI foundation | PLANNED | TASK-044 |
| TASK-046 | Integrate Hub and menu navigation | PLANNED | TASK-045 |
| TASK-047 | Run Hub production migration | PLANNED | TASK-046; custom domain optional for shared-host release |

## EPIC 08 — Agenda
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-048 | Design Agenda domain and add migration/RLS | PLANNED | TASK-047 |
| TASK-049 | Build public Agenda | PLANNED | TASK-048 |
| TASK-050 | Build Agenda admin CRUD | PLANNED | TASK-048 |
| TASK-051 | Add event image storage | PLANNED | TASK-050 |
| TASK-052 | Activate Agenda on Hub | PLANNED | TASK-049, TASK-050 |

## EPIC 09 — Music Requests
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-053 | Design Music lifecycle, security and abuse controls | PLANNED | TASK-052 |
| TASK-054 | Add Music database schema and RLS | PLANNED | TASK-053 |
| TASK-055 | Build public Music request UI | PLANNED | TASK-054 |
| TASK-056 | Build admin Music queue | PLANNED | TASK-054 |
| TASK-057 | Validate Music abuse controls | PLANNED | TASK-055, TASK-056 |
| TASK-058 | Activate Music on Hub | PLANNED | TASK-057 |

> Note: if task IDs are referenced in code/PRs, keep them stable. Correct typos in dependency text without renumbering tasks.

Media follow-up: TASK-021 handles real product image upload/replacement. TASK-025 should define how an approved establishment editorial image replaces the temporary illustrated menu hero.

Category media follow-up: TASK-022 should define a persisted category image field and admin upload/replacement flow for the temporary category illustrations. Until then, the public menu uses local Relica's defaults and a neutral fallback.

## Post-MVP parking lot
Not scheduled: generic module configuration UI, multi-establishment selection UI, analytics, search analytics, happy hour automation, promotions, Wi-Fi helper, polls/quizzes, now-playing integration, call waiter, ordering, commandas, payment, loyalty, commercial SaaS onboarding/billing.
