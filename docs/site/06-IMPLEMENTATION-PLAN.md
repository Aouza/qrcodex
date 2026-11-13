# Relica's Rock Bar — Implementation Plan

> **For agentic workers:** use the execution skill appropriate to the approved method (`executing-plans` for native execution or `subagent-driven-development` only when authorized). Execute one active task at a time. Task files use checkboxes for acceptance. Do not auto-commit or deploy.

**Goal:** entregar a homepage institucional e integrar menu/Agenda/admin existentes sem interromper acesso ou perder dados.
**Architecture:** uma aplicação Next.js e um Supabase, apresentação `(site)`, contexto por host aprovado e reutilização de domínios. As rotas por slug permanecem.
**Tech Stack:** Next.js App Router, React, TypeScript strict, Tailwind/CSS Modules, Supabase, Zod, node:test e Vercel existentes.
**Spec:** [00-PRODUCT-SPEC.md](00-PRODUCT-SPEC.md), [arquitetura](01-ARCHITECTURE.md), [ADR-020](../DECISIONS.md). Plano de destino incremental; linha de base e navegação inicial têm evidências próprias. Estado de execução pertence a CURRENT/BACKLOG e às tarefas.

## Restrições gerais
- Manter uma aplicação e um admin; sem novo CMS/API/catálogo/CRUD paralelo ou rebuild.
- Manter rotas legadas, tenant, RLS e contrato de centavos/flyer. Sem alteração implícita de Music.
- Server Components por padrão; contexto server-side allowlisted; sem segredos no browser/log.
- Mobile desde 320 px, alvos de 44 px, foco/teclado, contraste/reduced motion, sem recolorir módulos existentes.
- Conteúdo real confirmado e mídia autorizada. Conceito identificado só para revisão.
- Migrations aditivas, ensaio isolado e recuperação antes de publicação. Nenhuma ação externa sem autorização específica.
- Testar durante o trabalho; confirmar domínio e QR depois da validação de compatibilidade.

## Foco de revisão
| Condição | Verificação que a cobre |
|---|---|
| Histórico esconde evento futuro ou início passado ainda em andamento | TASK-064: 24 passados + futuro, fim >= agora |
| Data inválida normaliza silenciosamente; mídia desaparece parcialmente | TASK-065: 31/02 e madrugada; TASK-066: falhas independentes DB/Storage |
| Host/slug colide ou mistura tenants | TASK-067: hosts allowlisted e inventário; TASK-068/069: rotas e tenants reais de fixture |
| Agenda falha ou cache mantém despublicado | TASK-072: erro isolado, publish/unpublish e freshness em build/start |
| Deploy tem dados incompletos ou recuperação parcial | TASK-078/079: browser/SQL e validação de escopo Auth/Storage/backup |

## Dez frentes
| Frente | Objetivo | Arquivos ou módulos impactados | Dependências | Verificação e entrega |
|---|---|---|---|---|
| 1. Preparação e proteção | Proteger código, URLs, ambientes e dados antes de alterar comportamento | Git, configs/env por nome, tasks, BASELINE/RELEASE planejados | Repositório e ambiente local; recuperação completa antes de ação remota | TASK-063/079: checks, inventário, exclusões Auth/Storage e rollback |
| 2. Organização arquitetural | Separar site/menu/Agenda/admin dentro do app | `app/(site)`, `components/site`, `lib/site`, domínios atuais, ARCHITECTURE/DECISIONS | 1; ADR-020 | TASK-062/067/071: um root layout, sem duplicar CRUD ou auth |
| 3. Roteamento | Adicionar /, /cardapio, /agenda compatíveis | `app/page.tsx`, `app/(site)`, `app/[slug]`, contexto público | 1/2; hosts explicitamente aprovados, colisões verificadas | TASK-067–069/071: rotas/links/QR; sem redirects permanentes |
| 4. Cardápio | Preservar catálogo e conectá-lo ao site | `components/menu`, `lib/menu`, rotas menu, actions products/categories | 2/3; contrato e contexto registrados | TASK-068: busca, preço, Esgotado, foto ausente e atualização nas duas URLs |
| 5. Admin | Permitir edição institucional no mesmo painel | `admin/(protected)/settings`, componentes admin, validação, migrations/RLS | 1/2; campos aprovados, schema antes da UI | TASK-066/073/074: mutation membership-scoped e save->public |
| 6. Agenda gerenciável | Reusar CRUD e publicar consistentemente | `lib/agenda`, `lib/hub`, events/actions, validação, cards | 2/3; correções data/seleção/mídia, contrato flyer | TASK-064–066/069/072: publicação, tempo, mídia e erro isolado |
| 7. Site institucional | Entregar sete seções e navegação útil | `app/(site)`, `components/site`, `lib/site`, assets | 3–6 e base da 8 por incremento; conteúdo/asset para release | TASK-071/072/074–077: CTAs, conteúdos reais, 320px/teclado |
| 8. Design system e assets | Aplicar identidade institucional sem vazamento | CSS local, fontes, `public/assets`, DESIGN_SYSTEM/ASSETS | 2; inventário e autorizações | TASK-070 antes da home; TASK-075–077 completam mídia/QA |
| 9. Regressão | Provar preservação e isolamento | `tests`, `supabase/tests`, fixtures isoladas, browser se necessário | baseline 1; acompanha 2–8 | TASK-064–066/078: unit/integração/browser/SQL e evidência |
| 10. Validação e deploy | Preparar candidato revisável e recuperável | metadata/sitemap/robots, env/Vercel, migrations, RELEASE | 1–9, aprovação de conteúdo, domínio e recovery | TASK-077/079: pacote, Preview se autorizado, smoke/rollback; produção futura separada |

