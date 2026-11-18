# Current Development

## Último ajuste solicitado

[TASK-091](completed/TASK-091-site-hero-image.md) — **DONE**. Nova imagem do palco fornecida pelo usuário aplicada à hero em 2026-11-18, preservando layout, texto e botões. 157 testes, lint/tipos/build e browser em seis larguras passaram; hero mais alta, cena centralizada com bordas suaves e aviso de prévia removido. Sem commit/push/deploy; TASK-068 continua READY como próximo incremento.

[TASK-092](completed/TASK-092-site-hero-copy.md) — **DONE**. Texto da nova referência aplicado à hero, com título creme e descrição completos. Testes do hero, lint, tipos e revisão em cinco larguras passaram. Imagem, enquadramento e botões preservados; sem commit/push/deploy.

## Próxima implementação

TASK-068 — Adicionar cardápio institucional compartilhado — **READY**. [Tarefa](active/TASK-068-site-menu-route.md) · [Site](../docs/site/README.md) · [Plano incremental](../docs/site/06-IMPLEMENTATION-PLAN.md). Integra o catálogo existente em `/cardapio`, preservando destinos por slug e verificando o inventário de hosts/slugs antes de rotas estáticas. A TASK-067 entregou helpers; os aliases institucionais e a configuração real dos hosts ainda não foram concluídos.

A [TASK-084 — layout aprovado](completed/TASK-084-site-approved-layout.md) concluiu localmente a apresentação completa da home em 2026-11-17. `docs/site/reference/layout-aprovado.png` é a única referência visual: header/hero, Agenda escura, Drinks & Petiscos, A Casa, depoimentos, playlist/localização e footer. Substitui as apresentações anteriores das TASK-080/082/072/083; mantém dados/rotas/admin/Música. 151 testes, lint, tipos, build/start e browser em cinco larguras passaram. Sem commit/push/deploy ou dados remotos.

A [TASK-085](completed/TASK-085-site-feature-assets.md) substituiu a montagem de comidas e o microfone por PNGs fornecidos pelo usuário. Texto HTML, layout aprovado e gate de revisão preservados; conferência no servidor local em quatro larguras, tipos/lint/testes direcionados passaram. Sem commit/push/deploy; não modifica dados ou loaders da Agenda.

A [TASK-086](completed/TASK-086-site-image-scale.md) corrigiu a ampliação em monitores largos: foto limitada a 1280 px, faixa compacta de cerca de 280 px no desktop e microfone com altura limitada. Revisão em seis larguras, incluindo 2535/1920 px, texto ampliado, tipos/lint/testes direcionados passaram. Sem publicação ou alteração de dados.

A [TASK-087](completed/TASK-087-site-house-image.md) reduziu a ampliação da foto de A Casa, limitada a 480 px com proporção/cena inteira e mobile ajustado. Sete larguras, tipos/lint/testes pertinentes passaram. Uso amplo nítido depende de imagem maior que a fonte atual de 363 × 219 px. Sem publicação ou geração de imagem.

O usuário autorizou commit e envio para PR em 2026-11-17. As notas “sem commit/push/deploy” acima preservam os checkpoints locais anteriores a essa autorização. O envio para revisão inclui o layout já commitado e os ajustes 085–087; não autoriza merge ou deploy, nem incorpora as alterações locais de skills/Claude.

A [TASK-088](completed/TASK-088-agenda-production-test-events.md) criou em produção, por autorização explícita, três eventos TESTE da referência com mídia: Creed Experience (20/11 20h), Stone Garden (21/11 21h) e System of a Down (22/11 21h), São Paulo. Leitura anônima e carregador real da home em configuração de produção confirmaram os três. Outro Creed Experience já presente foi preservado. Remover/despublicar os testes após validar. O ambiente local ainda aponta ao projeto antigo indisponível; sua conexão não foi alterada. Sem novo deploy/commit/push.

A [TASK-089](completed/TASK-089-site-weekly-agenda-and-media.md) limita a home a dois shows da semana atual (segunda a domingo em São Paulo), mantendo os demais na Agenda completa. Por autorização explícita, todas as imagens selecionadas renderizam também em produção; apenas depoimentos fictícios continuam restritos ao modo de revisão. 156 testes, lint/tipos/build, smoke compilado production/preview e browser passaram. Alterações locais, sem novo commit/push/deploy; produção hospedada depende de publicação posterior.

A [TASK-090](completed/TASK-090-site-real-testimonials.md) substituiu os exemplos por três avaliações reais fornecidas pelo usuário, com autores, sem mês/ano e exibidas em todos os ambientes. Nota Google 4,5/776 é snapshot fornecido, sem API. O botão aguarda link real; usuário autorizou seguir com o conteúdo. 157 testes, lint/tipos/build, smoke production/preview e browser em cinco larguras passaram. Código no commit `8ec7ebb`, integrado pelo PR #9; usuário autorizou em 2026-11-18 commitar e enviar o fechamento documental para novo PR, sem merge ou deploy inferido.

Autorização de imagens não confirma fotografia documental, endereço ou links oficiais. TASK-071/075/076 continuam responsáveis pela integração/conteúdo real. Aceites históricos independentes permanecem abaixo.

## Aceites e bloqueios independentes

| Tarefa | Estado oficial | Próximo checkpoint |
|---|---|---|
| [TASK-058](active/TASK-058-activate-music-on-hub.md) | IN_PROGRESS; validação manual pendente | Ensaio de Música autorizado em produção para Relica's; TV/dois celulares, duração, privacidade/comercial e monitoramento pendentes |
| [TASK-061](active/TASK-061-youtube-music-queue-tv-player-poc.md) | IN_PROGRESS; validação manual pendente | Evidência completa da POC 2; não é POC SUCCESS |
| [TASK-060](active/TASK-060-youtube-music-poc.md) | BLOCKED | Configuração OAuth/playlist da POC 1; não bloqueia o contrato separado de produção |
| [TASK-080](active/TASK-080-site-home-navigation.md) | BLOCKED | Revisão real de larguras e foco no navegador |
| [TASK-031](active/TASK-031-account-password-security.md) | BLOCKED | Aceite manual de troca de senha e novo login |
| [TASK-028](active/TASK-028-permanent-qr.md) | BLOCKED | Destino institucional canônico, domínio/DNS/HTTPS e rotas verificados |

TASK-058/061 conservam IN_PROGRESS histórico como trilhas de aceite; não representam duas implementações concorrentes nem bloqueiam o site. A tarefa e o runbook de Música contêm a evidência operacional detalhada. O [handoff anterior](../docs/music/HANDOFF-2026-11-13.md) foi preservado integralmente como histórico. Produção é acessível a quem possui o link; ensaio não equivale a Preview protegido ou aceite de lançamento.

## Manutenção documental

[TASK-081](completed/TASK-081-documentation-organization.md) organiza fontes por plataforma/produto, concilia conflitos e define atualização/checks. Comece em [docs/README](../docs/README.md) e siga a [governança](../docs/GOVERNANCE.md). O plano e CURRENT avançam a cada incremento concluído do site.

## Limites

Preservar rotas por slug, Menu/Agenda/admin/TV, tenant e dados. Não fazer commit/push/deploy, migrations remotas ou mutações de produção por autorização documental. Permissões específicas anteriores de Música não se estendem ao site. Não concluir aceites manuais por evidência automatizada.

Em 2026-11-18, o usuário autorizou commit e envio das TASK-091/092 para PR, sem nova confirmação conversacional para commits/PRs. Os checkpoints anteriores sem commit/push/deploy permanecem históricos. Esta autorização não inclui merge ou deploy.
