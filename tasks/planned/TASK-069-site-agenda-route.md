# TASK-069 — Adicionar Agenda institucional compartilhada

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-068
**Migration fronts:** 3, 6

## Objetivo
Integrar /agenda sem novo CRUD ou fonte de eventos.

## Arquivos ou módulos impactados
- `src/app/(site)/agenda/page.tsx e loading.tsx/error.tsx (novos)`
- `src/app/[slug]/agenda/page.tsx`
- `src/components/agenda/public-agenda-view.tsx (novo)`
- `src/components/agenda/event-card.tsx (novo)`
- `tests/site-agenda.test.mjs (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Reutilizar loadPublicAgenda e apresentação extraída, com retorno contextual e datas São Paulo.
- [ ] /agenda e /relicas/agenda mostram os mesmos publicados relevantes; drafts e outro tenant não vazam.
- [ ] Flyer real continua obrigatório; sem slug/detalhe/cancelamento/couvert presumidos.
- [ ] Estados loading/vazio/erro e link HTTP(S) opcional testados; ausência de dados não cria evento fictício.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
Testes direcionados Agenda/contexto + lint/typecheck/build; smoke rotas novas/antigas.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Estilo institucional não deve alterar a fonte nem os dados de publicação.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Agenda institucional usando domínio existente.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
