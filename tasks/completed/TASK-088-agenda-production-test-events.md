# TASK-088 — Criar três eventos de teste em produção

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-072

## Autorização e objetivo
Em 2026-11-17 o usuário pediu três eventos no banco e confirmou explicitamente produção: “pode ser em prod, depois ajustamos”. Autoriza somente criar/publicar três registros claramente identificados como TESTE e suas mídias de revisão para Relica's, sem alterar registros existentes ou outros tenants. Não autoriza migrations, deploy, mudança de Música ou troca da conexão local nesta etapa.

Diagnóstico anterior: projeto de desenvolvimento não resolve DNS; projeto ativo configurado em `.env.production.local` responde à leitura pública e identifica Relica's. Não expor credenciais nem incorporá-las ao app/browser.

## Plano e aceite
- [x] Validar alvo, tenant e arquivos locais; preparar manifesto idempotente privado antes da gravação.
- [x] Criar três rascunhos com UUIDs próprios, imagens no bucket existente sob tenant/evento e publicar somente após confirmar uploads.
- [x] Títulos/descrições indicam TESTE, sem show real confirmado; conforme direcionamento posterior do usuário, Creed Experience em 20/11 20h, Stone Garden em 21/11 21h e System of a Down em 22/11 21h, São Paulo. Imagens correspondentes do pacote de referência, exclusivamente como mídia dos testes autorizados. Datas futuras substituem outubro passado para que apareçam na Agenda.
- [x] Confirmar três registros por leitura anônima/RLS e mídias acessíveis, sem alterar outros eventos.
- [x] Registrar IDs, horários, resultado e pendências; sincronizar backlog/current e check-docs.

## Limites e recuperação
Operação administrativa server-side pontual com credencial existente, não nova integração privilegiada no app. Manifesto e script em `.release-backups/` ignorado; não registrar segredos. Falha durante criação reverte somente os UUIDs/objetos deste lote. Reexecução não duplica registros. Eventos publicados são acessíveis publicamente e devem ser removidos/despublicados pelo admin após o teste; as datas limitam a relevância pública, não apagam os registros. Conexão local antiga permanece inalterada, conforme orientação do usuário.

## Notas de conclusão
Operação concluída em produção em 2026-11-17, sob autorização explícita e confirmação posterior de usar os eventos da referência. A tentativa anterior foi interrompida com manifesto ainda preparado; a execução final consultou os UUIDs antes da escrita e não encontrou lote anterior. Três rascunhos foram inseridos juntos, com mídia enviada/confirmada antes da publicação do lote. Nenhuma migration, alteração de RLS, app, credencial, tenant alheio ou evento existente.

Alvo: projeto `xybkiiuekjjchxxoxlyi`, estabelecimento Relica's `241460c5-accf-47c8-bf64-22e133edea2d`. Credencial administrativa existente usada apenas no operador server-side; não exposta ou incorporada ao código do app. Manifesto privado em `.release-backups/site-review-events-2026-11-17/manifest.json`, ignorado pelo Git, registra objetos e resultado para recuperação/limpeza.

| ID criado | Título | Início São Paulo | Fim São Paulo |
|---|---|---|---|
| `56e7a5cd-af99-4ec1-aa4a-a18aaa4aa032` | TESTE — Creed Experience | 20/11/2026 20h | 20/11/2026 23h |
| `319f5bf2-3bff-419b-89e0-3287aac3dacb` | TESTE — Stone Garden | 21/11/2026 21h | 22/11/2026 00h |
| `f37225d5-8ad2-46d1-9230-3542c5c690fb` | TESTE — System of a Down | 22/11/2026 21h | 23/11/2026 00h |

Descrição comum deixa explícito que são tributos fictícios de teste da referência, sem contratação/show confirmado ou ingresso. Imagens WebP fornecidas `show-vocalista`, `show-guitarrista` e `show-plateia`, respectivamente, reutilizadas para testes e copiadas para `event-images/<tenant>/<event-id>/site-review-20261117.webp`. Não foram geradas fotos nem inferidos dados comerciais.

Verificação real: três uploads com HEAD público 200; três eventos publicados retornados por leitura anônima sob RLS. O próprio `loadHomeEvents()` carregado com configuração de produção retornou `ready` em 1859 ms e incluiu os três UUIDs. Também retornou um `CREED EXPERIENCE` sem marca TESTE, ID `3ed0cb04-8901-40ee-b1cc-13c88bad6e7e`, que não pertence a este lote e foi preservado. Não presumir que só existam os três testes no banco.

Conexão local permaneceu apontando ao projeto antigo indisponível, conforme orientação de ajustar depois; a leitura em produção não equivale a dizer que o URL local já exibe os dados. Não houve deploy, novo commit/push ou alteração em Música. Testes/build de aplicação não repetidos: nenhuma implementação mudou. `node scripts/check-docs.mjs` valida o registro documental.

Pendência: remover/despublicar os três UUIDs pelo admin ao encerrar a revisão; expiração temporal só os retira da seleção pública, sem apagar dados/mídias. Próximo incremento READY continua TASK-068; conexão local é diagnóstico/configuração separado, sem autorizar troca silenciosa de ambiente.
