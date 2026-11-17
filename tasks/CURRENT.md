# Current Development

## Próxima implementação

TASK-068 — Adicionar cardápio institucional compartilhado — **READY**. [Tarefa](active/TASK-068-site-menu-route.md) · [Site](../docs/site/README.md) · [Plano incremental](../docs/site/06-IMPLEMENTATION-PLAN.md). Integra o catálogo existente em `/cardapio`, preservando destinos por slug e verificando o inventário de hosts/slugs antes de rotas estáticas. A TASK-067 entregou helpers; os aliases institucionais e a configuração real dos hosts ainda não foram concluídos.

A [TASK-084 — layout aprovado](completed/TASK-084-site-approved-layout.md) concluiu localmente a apresentação completa da home em 2026-11-17. `docs/site/reference/layout-aprovado.png` é a única referência visual: header/hero, Agenda escura, Drinks & Petiscos, A Casa, depoimentos, playlist/localização e footer. Substitui as apresentações anteriores das TASK-080/082/072/083; mantém dados/rotas/admin/Música. 151 testes, lint, tipos, build/start e browser em cinco larguras passaram. Sem commit/push/deploy ou dados remotos.

Conceitos/depoimentos são identificados somente em desenvolvimento/Preview; produção não renderiza essa mídia. Publicação exige conteúdo real, autorizações e links oficiais; endereço/playlist não foram presumidos do screenshot. TASK-071/075/076 reconhecem a apresentação antecipada e continuam responsáveis pela integração/conteúdo real. Aceites históricos independentes permanecem abaixo.

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
