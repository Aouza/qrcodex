# TASK-077 — Preparar SEO e desempenho institucional

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-076
**Migration fronts:** 7, 8, 10

## Objetivo
Preparar indexação e entrega rápida sem canonical host presumido.

## Arquivos ou módulos impactados
- `metadata em src/app/(site)/`
- `src/app/sitemap.ts (novo)`
- `src/app/robots.ts (novo)`
- `assets OG/favicon aprovados`
- `next.config.ts somente se necessário`
- `docs/site/07-QUALITY-AND-SECURITY.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Canonical e sitemap em host confirmado; aliases sem redirect permanente inicial.
- [ ] Preview noindex, admin não indexável, nenhum host arbitrário em URLs de SEO; robots não é controle de acesso.
- [ ] Structured data somente com fatos publicados/verificados; sem reviews/preço/ingresso inventado.
- [ ] Medir LCP/CLS e uso de fontes/imagens em lab; registrar limitação de p75/INP real.
- [ ] Sem novos analytics/scripts por padrão; preservar origin e cookies Music.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
build/start metadata/robots/sitemap smoke; medição lab e revisão de imagens/fontes.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Domínio definitivo pendente bloqueia aceite SEO de produção; não inventar métricas de campo.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
SEO configurável e evidência de desempenho.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
