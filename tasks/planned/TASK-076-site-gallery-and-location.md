# TASK-076 — Finalizar Localização e conteúdo público

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-075
**Migration fronts:** 7, 8

## Objetivo
Finalizar endereço, horários, links oficiais e mídia aprovada na composição entregue pela TASK-084. Galeria foi retirada do layout vigente por aprovação explícita do usuário em 2026-11-17 (ADR-022); o nome histórico do arquivo é preservado para compatibilidade documental. Sua eventual volta exige nova solicitação, sem uploader inferido.

## Arquivos ou módulos impactados
- `src/components/site/home-visit.tsx (existente)`
- `src/app/(site)/page.tsx`
- `assets de localização aprovados, quando fornecidos`
- `docs/site/05-ASSETS.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Completar localização com conteúdo confirmado e mídia aprovada, sem reinserir Galeria no layout atual.
- [ ] Endereço/horários/contatos vêm dos campos aprovados; nenhum dado copiado de screenshot sem confirmação.
- [ ] Direções externas com URL validada; sem embed pesado obrigatório ou reserva inventada.
- [ ] Playlist/redes apontam apenas para links oficiais confirmados; sem URLs presumidas para imitar ícones do screenshot.
- [ ] Estados ausentes respeitam pendências de Preview e não escondem falta de conteúdo no release.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
lint/typecheck/build; links de direções/contato, QA mobile/keyboard, rede limitada.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Publicar horários incorretos; prometer uploader de galeria inexistente.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Composição aprovada com localização e links oficiais rastreáveis.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
