# TASK-063 — Proteger e registrar a linha de base do site

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-062
**Migration fronts:** 1, 9

## Objetivo
Registrar código, ambientes, contratos e recuperação antes da primeira mudança funcional.

## Arquivos ou módulos impactados
- `docs/site/BASELINE.md (novo)`
- `tasks/CURRENT.md`
- `package.json (leitura)`
- `scripts/ e supabase/ (inventário, sem execução remota)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [x] Registrar branch, HEAD, alterações locais e escopo da implementação no checkout.
- [x] Executar lint, typecheck, 97 testes e build antes da mudança funcional.
- [x] Inventariar URLs, ambiente e pendências de QR, banco e slugs.
- [x] Registrar recuperação e cobertura de Auth, Storage e DPAPI.
- [x] Listar jornadas manuais e verificações pendentes.
- [x] Sincronizar backlog e tarefa corrente.

## Verificação
npm.cmd run lint; npm.cmd run typecheck; node --test tests/*.test.mjs; npm.cmd run build (comandos separados). Git status/diff somente leitura.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Checkout já modificado; Preview pode usar produção. Nenhum reset/stash, segredos ou fixtures remotas.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
docs/site/BASELINE.md com evidências e gates de recuperação, seguido da TASK-064 READY.

## Notas de conclusão
Evidências em [BASELINE.md](../../docs/site/BASELINE.md). A linha de base passou em lint, typecheck, 97 testes e build no checkout `feat/music-production` com HEAD `b3d174f`. Inventário remoto, recuperação completa e jornadas manuais constam como pendências. A pedido do usuário, a navbar foi antecipada na TASK-080. A TASK-064 continua sendo o próximo incremento do plano.
