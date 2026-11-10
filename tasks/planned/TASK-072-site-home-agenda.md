# TASK-072 — Integrar eventos reais à homepage

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-064, TASK-065, TASK-066, TASK-069, TASK-071
**Migration fronts:** 6, 7, 9

## Objetivo
Exibir até quatro eventos relevantes sem acoplar disponibilidade da home à Agenda.

## Arquivos ou módulos impactados
- `src/lib/site/load-home-events.ts (novo)`
- `src/components/site/home-agenda.tsx (novo)`
- `src/app/(site)/page.tsx`
- `ações de eventos e helper de invalidação público (novo)`
- `tests/site-home-events.test.mjs (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Mesma fonte/predicado temporal e publicação; teste com >4 eventos mantém os quatro primeiros relevantes.
- [ ] Zero eventos mostra mensagem/contato real; erro não remove Hero/menu ou quebra a página inteira.
- [ ] Atualizar consumers para eventos/settings: home, /agenda, slug Agenda/Hub pertinentes e admin.
- [ ] Testar publish/unpublish/image/delete em build/start e registrar comportamento de nova navegação/aba aberta.
- [ ] Leitura dinâmica explícita inicial; sem cache privado/persistente ou placeholders públicos.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/site-home-events.test.mjs e regressões Agenda/Hub; checks/build; smoke de freshness isolado.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Invalidação por mutação não expira relógio; cache futuro exige TTL. Não prometer push ao browser.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Agenda homepage real, limitada e tolerante a falhas.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
