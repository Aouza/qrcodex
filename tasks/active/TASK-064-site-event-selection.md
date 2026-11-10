# TASK-064 — Corrigir seleção temporal de eventos

**Epic:** Institutional Site
**Status:** READY
**Dependencies:** TASK-063
**Migration fronts:** 6, 9

## Objetivo
Selecionar eventos relevantes antes do limite sem perder eventos em andamento.

## Arquivos ou módulos impactados
- `src/lib/hub/load-public-hub.ts`
- `src/lib/hub/resolve-public-hub-result.ts`
- `src/lib/agenda/load-public-agenda.ts`
- `src/lib/agenda/resolve-public-agenda-result.ts`
- `tests/load-public-hub.test.mjs`
- `tests/load-public-agenda.test.mjs`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Teste reproduz 24 eventos passados seguidos de um futuro; o futuro não pode ser escondido pelo limite.
- [ ] Teste cobre starts_at passado/ends_at futuro, fim igual a agora, fim passado, ausência de mídia e ordenação determinística por início/ID.
- [ ] Restringir consulta e compartilhar o predicado temporal necessário entre superfícies sem reescrever os loaders inteiros.
- [ ] Manter RLS/publicação e regra existente sem término; não inventar duração automática.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/load-public-hub.test.mjs tests/load-public-agenda.test.mjs; npm.cmd run lint; npm.cmd run typecheck.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Aplicar starts_at >= now sozinho perde shows em andamento; limite antes de filtro repete o bug.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Hub/Agenda selecionam eventos consistentemente, com regressões reproduzíveis.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
