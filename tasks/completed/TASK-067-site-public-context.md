# TASK-067 — Definir contexto institucional e navegação

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-066
**Migration fronts:** 2, 3

## Objetivo
Resolver hosts institucionais aprovados e gerar destinos por contexto sem alterar autorização.

## Plano de execução — 2026-11-16
Implementar somente o contrato de contexto/links desta tarefa, na branch `feat/site-public-context`. A homepage institucional permanece no destino `/`; aliases e composição visual continuam nas tarefas seguintes. Lista explícita `SITE_ALLOWED_HOSTS`, server-only, sem domínio presumido, fallback Vercel ou alteração de env real. Consumir `Host` do request do servidor, sem fallback em forwarded headers. Testar primeiro hosts inválidos, autoridade local com porta e navegação por slug/site. Registrar o inventário de slugs reservados como gate antes de criar rotas estáticas; não consultar ou alterar produção nesta etapa.

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
- [x] Definir resolveSiteContext(host) com tenant fixo Relica's somente em lista explícita server-side; unknown/null/malformed falham fechados.
- [x] Definir getPublicPaths({slug, mode}) retornando home/menu/agenda: modo site /,/cardapio,/agenda; modo slug /slug,/slug/cardapio,/slug/agenda.
- [x] Testar normalização de caixa/porta local, rejeição de host forjado e ausência de fallback universal Vercel.
- [x] Inspecionar fonte confiável de host da hospedagem; registrar gate de inventário para tenants reservados antes das próximas rotas.
- [x] Não proteger por host o admin nem expor IDs/chaves; documentar somente nomes das novas variáveis.
- [x] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/site-public-context.test.mjs tests/site-public-paths.test.mjs; lint/typecheck.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Host allowlist não protege Preview; rotas fixas podem sombrear tenants com mesmo slug.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Contrato testado de tenant/contexto e links, sem redirects.

## Notas de conclusão
Concluída localmente em 2026-11-16. `public-context.ts` é server-only, usa exclusivamente `SITE_ALLOWED_HOSTS` e resolve Relica's por correspondência exata com o Host normalizado. Não aceita lista/configuração inválida, URL/path/credenciais/forwarded claim ou fallback Vercel. Portas explícitas só para loopback e com match exato. O adaptador de headers lê somente Host; contexto contém slug/mode/host, sem ID, segredo ou autorização. A fonte de ingresso foi inspecionada na documentação oficial Vercel, referenciada em ARCHITECTURE e na integração do site; não houve inspeção remota de requests.

`public-paths.ts` é separado da configuração server-only e entrega os caminhos institucionais e por slug. Codifica o slug como segmento único, rejeita traversal/contexto inválido e impede modo site de selecionar outro estabelecimento. Não adiciona Music a novos hosts nem altera admin/membership/RLS.

Verificação RED→GREEN: os dois arquivos de teste falharam inicialmente por módulos ainda inexistentes; após implementação, 12 testes direcionados e 139 testes totais passaram. `npm.cmd run typecheck`, `npm.cmd run lint`, revisão independente sem achados relevantes e revisão de diff passaram. Verificador documental executado no fechamento. Não foram repetidos build/browser: não há alteração de rota, página ou apresentação nesta tarefa.

Limites: helpers ainda não estão conectados às páginas; a home existente e os links atuais não foram alterados. `.env.example` declara a variável vazia; env real, domínio, DNS, dados e produção intactos. Gate antes de rotas estáticas registrado em `docs/site/04-QRCODEX-INTEGRATION.md`: inventariar todos os estabelecimentos (ativos/inativos) com slugs `cardapio`/`agenda`, links/QR e hosts aprovados; não presumir ausência de colisões pelo seed. TASK-068 promovida a READY para essa verificação e integração. Sem commit/push/deploy nesta implementação.
