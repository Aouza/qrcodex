# TASK-065 — Rejeitar datas inexistentes de eventos

**Epic:** Institutional Site
**Status:** READY
**Dependencies:** TASK-064
**Migration fronts:** 6, 9

## Objetivo
Validar calendário real e preservar o contrato de instantes dos formulários.

## Arquivos ou módulos impactados
- `src/lib/validation/event.ts`
- `tests/event-validation.test.mjs`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Antes da correção, teste demonstra que 2026-02-31T22:00 é aceito indevidamente; depois deve falhar.
- [ ] Cobrir fevereiro bissexto/não bissexto, limites de mês/hora, fim anterior ao início e fim na madrugada seguinte.
- [ ] Data válida 2026-10-02T22:00 mantém conversão esperada para 2026-10-03T01:00:00.000Z sob o contrato atual de São Paulo.
- [ ] Não alterar enum/schema ou aplicar regra de outro fuso silenciosamente.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/event-validation.test.mjs; npm.cmd run typecheck; npm.cmd run lint.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Date normaliza dias inexistentes; regex e NaN não bastam. Não mudar instantes já persistidos.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Validação estrita com testes de calendário e horário.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
