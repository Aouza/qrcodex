# Produto — Hub

## Propósito

Entrada pública do estabelecimento por `/[slug]`, especialmente para links/QR existentes. Identifica o bar e oferece Cardápio como ação principal, além de destinos disponíveis. Continua existindo ao lado da homepage institucional; não é sinônimo da nova `/`.

## Fontes responsáveis

- [PRD](../PRD.md), fases A/C, rotas, QR e cenário de regressão do Hub.
- [Arquitetura](../ARCHITECTURE.md), Public Hub and menu data.
- [Design system](../DESIGN_SYSTEM.md), §47.
- [Decisões](../DECISIONS.md), ADR-016 com alvo institucional substituído por ADR-020.
- [Compatibilidade institucional](../site/04-QRCODEX-INTEGRATION.md).

## Capacidade e dependências

Hub/menu e navegação de retorno estão implementados. Agenda aparece quando há evento publicado relevante com mídia. Música depende da flag global e disponibilidade anônima do tenant; backend de pedidos exige TV pronta. O ensaio autorizado de Relica's não habilita outros tenants nem equivale a lançamento aceito.

`src/lib/hub/load-public-hub.ts` e seu resolver mantêm leitura leve, sem carregar catálogo completo. A TASK-064 corrigiu localmente a seleção temporal antes do limite de 24, compartilhando a regra com Agenda e preservando eventos em andamento. O isolamento de falha de Agenda segue pendente no plano; esta correção não implica publicação remota.

## Andamento

[BACKLOG](../../tasks/BACKLOG.md), epic Bar Hub Foundation, registra TASK-042–047; Agenda foi ativada pela TASK-052. [TASK-064](../../tasks/completed/TASK-064-site-event-selection.md) registra a correção da seleção de eventos. [TASK-058](../../tasks/active/TASK-058-activate-music-on-hub.md) possui o ensaio e aceite de Música. [TASK-028](../../tasks/active/TASK-028-permanent-qr.md) mantém o QR novo bloqueado até validar o destino canônico.

O PRD Bar Hub V2 é [proposta histórica](../archive/README.md), com IDs antigos e hipóteses de votação/redirecionamento que não devem virar tarefas atuais.
