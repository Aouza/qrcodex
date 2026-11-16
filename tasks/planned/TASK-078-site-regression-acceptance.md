# TASK-078 — Validar regressão integrada e acessibilidade

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-077
**Migration fronts:** 9

## Objetivo
Comprovar compatibilidade e segurança na versão candidata.

## Arquivos ou módulos impactados
- `tests/ e fixtures isoladas`
- `supabase/tests/ pertinentes`
- `browser tests/config somente se necessário`
- `package.json se novo comando for necessário`
- `docs/site/REGRESSION.md (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Executar matriz menu/admin/Agenda/site/tenancy/URLs/QR/Música do documento de qualidade.
- [ ] Browser home->agenda->home, home->menu->search->clear, admin publish/unpublish->public e contacts/directions.
- [ ] RLS/Storage/host desconhecido, sem sessão, zero/múltiplas memberships, IDs cruzados e falhas parciais.
- [ ] QA 320/360/768/1440, teclado/foco/zoom/reduced motion/rede lenta; capturar erros de console/hidratação.
- [ ] Música: preservar rotas/401/403/POC fechado; evidência física/endurance continua TASK-058, não auto-DONE.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
lint/typecheck/node:test/build + browser/SQL isolado pertinente; relatório com commit/ambiente/data/limites.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Preview pode escrever produção; não rodar fixtures no alvo errado. Assertions CSS não são aceitação visual.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Relatório regressão com bloqueadores claros e evidências.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
