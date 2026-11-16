# TASK-075 — Implementar Drinks e petiscos e A Casa

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-070, TASK-074
**Migration fronts:** 7, 8

## Objetivo
Apresentar oferta e ambiente com conteúdo real e acesso ao menu.

## Arquivos ou módulos impactados
- `src/components/site/drinks-section.tsx (novo)`
- `src/components/site/venue-section.tsx (novo)`
- `src/app/(site)/page.tsx`
- `public/assets/menu/ e venue/ com arquivos aprovados`
- `docs/site/05-ASSETS.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Usar campos institucionais e fotos autorizadas; sem inventar itens/características.
- [ ] CTA leva ao catálogo compartilhado; não manter preço/disponibilidade em cópia manual.
- [ ] Imagem ausente não quebra layout; proporção/sizes/lazy-load corretos.
- [ ] Revisão 320/360/768/1440, texto longo/teclado/alt.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
lint/typecheck/build, smoke CTA, QA visual e inventário de direitos.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Assets/conteúdo não aprovados impedem release, mesmo com componentes prontos.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Duas seções conectadas ao conteúdo aprovado.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
