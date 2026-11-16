# Current Development

## Próxima implementação

TASK-068 é o próximo incremento **READY**. A [TASK-072 — seção de Agenda na homepage](completed/TASK-072-site-home-agenda.md) foi concluída localmente a pedido do usuário, usando o papel fornecido, eventos reais e destino `/relicas/agenda`. Build/start isolado e revisão de componentes passaram; não implementa o alias nem conclui a home completa.

A [TASK-082 — Hero institucional conforme referência](completed/TASK-082-site-home-hero.md) também foi fechada localmente: os checks de build/start da TASK-072 resolveram a pendência técnica anterior e a revisão combinada usa a imagem fornecida pelo usuário. Sem aliases, publicação ou alteração de dados. O histórico das falhas anteriores permanece na tarefa.

TASK-068 — Adicionar cardápio institucional compartilhado — **READY**. [Tarefa](active/TASK-068-site-menu-route.md) · [Site](../docs/site/README.md) · [Plano incremental](../docs/site/06-IMPLEMENTATION-PLAN.md). A criação do site institucional em `/` segue como prioridade. A [TASK-067](completed/TASK-067-site-public-context.md) entregou helpers de contexto/links; o próximo incremento integra o catálogo existente em `/cardapio`, preservando os destinos por slug e verificando o gate de inventário antes de rotas estáticas.

TASK-063 registrou a linha de base local. TASK-080 antecipou a navbar e abertura de /; TASK-071 reutiliza o header na home completa. Os aliases institucionais /cardapio e /agenda e a integração do contexto às páginas seguem planejados. A configuração real de hosts e o inventário de slugs ainda precisam ser confirmados; a TASK-067 não os presume.

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
