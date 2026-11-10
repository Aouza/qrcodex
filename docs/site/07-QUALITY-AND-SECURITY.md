# Qualidade, segurança e preparação de release

## Linha de base e testes
Comandos existentes: `npm.cmd run lint`, `npm.cmd run typecheck`, `node --test tests/*.test.mjs`, `npm.cmd run build`. Auditoria anterior passou 97 testes e demais checks; não é evidência nova de release. Node 24 executa testes TS existentes. Não trocar stack de teste automaticamente; browser tooling só por necessidade concreta.

Testes por mudança: primeiro reproduzir bugs em teste; executar teste direcionado e regressões pertinentes. Browser/build/start para rotas e freshness; assertions de CSS/SSR não provam layout, teclado, hidratação ou clique. SQL/RLS/Storage com fixtures somente em ambiente isolado, nunca produção por parecer Preview.

## Matriz mínima
| Área | Evidência exigida |
|---|---|
| Menu | busca/limpar, categorias ordenadas, featured, Esgotado, preço, vazio, foto ausente |
| Admin | criar/editar/ativar, ordenar, uploads e falhas, sessão expirada e logout |
| Eventos | datas impossíveis, madrugada/fim, 24 antigos + futuro, draft/publish/unpublish/delete, mídia |
| Site | CTAs, navegação mobile, vazio/erro isolado, contatos e direções |
| Tenancy | acesso cruzado negado, zero/múltiplas memberships controlados, host desconhecido, marca correta |
| Compatibilidade | aliases/queries/âncoras/QR, slug reservado, admin/API/Music intactos |
| Segurança | RLS/grants, writes servidor, service key ausente do browser, dados privados fora de caches |
| Visual | 320/360/768/1440 px, teclado, foco, zoom, contraste, reduced motion, rede lenta |

## SEO e desempenho
Titles/description/canonical/OG por superfície, sitemap/robots coerentes com host aprovado. Preview sem indexação e sem canonical acidental para host arbitrário; robots não protege acesso. Dados estruturados apenas de fatos confirmados; nenhuma avaliação, preço ou ingresso inventado. Admin não indexável.

Alvos de campo iniciais: LCP <=2.5s, INP <=200ms, CLS <=0.1 p75. Lighthouse/lab não comprova p75 real. Reservar imagens, limitar fontes/scripts, sem mapa/analytics/embeds obrigatórios. Registrar medições e limitações reais.

## Gates de publicação
1. Commit/versão candidata e ambiente alvo identificados; checks/regressões aprovados.
2. Conteúdo/assets autorizados, domínio/DNS/HTTPS verificados, URLs antigas testadas.
3. Histórico remoto comparado; migrations aditivas ensaiadas e app anterior compatível.
4. Backup recuperável com escopo/exclusões de banco/Auth/Storage explícitos. Backup Music existente não cobre tudo.
5. Preview revisado e roteiro de smoke/rollback pronto; autorização externa específica antes de deploy/migration.
6. Após release autorizado, smoke não destrutivo e acompanhamento de falhas; sem fixtures Google/fila/leases sintéticos em produção.

Rollback de aplicação preserva dados/schema aditivo e retorna a versão compatível. Nunca restaurar banco como rotina nem reabrir POC Music. TASK-058 mantém seus gates físicos/comerciais próprios; deploy do site não os conclui.
