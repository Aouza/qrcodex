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
- TASK-064 (corrigido localmente): regressão do Hub com 24 passados e um futuro reproduzida no loader antes da correção. Hub/Agenda agora filtram relevância na consulta; o limite de 24 do Hub ocorre depois. Regra compartilhada inclui eventos em andamento, igualdade no fim/início e ausência de término. Não é evidência de deploy.
- TASK-065 (corrigido localmente): regressões reproduziram 31/02 aceito em início e fim. Validação agora confere calendário/horário antes da conversão, incluindo bissextos e limites de mês/hora; preserva `-03:00`, fim opcional e madrugada seguinte. Não altera dados persistidos nem comprova deploy.
- TASK-066 (corrigido localmente): testes reproduziram DELETE após remoção de flyer e rollback falho apagando mídia nova vinculada. A remoção agora confirma rascunho sem referência antes do Storage/DELETE, e compensação nunca republica. Substituição preserva mídia nova quando limpeza antiga falha. Ausência de linha, sessão/ID cruzado, propriedade de caminho e falhas parciais têm regressão. Órfãos ainda exigem revisão operacional autorizada; sem mudança de RLS ou deploy implícito.
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

## Contexto de acesso e gate de rotas — TASK-067

- Contrato local: allowlist server-only `SITE_ALLOWED_HOSTS`, nomes/autoridades explícitos por ambiente, sem valores reais adicionados a env nesta tarefa. Porta só para loopback e com correspondência exata. Lista vazia ou inválida falha fechada; não há wildcard Vercel, domínio presumido ou canonical inferido.
- Origem selecionada: `Host` da requisição do servidor. A [documentação oficial Vercel](https://vercel.com/docs/headers/request-headers#host), consultada em 2026-11-16, descreve esse campo como o domínio visitado. O adaptador ignora forwarded headers; proxies adicionais exigem revisão própria. Isto seleciona apresentação pública, não dá acesso administrativo ou protege Preview.
- Escopo entregue: helpers testados de contexto e caminhos. Nenhuma rota estática nova, redirect ou mudança do atual header foi introduzido; Menu/Agenda/admin/Música mantêm os contratos existentes.

| Gate antes de TASK-068/069 introduzirem rotas estáticas | Estado nesta entrega | Ação necessária |
|---|---|---|
| Slugs `cardapio` e `agenda`, incluindo estabelecimentos inativos | Não inspecionado remotamente | Inventário confiável de todos os tenants; leitura anônima só de ativos não basta |
| Links/QR impressos ou compartilhados que usam esses slugs | Não confirmado | Registrar destinos existentes e solução de compatibilidade se houver colisão |
| Hosts de desenvolvimento, Preview e Production | Variável declarada, configuração real intacta | Aprovar entradas exatas por ambiente; Preview continua com proteção própria |
| Host canônico e domínio definitivo | Não confirmado | Verificar propriedade/DNS/HTTPS antes de SEO final/cutover/QR |

Não tratar o gate como concluído porque o checkout contém apenas o seed Relica's. Uma colisão exige solução registrada antes da rota estática; não aplicar redirect global nem selecionar tenant por host arbitrário. A tarefa de integração pode preparar testes e apresentação local, mas não deve ignorar esse inventário.
