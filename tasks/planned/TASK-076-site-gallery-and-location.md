# TASK-076 — Implementar Galeria e Localização

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-075
**Migration fronts:** 7, 8

## Objetivo
Completar a homepage com mídia curada e informações úteis verificadas.

## Arquivos ou módulos impactados
- `src/components/site/gallery-section.tsx (novo)`
- `src/components/site/location-section.tsx (novo)`
- `src/app/(site)/page.tsx`
- `public/assets/gallery/ com fotos aprovadas`
- `docs/site/05-ASSETS.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Galeria limitada, alt/proporção/ordem e lazy-load; autorização por foto registrada.
- [ ] Endereço/horários/contatos vêm dos campos aprovados; nenhum dado copiado de screenshot sem confirmação.
- [ ] Direções externas com URL validada; sem embed pesado obrigatório ou reserva inventada.
- [ ] Galeria estática é explicitamente limitada; se exigida edição por Maurício, abrir tarefa própria antes do aceite de autonomia.
- [ ] Estados ausentes respeitam pendências de Preview e não escondem falta de conteúdo no release.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
lint/typecheck/build; links de direções/contato, QA mobile/keyboard, rede limitada.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Publicar horários incorretos; prometer uploader de galeria inexistente.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Sete seções completas com origem do conteúdo rastreável.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
