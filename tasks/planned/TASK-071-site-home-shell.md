# TASK-071 — Implementar Header Hero e Footer na raiz

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-069, TASK-070
**Migration fronts:** 2, 3, 7

## Objetivo
Substituir o starter por entrada institucional acessível.

A TASK-080 já substituiu o starter por uma abertura com navbar. Reutilizar `SiteHeader` e integrar Hero e Footer ao grupo institucional, com os destinos já entregues.

## Arquivos ou módulos impactados
- `src/app/page.tsx (substituir pela rota agrupada)`
- `src/app/(site)/page.tsx (novo)`
- `src/app/(site)/layout.tsx`
- `src/components/site/site-header.tsx (novo)`
- `src/components/site/hero.tsx (novo)`
- `src/components/site/site-footer.tsx (novo)`
- `tests/site-navigation.test.mjs (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Uma única página resolve / e um root layout; nav/Footer não aparecem em TV/admin.
- [ ] CTAs Ver agenda e Ver cardápio corretos; disclosure mobile com expanded, Escape e foco.
- [ ] Título HTML legível com recorte mobile; sem reserva/ingresso/data de show inventados.
- [ ] Não remover starter assets antes de conferir referências; aliases/hosts desconhecidos mantêm contratos.
- [ ] Conteúdo/asset provisório claramente identificado em local/Preview; bloqueio de publicação registrado.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
Teste de navegação e render + lint/typecheck/build; revisão 320/360/768/1440, teclado e sem JS para conteúdo essencial.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Página longa ainda incompleta neste incremento; não declarar site pronto para produção.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Entrada institucional funcional e revisável, sem seções falsas.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
