# Relica's Rock Bar — documentação do site

A raiz já apresenta a navegação e a abertura institucional do Relica’s. A home completa, os destinos institucionais e o conteúdo editorial seguem no plano incremental.

A [TASK-072](../../tasks/completed/TASK-072-site-home-agenda.md) acrescentou a faixa de próximos shows abaixo da hero, com eventos reais, papel fornecido pelo usuário e estados independentes de vazio/erro. Build/start isolado e revisão visual de componentes passaram; sem publicação ou alteração de dados remotos. O próximo incremento READY continua TASK-068.

A [TASK-082](../../tasks/completed/TASK-082-site-home-hero.md) antecipa a hero do screenshot solicitado, com título HTML, acesso à Agenda/Cardápio e a imagem `public/images/hero/hero.png` fornecida e selecionada pelo usuário. Substitui o conceito de revisão inicial; não representa a home completa ou aceite de publicação.

## Leitura e precedência
Esta pasta responde pelo produto Site. O mapa da plataforma e dos demais produtos está em [docs/README](../README.md); as regras de atualização estão em [GOVERNANCE](../GOVERNANCE.md).

Começar pelo `AGENTS.md` da raiz e `tasks/CURRENT.md`. O PRD define visão e limites globais; arquitetura, banco, design system e decisões da raiz de `docs/` cuidam dos contratos compartilhados. Os arquivos desta pasta detalham somente o site, conciliados com ADR-020. Menu, Agenda, Hub e Música mantêm seus próprios contratos.

| Documento | Responsabilidade |
|---|---|
| [00-PRODUCT-SPEC.md](00-PRODUCT-SPEC.md) | Escopo e aceite |
| [01-ARCHITECTURE.md](01-ARCHITECTURE.md) | Fronteiras e rotas |
| [02-DESIGN-SYSTEM.md](02-DESIGN-SYSTEM.md) | Tema institucional |
| [03-CONTENT-AND-ADMIN.md](03-CONTENT-AND-ADMIN.md) | Conteúdo, eventos e admin |
| [04-QRCODEX-INTEGRATION.md](04-QRCODEX-INTEGRATION.md) | Auditoria e compatibilidade |
| [05-ASSETS.md](05-ASSETS.md) | Inventário e aprovação de mídia |
| [06-IMPLEMENTATION-PLAN.md](06-IMPLEMENTATION-PLAN.md) | Dez frentes, tarefas e dependências |
| [07-QUALITY-AND-SECURITY.md](07-QUALITY-AND-SECURITY.md) | Regressão e release |
| [08-DECISIONS-AND-OPEN-QUESTIONS.md](08-DECISIONS-AND-OPEN-QUESTIONS.md) | Decisões e gates pendentes |

## Origem preservada
`relicas-documentacao-codex.zip` contém 11 Markdown, extraídos sem alteração em `reference/` (README, AGENTS e nove documentos). São o baseline original proposto, com hipóteses anteriores à auditoria. Não instalar seus arquivos na raiz nem seguir a proposta de segundo aplicativo como decisão vigente. O AGENTS extraído documenta o pacote histórico, não substitui o AGENTS deste repositório.

## Próximo trabalho
A [linha de base](BASELINE.md) foi registrada; [TASK-064](../../tasks/completed/TASK-064-site-event-selection.md), [TASK-065](../../tasks/completed/TASK-065-site-event-calendar-validation.md) e [TASK-066](../../tasks/completed/TASK-066-site-event-media-recovery.md) corrigiram localmente a seleção de shows, datas e proteção dos flyers. A [TASK-067](../../tasks/completed/TASK-067-site-public-context.md) entregou os helpers de contexto e navegação. O próximo incremento é a [TASK-068](../../tasks/active/TASK-068-site-menu-route.md), para integrar o cardápio institucional, respeitando o [gate de hosts/slugs](04-QRCODEX-INTEGRATION.md#contexto-de-acesso-e-gate-de-rotas--task-067). A homepage será em `/`, prioridade reafirmada pelo usuário. A [TASK-080](../../tasks/active/TASK-080-site-home-navigation.md) registra a navbar e a revisão em navegador pendente.

As tarefas distinguem implementação local de publicação. Nenhum schema, credencial, DNS ou estado de produção foi alterado por este incremento.
