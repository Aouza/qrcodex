# Relica's Rock Bar — documentação do site

A direção visual vigente é `reference/layout-aprovado.png`, aprovada em 2026-11-17 e aplicada na [TASK-084](../../tasks/completed/TASK-084-site-approved-layout.md). Composição: header/hero, Agenda escura, Drinks & Petiscos, A Casa, depoimentos, playlist/localização e footer. [ADR-022](../DECISIONS.md#adr-022--layout-aprovado-como-referência-visual-única) substitui as referências visuais anteriores, preservando dados, admin, rotas e Música.

A Agenda reutiliza a fonte pública real, com até dois shows da semana de São Paulo (TASK-089). Imagens selecionadas foram autorizadas em todos os ambientes; a TASK-090 substitui os depoimentos fictícios por três avaliações reais fornecidas, sem datas e exibidas em todos os ambientes. Conteúdo real, links oficiais, aliases, schema/admin editorial e gates de release permanecem nas tarefas canônicas. O próximo incremento READY continua TASK-068 após esta tarefa.

A [TASK-085](../../tasks/completed/TASK-085-site-feature-assets.md) substitui o microfone e a montagem de comidas pelos PNGs fornecidos pelo usuário, preservando o layout aprovado e a fronteira de revisão.

A [TASK-086](../../tasks/completed/TASK-086-site-image-scale.md) limita a escala desses assets ao container de conteúdo e à faixa compacta da referência, com QA adicional em monitores de 1920/2535 px.

A [TASK-093](../../tasks/completed/TASK-093-site-house-section.md) aplica a nova referência de A Casa fornecida em 2026-11-18: texto HTML aprovado e imagem de alta resolução com bordas rasgadas, substituindo a foto pequena anterior.

## Leitura e precedência
A [TASK-083](../../tasks/completed/TASK-083-site-home-testimonials.md) preserva a entrega histórica de depoimentos; a TASK-084 os reposiciona após A Casa e retira estrelas. A TASK-090 registra a substituição aprovada dos exemplos por depoimentos reais.

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
