# Produto — Música

## Propósito

Receber pedidos de vídeos numa fila FIFO controlada pelo backend, reproduzir na TV e permitir operação pelo dono. Uma música nova não interrompe a atual. Fila vazia fica aguardando, sem fallback.

## Fontes responsáveis

| Assunto | Fonte |
|---|---|
| Contrato de produção, lifecycle, limites e privacidade | [MUSIC_PRODUCTION](../MUSIC_PRODUCTION.md) |
| Preparação, gates, operação e rollback | [MUSIC_RELEASE_RUNBOOK](../MUSIC_RELEASE_RUNBOOK.md) |
| Progresso e evidência do ensaio autorizado | [TASK-058](../../tasks/active/TASK-058-activate-music-on-hub.md) |
| Instruções do dono | [GUIA_MUSICA_DONO](../GUIA_MUSICA_DONO.md) |
| Schema/RPCs/RLS e fronteira server-only | [Banco](../DATABASE.md) e [arquitetura](../ARCHITECTURE.md) |
| Segurança local no checkpoint TASK-057 | [Review datado](../experiments/MUSIC_PRODUCTION_SECURITY_REVIEW.md) |
| POCs e evidência que ainda falta | [Experimentos](../experiments/README.md) |

## Implementação e aceite são coisas distintas

Pedidos em `/[slug]/musicas`, TV em `/[slug]/musicas/player` e operação em `/admin/music` têm implementação. TASK-058 registra deploy/ativação de ensaio em produção para Relica's e rollout até a migration `20260930000007`. Isso substitui os checkpoints antigos OFF/sem deploy **apenas para esse ensaio**. Outros tenants permanecem OFF conforme o registro; defaults continuam OFF.

Aceite físico com TV/dois celulares, duração, privacidade/comercial e dono do monitoramento seguem na tarefa e runbook. Não marcar lançamento, POC SUCCESS ou DONE pela existência de deploy. Não houve inspeção remota nesta organização documental.

## Fronteira e código

`src/lib/music/`, `src/components/music/`, `src/app/api/music/`, rotas por slug e admin existente. TV tem sessão restrita e lease com gerações; nunca sessão administrativa. Lifecycle/limites são atômicos em Postgres. Credencial privilegiada somente em wrappers server-only validados; admin opera com membership.

Sem votos, agregação, reordenação, pagamentos, playlist de fundo ou novos provedores. As POCs preservadas não são atalhos para liberar endpoints fechados em ambientes hosted.

## Registro preservado

O [handoff anterior de CURRENT](HANDOFF-2026-11-13.md) foi preservado como fotografia histórica. Para próximos passos, use a tarefa/runbook acima e [CURRENT](../../tasks/CURRENT.md). O guia exportado em `output/pdf/guia-musica-relicas.pdf` é derivado do Markdown; alterá-lo exige atualizar e verificar as duas versões.
