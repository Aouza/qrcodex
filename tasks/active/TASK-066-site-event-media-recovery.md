# TASK-066 — Proteger exclusão e recuperação de mídia de eventos

**Epic:** Institutional Site
**Status:** READY
**Dependencies:** TASK-065
**Migration fronts:** 5, 6, 9

## Objetivo
Impedir sucesso indevido e publicação quebrada quando banco e Storage falham parcialmente.

## Arquivos ou módulos impactados
- `src/app/admin/(protected)/events/[id]/actions.ts`
- `src/app/admin/(protected)/events/[id]/image-actions.ts`
- `tests/event-actions.test.mjs (novo)`
- `docs/DATABASE.md se o contrato de recuperação mudar`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Reproduzir Storage remove bem-sucedido seguido de falha de DELETE; evento não pode continuar publicado com flyer ausente.
- [ ] Definir compensação/estado recuperável antes de editar: Storage exige registro existente, então não apenas inverter DELETE/remove.
- [ ] Cobrir falha de remoção, falha de compensação, update/delete sem linha, ID cruzado e autorização expirada.
- [ ] Não usar service-role editorial, não enfraquecer Storage RLS e manter confirmação de exclusão.
- [ ] Documentar recuperação de órfãos/rascunho e mensagens de erro; testes comprovam ausência de falso sucesso.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/event-actions.test.mjs tests/event-image-validation.test.mjs; checks lint/typecheck; SQL Storage isolado se políticas forem afetadas.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Sem transação atômica entre Postgres e Storage; rollback também pode falhar. Política depende do evento.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Fluxo e recuperação definidos com testes de falha e ownership.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
