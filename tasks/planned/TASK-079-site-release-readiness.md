# TASK-079 — Preparar Preview e release institucional

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-078
**Migration fronts:** 1, 10

## Objetivo
Entregar candidato concreto e recuperável para autorização externa.

## Arquivos ou módulos impactados
- `docs/site/RELEASE.md (novo)`
- `config Vercel/envs por ambiente (revisão)`
- `tasks/BACKLOG.md`
- `tasks/CURRENT.md`
- `docs/site/05-ASSETS.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Candidato/commit, env/banco alvo, conteúdo/assets, domínio/DNS/HTTPS e metadados identificados.
- [ ] Preview só mediante autorização aplicável; confirmar proteção e evitar fixtures em produção. Falta de autorização permanece gate, não falso PASS.
- [ ] Comparar migrations remotas antes de rollout; backup/recovery de banco/Auth/Storage ensaiado com exclusões explícitas.
- [ ] Sequência app/schema aditivo e rollback compatível, critérios de parada e smoke não destrutivo documentados.
- [ ] Não fazer commit/push/deploy/migration/DNS ou QR definitivo sem autorização específica. Não concluir lançamento só por preparar pacote.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
Revisão do pacote e checklist com evidências, pendências/autorizações e smoke pós-deploy preparado.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Domínio/dados reais/recuperação/validação do dono bloqueiam release. Music mantém gates próprios.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Pacote pronto para decisão de publicação, sem produção alterada.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
