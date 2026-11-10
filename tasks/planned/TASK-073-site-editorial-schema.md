# TASK-073 — Definir e migrar conteúdo institucional tipado

**Epic:** Institutional Site
**Status:** PLANNED
**Dependencies:** TASK-067
**Migration fronts:** 5

## Objetivo
Preparar armazenamento e regras dos campos institucionais aprovados.

## Arquivos ou módulos impactados
- `supabase/migrations/ nova migration aditiva`
- `supabase/tests/ teste institucional novo`
- `src/lib/validation/site-content.ts (novo)`
- `docs/DATABASE.md`
- `docs/site/03-CONTENT-AND-ADMIN.md`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [ ] Definir nomes/tipos/limites/nulls/defaults antes da migration: headline/apresentação/casa/endereço/horários, sem duplicar identidade/contatos atuais.
- [ ] Separar público/privado, ownership 1:1 ou campos existentes por decisão documentada, sem tabela CMS genérica.
- [ ] Testes SQL: tenant A/B, anônimo só público de ativo, escrita member, sem membership e cruzada negadas.
- [ ] Dados existentes continuam válidos; sem eventos fictícios, seed de produção ou migrations remotas.
- [ ] Galeria/cancelamento/couvert/detalhe não entram por inferência; decisão pendente altera escopo antes de adicionar.
- [ ] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
Teste SQL em banco isolado + validação unitária dos campos + lint/typecheck; revisar migration e rollback compatível.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Schema sugerido não existe hoje; homologar campos reais e fonte de horários. Produção requer autorização separada.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Migration aditiva/testes locais e contrato documentado.

## Notas de conclusão
Pendente. Registrar mudança, evidências, critérios atendidos, limitações e próximo passo. Não marcar DONE apenas por escrever código.
