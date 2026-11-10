# TASK-074 — Editar conteúdo institucional no admin

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-073, TASK-072
**Migration fronts:** 5, 7

## Objetivo
Permitir edição dos campos institucionais no mesmo painel.

## Arquivos ou módulos impactados
- `src/app/admin/(protected)/settings/`
- `src/components/admin/site-content-form.tsx (novo)`
- `src/lib/site/load-site-content.ts (novo)`
- `src/components/admin/admin-nav.tsx se necessário`
- `tests/site-content-actions.test.mjs (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Cada loader/action resolve membership e tenant servidor; não aceitar tenant do form como autoridade.
- [ ] Formulário tipado com Zod, erro/sucesso/pending, sem HTML arbitrário; nome/logo/contatos preservados.
- [ ] Leitura pública sem sessão admin; alteração visível em nova navegação da home sem deploy.
- [ ] Casos inválidos/cross-tenant/múltiplas memberships e erro de banco testados.
- [ ] Registrar jornada móvel do proprietário como evidência manual, sem auto-PASS.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
Testes actions/validação + lint/typecheck/build; fluxo isolado save->public.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Aplicação depende de schema compatível; publicar app/migration em ordem revisada.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Autonomia institucional real no admin atual.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
