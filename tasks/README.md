# Fluxo de tarefas

## Onde procurar

- [CURRENT](CURRENT.md): próxima implementação e pendências independentes.
- [BACKLOG](BACKLOG.md): catálogo oficial de IDs, estados e dependências.
- `planned/`: tarefas ainda não promovidas a READY.
- `active/`: READY, IN_PROGRESS e BLOCKED, incluindo aceites manuais.
- `completed/`: DONE com aceite e evidências.
- [TEMPLATE](TEMPLATE.md): modelo para novas tarefas.

Não duplicar backlog por produto. Os índices em [docs](../docs/README.md) apontam para estas tarefas. Uma tarefa pode afetar vários domínios mesmo pertencendo a um epic.

## Antes e depois de trabalhar

1. Conferir CURRENT, dependências, instruções e alterações locais. Uma solicitação explícita de manutenção documental pode ganhar tarefa própria sem iniciar a próxima implementação de produto.
2. Registrar domínio(s), fontes a ler/atualizar e aceite verificável.
3. Implementar somente o escopo autorizado; evidência de release não se presume a partir de implementação.
4. Registrar checks, limites e critérios atendidos. Quando faltar aceite, manter estado aberto e declarar o motivo.
5. Ao concluir, mover para `completed/`, sincronizar BACKLOG e CURRENT e reparar links.
6. Rodar `node scripts/check-docs.mjs`. Em tarefa só documental, revisão de links/status/consistência é pertinente; não alegar nova validação de produto ou produção.

Estados: PLANNED → READY → IN_PROGRESS; BLOCKED quando houver impedimento; DONE somente com Definition of Done. Retorno de BLOCKED exige registrar resolução e selecionar READY/IN_PROGRESS conforme a execução.

TASK-058 e TASK-061 mantêm IN_PROGRESS histórico com `READY_FOR_MANUAL_VALIDATION`, sem implementação paralela ativa. TASK-080 e TASK-031 aguardam aceites específicos. Não converter automaticamente nenhuma delas em DONE.

TASK-029 e TASK-030 são placeholders históricos PLANNED no backlog, sem arquivos de execução. Antes de promovê-los, detalhar aceite e reconciliar com TASK-078/079 e TASK-028 para não duplicar lançamento. A ausência é registrada, não tratada como entrega concluída.
