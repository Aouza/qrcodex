# Plataforma QRCodex

## Propósito e fronteira

Base compartilhada que sustenta Site, Hub, Cardápio, Agenda e Música: uma aplicação Next.js, Supabase Postgres/Auth/Storage, autorização por membership, RLS, deploy e recuperação. Relica's é o primeiro estabelecimento; isso não autoriza billing/onboarding SaaS nem seleção genérica de módulos.

## Fontes responsáveis

| Assunto | Contrato |
|---|---|
| Visão e limites comuns | [PRD](../PRD.md) |
| Renderização, clientes, rotas e domínios | [ARCHITECTURE](../ARCHITECTURE.md) |
| Schema, integridade, RLS e Storage | [DATABASE](../DATABASE.md) e `supabase/migrations/` |
| Convenções de UI e separação de temas | [DESIGN_SYSTEM](../DESIGN_SYSTEM.md) |
| Decisões e substituições | [DECISIONS](../DECISIONS.md) |
| Ambientes e registros de publicação | [DEPLOYMENT](../DEPLOYMENT.md) |
| Manutenção documental | [GOVERNANCE](../GOVERNANCE.md) |

## Contratos que atravessam produtos

- Dados de tenant usam `establishment_id`; autorização administrativa deriva da sessão e membership, com RLS como barreira final.
- Leitura pública de conteúdo usa cliente anônimo sem cookie administrativo. Admin verifica exatamente uma membership; não escolhe tenant arbitrariamente.
- Escrita editorial não usa service-role. Música tem exceção server-only estreita para RPCs validados, sem enviar credenciais ao browser.
- Rotas por slug, links compartilhados e QR existentes devem continuar funcionais. Allowlist institucional é requisito da TASK-067, não capacidade já entregue.
- Uma migration local não prova aplicação remota; backup de Música não cobre credenciais Auth ou arquivos Storage.

## Evidência e trabalho

Infraestrutura existente: `src/lib/supabase/`, `src/lib/auth/`, `src/proxy.ts`, migrations e `supabase/tests/`. Dependências instaladas são verificadas em `package.json`/lockfile; stack alvo não é licença para instalar ferramentas sem necessidade.

[Backlog](../../tasks/BACKLOG.md): Foundation, Authentication, Establishment & Release e Administration Architecture. [CURRENT](../../tasks/CURRENT.md) define a prioridade; [Admin](../admin/README.md) detalha a gestão comum. Domínio canônico/QR e recuperação completa permanecem gates das tarefas pertinentes.
