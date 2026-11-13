# Product Backlog

Status: `PLANNED | READY | IN_PROGRESS | BLOCKED | DONE`

Update this file whenever a task changes status. Do not reorder IDs after development starts.

Read [task workflow](README.md) and [documentation governance](../docs/GOVERNANCE.md); product indexes link here rather than maintaining duplicate backlogs. IN_PROGRESS on TASK-058/061 denotes pending manual acceptance, not concurrent product implementation.

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
| TASK-028 | Generate permanent QR asset and printable test sheet | BLOCKED | TASK-027; approved institutional canonical domain, DNS and production routing required |
| TASK-029 | Run MVP end-to-end acceptance and mobile smoke test | PLANNED | TASK-028 |
| TASK-030 | Fix launch blockers and release MVP | PLANNED | TASK-029 |
| TASK-033 | Add establishment logo management | DONE | TASK-004, TASK-015, TASK-025 |
| TASK-034 | Refine unavailable product state | DONE | TASK-008 |

## EPIC 07 — Bar Hub Foundation
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-042 | Adopt Bar Hub product architecture | DONE | TASK-027, TASK-033 |
| TASK-043 | Introduce Hub route and relocate menu | DONE | TASK-042 |
| TASK-044 | Add focused public Hub data loader | DONE | TASK-043 |
| TASK-045 | Build public Hub UI foundation | DONE | TASK-044 |
| TASK-046 | Integrate Hub and menu navigation | DONE | TASK-045 |
| TASK-047 | Run Hub production migration | DONE | TASK-046; custom domain optional for shared-host release |

## EPIC 08 — Agenda
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-048 | Design Agenda domain and add migration/RLS | DONE | TASK-047 |
| TASK-049 | Build public Agenda | DONE | TASK-048, TASK-051 |
| TASK-050 | Build Agenda admin CRUD | DONE | TASK-048, TASK-051 |
| TASK-051 | Add event image storage | DONE | TASK-048 |
| TASK-052 | Activate Agenda on Hub | DONE | TASK-049, TASK-050 |

## EPIC 09 — Music Requests
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-053 | Design Music lifecycle, security and abuse controls | DONE | TASK-052 |
| TASK-054 | Add Music production schema and RLS | DONE | TASK-053 |
| TASK-055 | Build production Music requests and TV boundary | DONE | TASK-054 |
| TASK-056 | Build admin Music queue | DONE | TASK-054, TASK-055 |
| TASK-057 | Validate Music abuse controls | DONE | TASK-055, TASK-056 |
| TASK-058 | Activate Music on Hub — READY_FOR_MANUAL_VALIDATION | IN_PROGRESS | TASK-057; owner Production rehearsal active; physical/commercial release gates pending |

Production contract: `docs/MUSIC_PRODUCTION.md`. TASK-053–057 are DONE; TASK-058 records the approved Relica's owner rehearsal in production and pending physical/commercial/release gates. TASK-061 retains pending manual evidence. These manual tracks are independent of the current site implementation priority; no change of Music acceptance is implied.

## EPIC 11 — Experiments
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-060 | YouTube Music Requests POC | BLOCKED | TASK-052; YouTube OAuth/playlist env vars required |
| TASK-061 | POC YouTube Music Queue & TV Player — READY_FOR_MANUAL_VALIDATION | IN_PROGRESS | TASK-060, TASK-052; manual scenario pending |

## EPIC 10 — Administration Architecture
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-059 | Document unified admin information architecture | DONE | TASK-015, TASK-042 |

> Note: if task IDs are referenced in code/PRs, keep them stable. Correct typos in dependency text without renumbering tasks.

## EPIC 12 — Institutional Site
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-062 | Reconcile site documentation and plan incremental migration | DONE | TASK-047, TASK-052, TASK-059 |
| TASK-063 | Proteger e registrar a linha de base do site | DONE | TASK-062 |
| TASK-064 | Corrigir seleção temporal de eventos | DONE | TASK-063 |
| TASK-065 | Rejeitar datas inexistentes de eventos | READY | TASK-064 |
| TASK-066 | Proteger exclusão e recuperação de mídia de eventos | PLANNED | TASK-065 |
| TASK-067 | Definir contexto institucional e navegação | PLANNED | TASK-066 |
| TASK-068 | Adicionar cardápio institucional compartilhado | PLANNED | TASK-067 |
| TASK-069 | Adicionar Agenda institucional compartilhada | PLANNED | TASK-068 |
| TASK-070 | Integrar tokens e inventário de assets | PLANNED | TASK-063 |
| TASK-071 | Implementar Header Hero e Footer na raiz | PLANNED | TASK-069, TASK-070 |
| TASK-072 | Integrar eventos reais à homepage | PLANNED | TASK-064, TASK-065, TASK-066, TASK-069, TASK-071 |
| TASK-073 | Definir e migrar conteúdo institucional tipado | PLANNED | TASK-067 |
| TASK-074 | Editar conteúdo institucional no admin | PLANNED | TASK-073, TASK-072 |
| TASK-075 | Implementar Drinks e petiscos e A Casa | PLANNED | TASK-070, TASK-074 |
| TASK-076 | Implementar Galeria e Localização | PLANNED | TASK-075 |
| TASK-077 | Preparar SEO e desempenho institucional | PLANNED | TASK-076 |
| TASK-078 | Validar regressão integrada e acessibilidade | PLANNED | TASK-077 |
| TASK-079 | Preparar Preview e release institucional | PLANNED | TASK-078 |
| TASK-080 | Navegação institucional da home | BLOCKED | TASK-063; código e checks concluídos, revisão em navegador pendente |

See [institutional plan](../docs/site/06-IMPLEMENTATION-PLAN.md). The site remains the user's confirmed priority. TASK-064 corrected local event selection; TASK-065 is the next READY increment. TASK-080 delivered the first home navigation increment and awaits browser review. TASK-071 will reuse its header. Optional gallery administration and extra event states require their own scoped tasks.

Media follow-up: product and category upload/replacement are implemented. A future scoped task must define how an approved establishment editorial image replaces the temporary illustrated menu hero; do not reinterpret completed TASK-025 as an active uploader requirement.

Category media: nullable `categories.image_url`, bucket/policies and admin upload/replacement/removal already exist. Persisted media takes precedence; local Relica's illustrations and the neutral fallback apply only when no image is stored. See DATABASE and the Menu index.

## EPIC 13 — Documentation Governance
| ID | Task | Status | Depends on |
|---|---|---|---|
| TASK-081 | Organizar documentação por plataforma/produto e conciliar contratos | DONE | TASK-062, TASK-059 |

[Completion and evidence](completed/TASK-081-documentation-organization.md). Documentation maintenance only; TASK-064 was the next product implementation at that checkpoint. Follow CURRENT for today's priority. No changes to pending Music acceptance.

## Post-MVP parking lot
Not scheduled: generic module configuration UI, multi-establishment selection UI, analytics, search analytics, happy hour automation, promotions, Wi-Fi helper, polls/quizzes, now-playing integration, call waiter, ordering, commandas, payment, loyalty, commercial SaaS onboarding/billing.
