# TASK-081 — Organizar documentação por plataforma e produto

**Epic:** Documentation Governance
**Status:** DONE
**Dependencies:** TASK-062, TASK-059
**Domains:** Plataforma, Site, Cardápio, Agenda, Hub, Música, Admin

## Objetivo e limites

Revisar o acervo, conciliar ideias conflitantes com os contratos/código/evidências existentes e organizar a manutenção por produto. Solicitação explícita do usuário em 2026-11-13. Sem implementar a TASK-064, alterar runtime/schema/dados, executar ação remota ou publicar.

## Critérios de aceite

- [x] Inventariar documentos vigentes, históricos, experimentais e materiais de origem, com fontes responsáveis.
- [x] Dar entrada clara para plataforma e cada produto/área, sem duplicar backends ou backlogs.
- [x] Conciliar conflitos verificáveis e registrar decisões/pendências sem fabricar implementação ou aceite.
- [x] Definir o que atualizar durante cada tipo de mudança e integrar a regra ao protocolo de trabalho.
- [x] Preservar notas de Música e mudanças locais anteriores; distinguir requisito, implementação, evidência datada e aceite.
- [x] Verificar links/status/cobertura e manter CURRENT na próxima implementação READY.

## Entrega

Índice geral, índices por domínio, governança e auditoria; correções de contratos/documentos operacionais; CURRENT enxuto com handoff preservado; modelo e fluxo de tarefas; verificador offline de documentação. ADR-021 registra a organização sem alterar a arquitetura de execução.

## Verificação

`node scripts/check-docs.mjs`; `node --check scripts/check-docs.mjs`; revisão do diff, fontes/código local e critérios. Como não há alteração de produto, não alegar nova validação de playback, navegador ou produção.

## Notas de conclusão

Concluída em 2026-11-13, somente no escopo documental e tooling de manutenção. Todos os critérios acima foram conferidos: catálogo com 48 Markdown em docs/, fontes por domínio, auditoria de conflitos, matriz de sincronização, protocolo atualizado e CURRENT separado de aceites independentes.

Verificações executadas:

- `node scripts/check-docs.mjs`: PASS, 48 docs cadastradas, 203 links locais, 72 arquivos de tarefa e próxima implementação TASK-064. TASK-029/030 são exceções PLANNED explícitas.
- `node --check scripts/check-docs.mjs`: PASS.
- `npm.cmd run lint`: PASS; lint direcionado ao verificador também PASS. Aviso preexistente de configuração npm `python`, sem erro.
- Smoke do verificador em cópia descartável isolada: PASS para acervo válido e rejeição de link quebrado, doc sem cadastro, status divergente e CURRENT apontando para tarefa bloqueada. Cópia e script temporários removidos.
- `git diff --check` no escopo documental: PASS. Comparação Git confirmou runtime, migrations, testes de produto, dependências e referências originais do site sem mudanças desta entrega.

Não houve build/typecheck/playback/browser ou inspeção remota novos, pois produto não mudou. Checks de produto antigos continuam apenas em suas evidências datadas. O guia do dono e PDF, output/.claude e alterações preexistentes da TASK-058 foram preservados. Sem commit/push/deploy ou mutação remota.

TASK-064 continua a próxima implementação; aceites de Música, senha, navbar e QR permanecem abertos. TASK-029/030 são placeholders antigos PLANNED sem arquivo; detalhar e reconciliar com o release institucional antes de promoção. O verificador não comprova semântica ou produção: revisão humana/documental permanece necessária a cada mudança.