As frentes não são dez PRs obrigatoriamente sequenciais. Preparar design (8) antes da home (7); executar regressão (9) durante cada etapa. Domínio/fotos não bloqueiam a linha de base e revisão local. Música tem validação independente.

## Fila de incrementos
[TASK-062](../../tasks/completed/TASK-062-reconcile-site-documentation.md) concluiu a sincronização documental. A TASK-080 antecipou a navbar da TASK-071 a pedido do usuário. A TASK-071 reaproveita esse header na composição definitiva. Consultar [CURRENT](../../tasks/CURRENT.md) e [BACKLOG](../../tasks/BACKLOG.md) para o estado operacional. Ao mover uma tarefa, sincronizar seu link no índice.

| Tarefa | Entrega | Depende de | Estado |
|---|---|---|---|
| [TASK-063](../../tasks/completed/TASK-063-site-baseline-and-recovery.md) | Proteger e registrar a linha de base do site | TASK-062 | DONE |
| [TASK-064](../../tasks/completed/TASK-064-site-event-selection.md) | Corrigir seleção temporal de eventos | TASK-063 | DONE |
| [TASK-065](../../tasks/completed/TASK-065-site-event-calendar-validation.md) | Rejeitar datas inexistentes de eventos | TASK-064 | DONE |
| [TASK-066](../../tasks/active/TASK-066-site-event-media-recovery.md) | Proteger exclusão e recuperação de mídia de eventos | TASK-065 | READY |
| [TASK-067](../../tasks/planned/TASK-067-site-public-context.md) | Definir contexto institucional e navegação | TASK-066 | PLANNED |
| [TASK-068](../../tasks/planned/TASK-068-site-menu-route.md) | Adicionar cardápio institucional compartilhado | TASK-067 | PLANNED |
| [TASK-069](../../tasks/planned/TASK-069-site-agenda-route.md) | Adicionar Agenda institucional compartilhada | TASK-068 | PLANNED |
| [TASK-070](../../tasks/planned/TASK-070-site-design-foundation.md) | Integrar tokens e inventário de assets | TASK-063 | PLANNED |
| [TASK-071](../../tasks/planned/TASK-071-site-home-shell.md) | Implementar Header Hero e Footer na raiz | TASK-069, TASK-070 | PLANNED |
| [TASK-072](../../tasks/planned/TASK-072-site-home-agenda.md) | Integrar eventos reais à homepage | TASK-064, TASK-065, TASK-066, TASK-069, TASK-071 | PLANNED |
| [TASK-073](../../tasks/planned/TASK-073-site-editorial-schema.md) | Definir e migrar conteúdo institucional tipado | TASK-067 | PLANNED |
| [TASK-074](../../tasks/planned/TASK-074-site-editorial-admin.md) | Editar conteúdo institucional no admin | TASK-073, TASK-072 | PLANNED |
| [TASK-075](../../tasks/planned/TASK-075-site-drinks-and-venue.md) | Implementar Drinks e petiscos e A Casa | TASK-070, TASK-074 | PLANNED |
| [TASK-076](../../tasks/planned/TASK-076-site-gallery-and-location.md) | Implementar Galeria e Localização | TASK-075 | PLANNED |
| [TASK-077](../../tasks/planned/TASK-077-site-seo-and-performance.md) | Preparar SEO e desempenho institucional | TASK-076 | PLANNED |
| [TASK-078](../../tasks/planned/TASK-078-site-regression-acceptance.md) | Validar regressão integrada e acessibilidade | TASK-077 | PLANNED |
| [TASK-079](../../tasks/planned/TASK-079-site-release-readiness.md) | Preparar Preview e release institucional | TASK-078 | PLANNED |
| [TASK-080](../../tasks/active/TASK-080-site-home-navigation.md) | Navegação institucional da home | TASK-063 | BLOCKED: revisão em navegador |

## Ciclo de execução por tarefa
- [ ] Conferir CURRENT/AGENTS e dependências; registrar os arquivos afetados e preservar alterações locais.
- [ ] Para correção, adicionar teste com o cenário exato da tarefa e observar falha antes do código; para rota/UI, fixar jornada/contrato verificável.
- [ ] Implementar somente o incremento. Em tarefa documental, revisar consistência e links; não inventar testes de produto.
- [ ] Executar verificações direcionadas e registrar comandos/resultados/limites. Rodar suite/build quando houver impacto de rota, dados ou release.
- [ ] Atualizar docs e aceite; mover tarefa concluída, atualizar backlog e apontar próxima READY. Sem auto-commit/publicação.

## Cutover e rollback
Primeiro adicionar caminhos institucionais e manter aliases funcionais. Definir canonical no domínio verificado, validar query/âncora/QR e apenas então avaliar redirects específicos. Não alterar Music host sem testes próprios. Preparar rollback de aplicação compatível mantendo schema aditivo e dados; sem restauração rotineira nem reabrir POCs. QR definitivo em TASK-028 somente após validar destino permanente em produção. Preparação e publicação são entregas distintas.
