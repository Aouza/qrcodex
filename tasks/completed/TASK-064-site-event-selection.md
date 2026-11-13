# TASK-064 — Corrigir seleção temporal de eventos

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-063
**Migration fronts:** 6, 9

## Objetivo
Selecionar eventos relevantes antes do limite sem perder eventos em andamento.

## Plano de execução — 2026-11-13
Prioridade confirmada pelo usuário: criação do site. Corrigir primeiro esta dependência da Agenda, usando a aplicação e os loaders existentes. Branch local `fix/site-event-selection`, a partir da documentação revisada. Sem publicação automática.

1. Reproduzir no loader real o histórico de 24 passados ocultando um futuro, com transporte Supabase simulado e sem rede.
2. Centralizar relevância temporal e aplicar o filtro no banco antes do limite, mantendo tenant/publicação e mídia defensiva.
3. Verificar casos de fronteira e regressões, sincronizar docs/tarefas e promover TASK-065.

## Arquivos ou módulos impactados
- `src/lib/hub/load-public-hub.ts`
- `src/lib/hub/resolve-public-hub-result.ts`
- `src/lib/agenda/load-public-agenda.ts`
- `src/lib/agenda/resolve-public-agenda-result.ts`
- `src/lib/agenda/public-event-time.ts`
- `tests/fixtures/public-event-loaders.mjs`
- `tests/load-public-hub.test.mjs`
- `tests/load-public-agenda.test.mjs`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [x] Teste reproduz 24 eventos passados seguidos de um futuro; o futuro não pode ser escondido pelo limite.
- [x] Teste cobre starts_at passado/ends_at futuro, fim igual a agora, fim passado, ausência de mídia e ordenação determinística por início/ID.
- [x] Restringir consulta e compartilhar o predicado temporal necessário entre superfícies sem reescrever os loaders inteiros.
- [x] Manter RLS/publicação e regra existente sem término; não inventar duração automática.
- [x] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/load-public-hub.test.mjs tests/load-public-agenda.test.mjs; npm.cmd run lint; npm.cmd run typecheck.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Aplicar starts_at >= now sozinho perde shows em andamento; limite antes de filtro repete o bug.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Hub/Agenda selecionam eventos consistentemente, com regressões reproduzíveis.

## Notas de conclusão
Concluída localmente em 2026-11-13. O helper `src/lib/agenda/public-event-time.ts` concentra filtro PostgREST e checagem temporal defensiva. Hub/Agenda consultam fim >= agora ou, sem fim, início >= agora; o Hub limita a 24 somente depois do filtro. Tenant, `active`, mídia obrigatória e ordenação início/ID permanecem preservados. Não houve migration/RLS ou alteração em Música.

Evidência: baseline de 10 testes passou; os novos testes falharam primeiro por show futuro oculto após 24 passados e por consulta de Agenda sem filtro. Após a correção, 13 testes direcionados e os 103 testes da suíte passaram. Lint e typecheck passaram. Revisão independente confirmou os 13 testes e não encontrou bloqueios.

O transporte simulado usa o cliente Supabase real e interpreta a consulta emitida, sem rede, credenciais reais ou fixtures em produção. Não comprova execução remota, plano SQL, renderização visual ou lançamento do site. `npm.cmd run build` passou; `node scripts/check-docs.mjs` passou com 48 docs, 205 links e 72 tarefas, apontando TASK-065 READY. Docs de arquitetura, Agenda/Hub, integração, plano e índices sincronizadas. Sem commit/push/deploy nesta implementação.
