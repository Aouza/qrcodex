# Music release gate — TASK-058

## Estado registrado e alcance

Este runbook descreve preparação, operação e gates. A [TASK-058](../tasks/active/TASK-058-activate-music-on-hub.md) é a fonte de progresso/evidência do ensaio; o [contrato de produção](MUSIC_PRODUCTION.md) define comportamento. A revisão documental de 2026-11-13 não inspecionou nem alterou produção.

O registro mais recente da tarefa inclui ensaio autorizado em https://qrcodex-eight.vercel.app, Hub Música para Relica's, rollout aditivo até 20260930000007, pareamento curto e correção de busca. Defaults e demais tenants permanecem OFF conforme o registro. A preparação anterior com Preview e flags/budgets OFF foi seguida por autorização específica de ensaio em Production; não tratar esse checkpoint anterior como estado atual.

O domínio é acessível a quem tem o link; não é Preview privado. Deploy, ensaio e checks automatizados não equivalem a aceite físico, POC SUCCESS, lançamento comercial ou DONE. Não há autorização nova de commit/push/deploy/migration neste documento.

## Preparação para qualquer próximo rollout autorizado

1. Identificar projeto Vercel, ambiente, versão candidata, tenant e banco deliberadamente. Um Preview apontado para produção escreve dados reais. Separar variáveis/segredos de Preview e Production; nunca usar fixtures SQL ou fila/leases sintéticos em produção.
2. Comparar histórico remoto real com as migrations versionadas antes de determinar pendências. A tarefa já registra 00002–00007 aplicadas: não reaplicá-las por seguir um checklist antigo. Migrations novas devem ser aditivas e compatíveis com o app; não reabrir RPCs/rotas POC revogados em rollback.
3. Verificar backup e ensaio de restauração antes de mudança aprovada. O script de backup de Música gera arquivo ignorado e criptografado por DPAPI e restaura em PostgreSQL isolado. Ler o manifest: depende deste perfil Windows; cobre public/private/histórico/ACLs no escopo indicado, exclui credenciais/sessões Auth e arquivos Storage. Não é recuperação completa da plataforma. Nunca enviar backups/env no código de Preview.
4. Configurar segredos server-only independentes, origem HTTPS exata e credencial de RPC restrita. A assinatura do token rejeita forjados, mas revogação/expiração/tenant continuam autoritativos no banco. Nunca registrar valores, tokens/códigos de TV ou bypass de automação em URL/log/browser.
5. Rever quotas reais do Google antes de alterar budgets. O ensaio registrou limites observados de 100 buscas/dia e 10.000 unidades gerais/dia, com caps do app 80 buscas/dia e 100 consultas de metadados/dia, custos um por bucket. São evidências do checkpoint, não limites eternos do provedor. Configuração privada via operador autorizado; não zerar uso existente.
6. Rodar checks isolados pertinentes, build e HTTP sobre fixtures locais. Verificar fechamento hosted da POC, autorização/origem/consentimento, Menu/Agenda/admin e ausência de segredo no bundle. Registrar comandos/versão e limites; testes locais não comprovam áudio/autoplay real.

## Retenção e monitoramento

Scheduler aprovado e registrado: **Supabase Cron**, uma execução horária owner-only, independente da TV. Sem Vercel cron duplicado ou upgrade pago. O script operacional music-cleanup-cron.sql usa o job relicas-music-cleanup-hourly a cada hora, com timeouts e sem remover jobs alheios. Conferir propriedade/alvo antes de qualquer execução aprovada. HTTP cleanup com CRON_SECRET é fallback manual opcional, não requisito do cron de banco.

O checkpoint registra execução real bem-sucedida e restauração da cadência horária após teste controlado. Confirmar responsável e alerta para falhas/execuções perdidas continua pendente. Detectar falhas antes de consumir a margem dos thresholds de 29 dias para metadados/receipts e 23 horas para digests, respeitando os máximos canônicos de 30 dias/24 horas. Configuração por si só não comprova execução contínua.

Fechar a TV não limpa fila/histórico: lease expira separadamente da retenção. Não remover pg_cron no rollback, pois podem existir outros jobs. Exclusão emergencial ou restauração destrutiva exige escopo/autorização próprios.

## Ensaio e evidência manual obrigatória

Parear pelo /admin/music autenticado; TV abre /relicas/musicas/player sem sessão admin, com HTTPS/Web Locks. O código tem oito caracteres, uso único e validade de dez minutos. Pode ser necessária uma ativação inicial. O [guia do dono](GUIA_MUSICA_DONO.md) detalha operação e diagnóstico.

- Registrar navegador/versão, TV, celulares, host, tenant e horários; conferir 320px e rede limitada.
- Celular A pede enquanto TV espera; B pede durante a primeira música sem interrompê-la; A pede a terceira. ENDED avança FIFO e a última deixa WAITING, sem fallback.
- Vídeo indisponível/não incorporável deve falhar e avançar. Refresh recupera a atual; eventos antigos não avançam outra vez.
- Pausar pedidos preserva playback; desabilitar/revogar para sem marcar played. Skip/remove atingem apenas o pedido correto. Substituição explícita invalida a TV anterior; segunda aba não toma lease vivo.
- Desconexão além do lease para localmente e bloqueia admissão; reconectar recupera a atual. Verificar sessão expirada/revogada, Wi-Fi compartilhado, consentimento/limites/quota e ausência de identificadores/segredos em logs.
- Registrar reprodução por várias horas sem intervenção entre músicas, Realtime real, recuperação lenta de eventos perdidos e regressão de Menu/Agenda/auth/admin.

## Aceite de lançamento e rollback

Ainda faltam evidência manual completa, revisão de uso no estabelecimento/políticas/direitos, privacidade e responsável pelo monitoramento. A autorização anterior cobre somente o ensaio descrito, não aceite comercial. Registrar a aprovação específica de qualquer nova ação externa e o resultado pós-release; não refazer ativação já implementada como se fosse pendência de código.

Rollback operacional: pausar novos pedidos, desabilitar Música ou revogar TV pelas operações autenticadas; preservar fila/histórico e Menu/Agenda. Reverter app somente para versão compatível, sem restaurar bypass POC ou reverter schema destrutivamente. Acompanhar erros de RPC/upstream/cron com informações agregadas e sanitizadas.
