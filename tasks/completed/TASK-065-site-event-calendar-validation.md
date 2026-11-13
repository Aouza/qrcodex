# TASK-065 — Rejeitar datas inexistentes de eventos

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-064
**Migration fronts:** 6, 9

## Objetivo
Validar calendário real e preservar o contrato de instantes dos formulários.

## Plano de execução — 2026-11-13
Site segue como prioridade. Branch `fix/site-event-calendar-validation`, derivada da entrega TASK-064. Reproduzir a normalização indevida em teste, validar calendário/horário antes da conversão existente e verificar regressões. Mudanças limitadas à validação, seus testes e documentação; sem migrations ou publicação automática.

## Arquivos ou módulos impactados
- `src/lib/validation/event.ts`
- `tests/event-validation.test.mjs`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [x] Antes da correção, teste demonstra que 2026-02-31T22:00 é aceito indevidamente; depois deve falhar.
- [x] Cobrir fevereiro bissexto/não bissexto, limites de mês/hora, fim anterior ao início e fim na madrugada seguinte.
- [x] Data válida 2026-10-02T22:00 mantém conversão esperada para 2026-10-03T01:00:00.000Z sob o contrato atual de São Paulo.
- [x] Não alterar enum/schema ou aplicar regra de outro fuso silenciosamente.
- [x] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/event-validation.test.mjs; npm.cmd run typecheck; npm.cmd run lint.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Date normaliza dias inexistentes; regex e NaN não bastam. Não mudar instantes já persistidos.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Validação estrita com testes de calendário e horário.

## Notas de conclusão
Concluída localmente em 2026-11-13. `localDateTimeToIso` verifica se calendário e horário permanecem idênticos ao texto informado antes da conversão existente `-03:00`. A referência UTC dessa checagem não altera o fuso de entrada. Datas inexistentes e `24:00` são rejeitados tanto no início quanto no fim; nenhum instante persistido, schema, enum, RLS ou fluxo de Música foi alterado.

Evidência: baseline de 7 testes passou. Antes da correção, três regressões falharam por aceitação de 31/02 em início/fim e dia inexistente em ano não bissexto. Depois: 12 testes direcionados e 108 testes totais passaram, incluindo bissextos 2024/2000 versus 1900, limites de mês/hora, fim anterior/igual/posterior, madrugada e conversão UTC exata. `npm.cmd run typecheck` e `npm.cmd run lint` passaram. Revisão independente executou os 12 testes e não encontrou bloqueios.

Docs de banco, Agenda, conteúdo/integração e plano do site sincronizadas; verificação documental e diff conferidos no fechamento. Build/browser e verificações remotas não foram repetidos: a alteração é uma validação pura, sem mudança visual, de rotas ou de schema. TASK-066 promovida a READY. Sem commit/push/deploy nesta implementação.
