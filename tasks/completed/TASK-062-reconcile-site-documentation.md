# TASK-062 — Conciliar documentação e plano do site

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-047, TASK-052, TASK-059

## Objetivo
Registrar a direção institucional auditada e preparar uma fila verificável de implementação, preservando os contratos existentes.

## Aceite
- [x] Os 11 Markdown do ZIP foram lidos e preservados em `docs/site/reference/`, com verificação byte a byte.
- [x] Os requisitos em `docs/site/` distinguem estado implementado, alvo e pendências.
- [x] AGENTS, PRD, arquitetura, banco, design system e decisões concordam com ADR-020; contratos sem alteração de schema.
- [x] O plano tem dez frentes com objetivos, arquivos, dependências e verificação; tarefas de implementação estão delimitadas.
- [x] QR definitivo segue homepage verificada e aliases/QR anteriores são preservados.
- [x] Música continua com validação manual pendente e nenhuma autorização de release inferida.
- [x] Backlog e CURRENT apontam TASK-063 READY.

## Notas de conclusão — 2026-11-10
- Conciliados 10 documentos ativos do site com o código auditado e preservado o pacote original.
- ADR-020 define aplicação única, site/rotas aditivas e recuperação compatível. Atualizados README, prompt de início, guardrails e tarefa de QR.
- Verificações: `git diff --check`, integridade SHA-256 dos 11 Markdown extraídos, links locais, UTF-8 e grafo/status das tarefas. Checks da auditoria anterior são históricos; executar linha de base atual na TASK-063.
- Nenhuma alteração em código, banco, variáveis, domínio ou produção. Sem commit/push/deploy. Alterações locais de Música preservadas.
- A linha de base foi registrada na [TASK-063](TASK-063-site-baseline-and-recovery.md). Confirmar domínio, conteúdo e assets antes da publicação.
