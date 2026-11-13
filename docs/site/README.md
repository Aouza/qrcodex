# Relica's Rock Bar — documentação do site

A raiz já apresenta a navegação e a abertura institucional do Relica’s. A home completa, os destinos institucionais e o conteúdo editorial seguem no plano incremental.

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
A [linha de base](BASELINE.md) foi registrada. O próximo incremento é a [TASK-064](../../tasks/active/TASK-064-site-event-selection.md). A [TASK-080](../../tasks/active/TASK-080-site-home-navigation.md) registra a navbar e a revisão em navegador pendente.

Esta atualização não altera produto em execução, schema, credenciais, DNS ou produção e não faz commit/push/deploy.
