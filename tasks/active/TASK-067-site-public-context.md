# TASK-067 — Definir contexto institucional e navegação

**Epic:** Institutional Site
**Status:** READY
**Dependencies:** TASK-066
**Migration fronts:** 2, 3

## Objetivo
Resolver hosts institucionais aprovados e gerar destinos por contexto sem alterar autorização.

## Arquivos ou módulos impactados
- `src/lib/site/public-context.ts (novo)`
- `src/lib/site/public-paths.ts (novo)`
- `tests/site-public-context.test.mjs (novo)`
- `tests/site-public-paths.test.mjs (novo)`
- `.env.example`
- `docs/ARCHITECTURE.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Definir resolveSiteContext(host) com tenant fixo Relica's somente em lista explícita server-side; unknown/null/malformed falham fechados.
- [ ] Definir getPublicPaths({slug, mode}) retornando home/menu/agenda: modo site /,/cardapio,/agenda; modo slug /slug,/slug/cardapio,/slug/agenda.
- [ ] Testar normalização de caixa/porta local, rejeição de host forjado e ausência de fallback universal Vercel.
- [ ] Inspecionar fonte confiável de host da hospedagem; registrar gate de inventário para tenants reservados antes das próximas rotas.
- [ ] Não proteger por host o admin nem expor IDs/chaves; documentar somente nomes das novas variáveis.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/site-public-context.test.mjs tests/site-public-paths.test.mjs; lint/typecheck.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Host allowlist não protege Preview; rotas fixas podem sombrear tenants com mesmo slug.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Contrato testado de tenant/contexto e links, sem redirects.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
