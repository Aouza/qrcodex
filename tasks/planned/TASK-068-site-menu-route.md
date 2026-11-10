# TASK-068 — Adicionar cardápio institucional compartilhado

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-067
**Migration fronts:** 3, 4

## Objetivo
Oferecer /cardapio com o mesmo catálogo e navegação contextual.

## Arquivos ou módulos impactados
- `src/app/(site)/layout.tsx (novo, wrapper mínimo)`
- `src/app/(site)/cardapio/page.tsx (novo)`
- `src/app/(site)/cardapio/loading.tsx e error.tsx (novos)`
- `src/app/[slug]/cardapio/page.tsx`
- `src/components/menu/public-menu-view.tsx (novo)`
- `ações products/categories que invalidam catálogo`
- `tests/site-menu.test.mjs (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Extrair apresentação sem duplicar MenuCatalog/loadPublicMenu e sem importar page.tsx como serviço.
- [ ] Hosts aprovados usam Relica's; desconhecido não seleciona tenant; verificar colisões antes do route estático.
- [ ] Novo retorno leva a /; legado leva a /slug. Sem main/nav duplicado pelo layout.
- [ ] Testar busca/limpar, foto ausente, active/available/featured, vazio e edição administrativa refletida nos dois acessos.
- [ ] Incluir /cardapio na invalidação somente para o contexto Relica's; manter APIs/admin/Música.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
Testes direcionados menu/contexto + lint/typecheck/build; smoke build/start com fixtures isoladas de /cardapio e /relicas/cardapio.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Recolorir MenuCatalog ou duplicar consultas muda contrato; não redirecionar aliases antigos.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Nova rota pública com domínio único e compatibilidade.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
