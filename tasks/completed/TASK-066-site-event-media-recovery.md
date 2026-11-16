# TASK-066 — Proteger exclusão e recuperação de mídia de eventos

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-065
**Migration fronts:** 5, 6, 9

## Objetivo
Impedir sucesso indevido e publicação quebrada quando banco e Storage falham parcialmente.

## Plano e recuperação — 2026-11-13
Prioridade do site mantida; `/` é a homepage institucional. Antes da remoção física, salvar e confirmar o evento como rascunho sem referência de mídia, mantendo a linha necessária à RLS de Storage. Falha de Storage pode restaurar somente a referência antiga em rascunho, nunca republicar automaticamente. Se a compensação falhar, manter o rascunho sem mídia e reportar recuperação pendente. Na substituição, manter o novo flyer vinculado se a limpeza do antigo falhar; não apagar a nova mídia após rollback incerto. Objetos órfãos exigem revisão operacional autorizada, não service-role editorial.

Executar testes de falha antes da correção; verificar ausência de linha, sessão expirada e isolamento de tenant/recurso; atualizar consumidores públicos após alterações parciais. Branch `fix/site-event-media-recovery`. Sem publicação automática.

## Arquivos ou módulos impactados
- `src/app/admin/(protected)/events/[id]/actions.ts`
- `src/app/admin/(protected)/events/[id]/image-actions.ts`
- `src/lib/admin/event-media-recovery.ts`
- `src/lib/validation/event-image.ts`
- `tests/event-actions.test.mjs (novo)`
- `docs/DATABASE.md se o contrato de recuperação mudar`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [x] Reproduzir Storage remove bem-sucedido seguido de falha de DELETE; evento não pode continuar publicado com flyer ausente.
- [x] Definir compensação/estado recuperável antes de editar: Storage exige registro existente, então não apenas inverter DELETE/remove.
- [x] Cobrir falha de remoção, falha de compensação, update/delete sem linha, ID cruzado e autorização expirada.
- [x] Não usar service-role editorial, não enfraquecer Storage RLS e manter confirmação de exclusão.
- [x] Documentar recuperação de órfãos/rascunho e mensagens de erro; testes comprovam ausência de falso sucesso.
- [x] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/event-actions.test.mjs tests/event-image-validation.test.mjs; checks lint/typecheck; SQL Storage isolado se políticas forem afetadas.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Sem transação atômica entre Postgres e Storage; rollback também pode falhar. Política depende do evento.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Fluxo e recuperação definidos com testes de falha e ownership.

## Notas de conclusão
Concluída localmente em 2026-11-13. A remoção confirma rascunho sem referência de mídia antes de apagar o arquivo e mantém a linha durante autorização de Storage. DELETE e compensação conferem linha afetada; restauração condicional nunca republica nem sobrescreve uma mídia concorrente. Substituição mantém a nova imagem vinculada quando a limpeza da anterior falha. Caminhos físicos são limitados ao projeto/bucket e tenant/evento exatos. Admin, Hub e Agenda são invalidados também em estados parciais. O diálogo de confirmação existente foi preservado, sem alteração de UI.

Evidência RED→GREEN: seis cenários inicialmente falharam, incluindo evento publicado quebrado após DELETE, ausência de linha, compensação falha, remoção da mídia nova após rollback incerto e exclusão de arquivo de outro recurso. A revisão encontrou ainda UPDATE confirmado no banco mas com resposta perdida: novo teste falhou antes de corrigir a exclusão indevida do upload possivelmente vinculado. Esse caso agora preserva o arquivo e exige revisão, sem falso sucesso.

Verificações: 21 testes direcionados (18 de ações e 3 de mídia); 127 testes totais; lint completo e direcionado; TypeScript; build; revisão independente sem bloqueios após correção. Limite: fixtures simulam banco/Storage e não comprovam chamadas reais, layout ou comportamento remoto. Nenhuma política/grant/schema foi alterada; SQL remoto não foi executado. Docs de banco, decisão ADR-022, conteúdo/integração, índices e plano atualizadas. Verificador documental/diff conferidos no fechamento.

Recuperação: falhas podem deixar rascunho e arquivos órfãos; DATABASE descreve revisão autorizada da pasta e comparação com ponteiro atual, preferencialmente antes de excluir a linha. Se a linha desaparecer, a RLS mantém a exclusão negada à aplicação e a revisão administrativa requer autorização própria. Não introduzir service-role editorial, limpeza automática ou promessa de rollback atômico. Sem commit/push/deploy ou mutação remota. TASK-067 promovida a READY: contexto e destinos do site institucional em `/`.
