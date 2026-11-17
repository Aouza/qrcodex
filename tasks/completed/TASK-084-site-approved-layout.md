# TASK-084 — Aplicar layout aprovado ao site institucional

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-072, TASK-083

## Objetivo e desenho aprovado
Em 2026-11-17 o usuário aprovou `docs/site/reference/layout-aprovado.png` como única referência visual e autorizou aplicar em todo o site institucional, desconsiderando a apresentação anterior. A aprovação é de layout; não comprova fatos, fotografia documental, links ou autorização de release.

Ordem: header/hero integrados, Agenda escura em linhas, Drinks & Petiscos, A Casa, depoimentos compactos, playlist/localização e footer. Base quase preta, creme, vermelho e bordas bronze discretas. Display condensado/itálico, rock vermelho em destaque, fotografia à direita e texto HTML. Mobile reorganiza em uma coluna, sem carrossel ou perda de conteúdo. Galeria e papel da Agenda deixam de compor a home.

Abordagem escolhida pelo pedido: substituir a apresentação dentro do Next existente, mantendo loaders/rotas/menu/admin/Música. Não rasterizar a página nem criar outra aplicação. Assets dos ZIPs são mídia conceitual de revisão local/Preview, com identificação e gate existente; produção usa apresentação sem essa mídia até aprovação documental. Shows continuam reais e publicados. Localização/playlist/redes sem dados confirmados não ganham links inventados. Reserva continua conversa com WhatsApp cadastrado, não sistema de reservas.

## Plano e arquivos
1. Atualizar testes de jornadas: navegação Localização, hero reserva/Agenda, linhas de eventos reais, exemplos sem estrelas conforme nova referência. Observar falhas antes da implementação.
2. Substituir estilos/componentes em `src/components/site/`, compor seções em `src/app/page.tsx`/CSS e importar assets fornecidos em `public/assets/site-review/`. Centralizar gate e navegação compartilhada, sem dados/env privados no cliente.
3. Testar layout real e interação mobile 320/360/768/1440, estados da Agenda e fronteira produção/Preview em servidor compilado. Executar lint/tipos/suite/build.
4. Revisar, sincronizar PRD/design/decisão/contratos/assets/backlog/current, preservar histórico e mover tarefa para completed quando o aceite passar.

## Critérios de aceite
- [x] Composição completa conforme referência aprovada, sem restos do papel/galeria/estrelas anteriores na home.
- [x] Conteúdo textual HTML; assets otimizados fornecidos, fontes locais e CSS restrito ao site.
- [x] Agenda reutiliza fonte pública, datas São Paulo, loading/vazio/erro independentes; sem shows/tipos/preços inventados.
- [x] CTAs e âncoras reais, menu mobile utilizável com teclado/Escape/foco; ausência de contato/link tem fallback honesto.
- [x] Conteúdo conceitual identificado somente em desenvolvimento/Preview, não publicado como fato/foto/depoimento real.
- [x] Sem overflow em 320/360/768/1440; imagens reservam espaço e hero priorizada, demais lazy.
- [x] Checks, revisão e documentação sincronizados; menu/admin/Hub/Música/tenancy preservados.

## Execução e limites
Execução inline na branch de homepage existente; mudanças locais do usuário (incluindo hero antiga e novos ZIPs) preservadas. Sem commit/push/deploy/migration remota. Novos aliases e conteúdo editorial/admin continuam nas tarefas canônicas; esta aprovação visual não os conclui. Fontes: AGENTS, CURRENT, docs/README, PRD, ARCHITECTURE, DESIGN_SYSTEM, DECISIONS, GOVERNANCE e docs/site/00–08. Plano/desenho reunidos na tarefa segundo governança do projeto. A skill Sites é usada em modo local-only, sem registro/hospedagem alternativa.

## Notas de conclusão
Apresentação completa substituída em 2026-11-17, seguindo a referência aprovada e os assets fornecidos. Header sobre hero, tipografia condensada e “rock.” ampliado; Agenda em linhas escuras com flyers reais, date/time e contato opcional; composições de Drinks/A Casa; depoimentos compactos após A Casa, sem estrelas; playlist/localização/mapa de revisão e footer com navegação/contatos válidos. Sem galeria ou papel. `HomeFeatures`, `HomeVisit` e `SiteFooter` são Server Components; shared navigation, icons, CSS UI e gate de revisão evitam duplicação. A pequena ilha client do menu mantém Escape e foco.

Os assets WebP do pacote foram extraídos com verificação de destinos, sem sobrescrever arquivos do usuário; hero fornecida tem 47.030 bytes. Não houve geração de imagens, nova família de fontes, alteração de dados ou novo backend. Conceitos e depoimentos têm aviso visível somente em desenvolvimento/Preview. Sem endereço verificado, a localização encaminha ao contato existente; sem WhatsApp informa indisponibilidade mesmo com Instagram. Playlist sem link oficial permanece explicitamente pendente. Não há URLs inventadas de Spotify/Facebook/YouTube ou informações de tributo/ingresso.

Teste inicial observou quatro falhas esperadas contra a apresentação antiga; implementação passou. `node --test tests/*.test.mjs`: 151 testes, zero falhas, incluindo gate de ambientes, novas jornadas e regressão do footer sem WhatsApp. `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd run build` passaram. Build Turbopack final dos ajustes de CSS concluído; tipos repetidos após build passaram. Avisos preexistentes de npm/Node não bloquearam os checks.

Browser Chromium com servidor compilado/Next real e transporte inteiramente interceptado, repetido após build final: 1440/1024/768/360/320 px, imagens carregadas, texto longo sem espaços, âncoras válidas, menu Enter/Escape/foco/navegação, vazio/erro e hidratação sem falhas. Fixtures de eventos/contatos são exclusivas de QA, identificadas; não tocam Supabase real ou comprovam conteúdo público. Capturas finais: [desktop](../../output/site-layout-review/home-1440.png), [1024 px](../../output/site-layout-review/home-1024.png), [mobile](../../output/site-layout-review/home-320.png). Harness e estado temporários removidos; servidores próprios encerrados.

`node tests/site-home-http-smoke.mjs` passou em produção (sem imagens conceituais/depoimentos) e `VERCEL_ENV=preview` (com imagem/aviso/nomes e ordem após A Casa). Servidor compilado verifica home/Agenda legada, publicação/despublicação, exclusão/mídia, outro tenant, leitura nova e erro independente, com toda comunicação externa interceptada. Não comprova SQL remoto, atualização de aba aberta, fatos/autorizações do bar ou release.

Revisão independente apontou asserts antigos do smoke e ausência de aviso de WhatsApp quando existe Instagram. Ambos corrigidos; teste novo RED/GREEN para o footer. Revisor confirmou as correções sem pendências. PRD, arquitetura, design, ADR-022, contratos, assets e planejamento reconciliados; TASK-071/075 reconhecem a apresentação antecipada e TASK-076 retira Galeria do escopo vigente. Essas tarefas de integração/conteúdo real não foram marcadas DONE por inferência.

Verificações e documentação concluídas; `node scripts/check-docs.mjs` e `git diff --check` passaram. Pendências de produto preservadas: conteúdo factual/fotos reais/depoimentos e links oficiais para publicação, aliases/host/slugs e schema/admin editorial nas tarefas canônicas. Sem commit/push/deploy. Próximo incremento READY permanece TASK-068.
