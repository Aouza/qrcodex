# Integração e auditoria conciliada

Evidência histórica da auditoria documental TASK-062, anterior à linha de base TASK-063 e à navegação TASK-080; a tabela de rotas incorpora esse incremento posterior. Não é inspeção atual da produção. Checks daquela auditoria: lint/typecheck/build e 97 testes passaram. A TASK-063 registrou a linha de base; novas evidências pertencem à tarefa que as executar. Testes SQL remotos, browser visual e recovery completo não foram executados pela auditoria.

## Evidência do repositório
| Item | Estado / decisão |
|---|---|
| `src/app/page.tsx` | abertura com navbar institucional. A composição definitiva segue na TASK-071 |
| `src/app/[slug]/` | Hub, menu, Agenda e Música existentes; preservar |
| `src/app/admin/(protected)/` | admin único com eventos/menu/settings/conta/Música |
| `src/proxy.ts` | matcher somente admin; proteção final em servidor/RLS |
| `get-admin-access.ts` | exatamente uma membership; zero/múltiplas falham controladamente |
| Menu | loader anônimo, busca local nome/descrição sem acento/caixa, centavos, ativos/featured/Esgotado |
| Dados | tenant em linhas, FK composta produto/categoria, RLS e Storage com escrita protegida |
| Eventos | CRUD, rascunho/publicação com flyer, datas e CTA; sem slug/cancelamento/preço próprios |
| Música | implementação existente com service RPC restrito; aceite manual independente |
| Stack | Next 16.3.5, React 19.2.8, TS strict, Tailwind 4, Zod; node:test existente, sem RHF/Vitest/Playwright instalados |

## Classificação
Preservar: schema/IDs/menu, RLS/Auth, rotas, Music e migrations. Reutilizar: loaders, componentes menu, shell/admin e upload. Adaptar: navegação/contexto, homepage, settings e SEO. Refatorar: problemas concretos de eventos e invalidação. Remover: starter/assets sem uso somente quando substituídos e referências verificadas; nunca migrations ou POCs por preferência.

## Riscos constatados e tarefas
- TASK-064: Hub limita primeiros 24 eventos antes de descartar antigos; cenário com 24 passados e um futuro foi reproduzido em memória. Agenda lê histórico completo.
- TASK-065: `2026-02-31T22:00` passa e normaliza para março; validação verifica parse/formato, não calendário.
- TASK-066: exclusão remove flyer antes da linha; falha na segunda operação pode deixar publicado quebrado. Requer teste de falha, não simples inversão de ordem.
- TASK-072: ações de eventos não invalidam futura home; Agenda opcional pode derrubar o Hub atual. Isolar na composição institucional.
- TASK-070: CSS global amplo/gold e assets ilustrativos; tema novo precisa de escopo.
- TASK-077/078: SEO público genérico, browser/E2E ainda insuficiente para nova experiência.

## Matriz de compatibilidade
| Atual | Migração inicial |
|---|---|
| `/` abertura e navbar | homepage completa nos hosts explicitamente aprovados |
| `/relicas` | Hub mantido |
| `/relicas/cardapio` | mantido; novo `/cardapio` reutiliza o mesmo catálogo |
| `/relicas/agenda` | mantido; novo `/agenda` reutiliza os mesmos eventos |
| `/[outro-slug]/...` | mantém tenant, identidade e comportamento |
| `/admin/...`, `/api/...` | preservados |
| `/relicas/musicas/...` | preservados; sem mudança de domínio implícita |

Primeiro aliases 200 e canonicals confirmados, sem redirects permanentes. Inventariar QR/links e colisões com slugs `agenda`/`cardapio`; se existirem, resolver compatibilidade antes de adicionar as rotas estáticas. Host identifica contexto público, não dá permissões. Não criar iframe/reverse proxy/segundo backend para integração interna.

## Divergências resolvidas
ZIP recomenda outro site/scaffold e flyer opcional; auditoria suporta aplicação única e flyer obrigatório. Conteúdo institucional que Maurício precisa editar não fica apenas em config. Slugs/status/preço de eventos permanecem propostas. Root-as-Hub vira homepage, preservando o Hub. QR novo usa root verificado; antigos continuam compatíveis. Música fora do escopo de expansão não significa remoção do módulo existente.
