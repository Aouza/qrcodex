# TASK-070 — Integrar tokens e inventário de assets

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-063
**Migration fronts:** 8

## Objetivo
Preparar tema escuro/vermelho/papel local e mídia verificável.

## Arquivos ou módulos impactados
- `src/components/site/site.module.css (novo)`
- `src/components/site/section-heading.tsx (novo)`
- `src/components/site/site-link.tsx (novo)`
- `docs/site/05-ASSETS.md`
- `docs/DESIGN_SYSTEM.md`
- `public/assets/ apenas assets efetivamente criados`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Definir tokens da spec no wrapper; não sobrescrever :root dourado/admin/TV.
- [ ] Escolher uma display legível e corpo/fallback com pesos limitados e escopo local; registrar contraste, 44px e reduced motion.
- [ ] Inventariar origem/licença/aprovação/peso/recorte/alt; manter faltantes explícitos e conceito apenas revisão identificada.
- [ ] Papel rasgado decorativo somente Agenda; nenhuma foto gerada é apresentada como ambiente real.
- [ ] Revisar componentes em 320/360/768/1440 e keyboard; guardar evidência quando UI puder ser renderizada.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
lint/typecheck/build se fontes/componentes forem adicionados; contraste e revisão visual documentados.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Assets reais ausentes bloqueiam release, não mock identificado; não instalar biblioteca visual por padrão.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Base visual reutilizável e inventário aprovado/pendente.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
