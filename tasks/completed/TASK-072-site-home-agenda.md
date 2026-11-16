# TASK-072 — Integrar eventos reais à homepage

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-064, TASK-065, TASK-066, TASK-082; TASK-069/071 continuam para aliases/home completa
**Migration fronts:** 6, 7, 9

## Objetivo
Exibir até quatro eventos relevantes sem acoplar disponibilidade da home à Agenda.

## Antecipação solicitada e plano — 2026-11-16
O usuário solicitou esta seção agora e forneceu `public/images/agenda.png` e screenshot. Antecipar a composição da homepage sem criar `/agenda` (TASK-069) nem concluir TASK-071/082. Usar a raiz existente e o destino funcional `/relicas/agenda`. Texto HTML sobre papel decorativo, até quatro eventos em colunas no desktop e lista no celular; sem carrossel, ingressos, tributos ou datas inventadas.

Execução inline (writing-plans/executing-plans). Testar primeiro consulta pública limitada, publicação, tenant, tempo, atualização e falha; depois implementar opções internas de limite/sinal no loader existente e um adaptador tolerante a erro para Relica's. Compor Server Component e CSS Module abaixo da hero, com Suspense para não aguardar Agenda no conteúdo principal. Revalidar a home somente nas mutações de Relica's, preservando consumidores anteriores. Validar render/fuso/estados, lint/typecheck e browser isolado; build/start continua obrigatório para DONE. Nenhuma migration ou consulta/mutação remota de validação.

## Arquivos ou módulos impactados
- `src/lib/site/load-home-events.ts (novo)`
- `src/components/site/home-agenda.tsx (novo)`
- `src/app/page.tsx` (raiz existente)
- `ações de eventos e helper de invalidação público (novo)`
- `tests/site-home-events.test.mjs (novo)`

## Referências
- `docs/site/README.md`, `docs/site/06-IMPLEMENTATION-PLAN.md` e documentos temáticos da frente.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; banco/design quando aplicável.

## Passos e critérios de aceite
- [x] Mesma fonte/predicado temporal e publicação; teste com >4 eventos mantém os quatro primeiros relevantes, sem rascunhos, passado, tenant alheio ou mídia ausente.
- [x] Zero eventos mostra mensagem honesta; erro não remove Hero/menu ou quebra a página inteira.
- [x] Eventos/settings invalidam home de Relica's, preservando slug Agenda/Hub e admin. Alias /agenda não existe neste incremento e permanece na TASK-069.
- [x] Estados publish/unpublish/image/delete verificados em build/start com transporte isolado; novas requisições refletem os dados, abas abertas não têm push automático.
- [x] Leitura dinâmica explícita inicial; sem cache privado/persistente ou placeholders públicos.
- [x] Verificações pertinentes passam; docs/backlog/current sincronizados e notas de conclusão preenchidas.

## Verificação
node --test tests/site-home-events.test.mjs e regressões Agenda/Hub; checks/build; smoke de freshness isolado.
Comandos separados, sem cadeia de comandos que esconda falhas. Para bugs, reproduzir primeiro em teste e verificar falha antes da correção; depois testar o resultado e regressões afetadas.

## Dependências externas, riscos e limites
Invalidação por mutação não expira relógio; cache futuro exige TTL. Não prometer push ao browser.
Sem commit/push/deploy, migrations remotas ou dados de produção sob autorização documental. Preservar mudanças locais e pendências de Música.

## Entrega
Agenda homepage real, limitada e tolerante a falhas.

## Notas de conclusão
Concluída localmente em 2026-11-16, na branch `feat/site-home-agenda` sobre a hero já enviada (PR #6). Papel original fornecido em `public/images/agenda.png`; derivado WebP com transparência reduz de 2.308.291 para 325.584 bytes, sem alterar o original. Layout textual conforme a referência: título à esquerda, até quatro eventos reais e acesso à Agenda completa; lista vertical mobile, sem carrossel ou shows inventados.

Reutiliza `loadPublicAgenda`, com opções internas de limite e abort signal; o filtro público temporal/publicação/tenant é o mesmo, e mídia nula é excluída antes do limite. Adaptador de home fixa Relica's, limita quatro e usa prazo compartilhado de 2 segundos, convertendo vazio/falha em estado da seção. Server Component sob Suspense na raiz `force-dynamic`. Datas visuais e acessíveis em São Paulo. Link funcional `/relicas/agenda`, sem criar novo alias.

Mutações existentes de eventos e settings invalidam `/` somente para Relica's; consumidores anteriores permanecem. Não houve mudança de schema/RLS/Storage, credenciais ou produção. Fonte e CSS são restritos à apresentação institucional.

Verificação: RED por módulos ausentes; GREEN com cenários de seleção, atualização e erro. 148 testes totais passaram; lint direcionado, typecheck e build Turbopack final passaram. Smoke `node tests/site-home-http-smoke.mjs` usa o servidor compilado e intercepta todo fetch externo: home/Agenda legada, publicar/despublicar, remover imagem, excluir, outro tenant e falha independente passaram. Não executa SQL/admin remoto, não valida produção e não promete atualização de aba aberta. Revisão independente sem achados acionáveis.

Browser isolado com componentes/CSS reais, fonte, hero atual e papel otimizado: 320/360/768/1440 px, nomes longos sem espaços, foco e CTA >=44 px, sem overflow; vazio/erro preservam navegação. Capturas de QA com dados fictícios identificados, exclusivos da fixture: [desktop](../../output/site-agenda-review/agenda-1440.png) e [mobile](../../output/site-agenda-review/agenda-320.png). Harness temporário removido; os testes persistentes de transporte/render e smoke permanecem. Essas capturas não são dados do bar nem prova do layout de produção.

Próximo incremento READY: TASK-068. TASK-069/071 continuam planejadas; não concluir a home inteira por esta faixa. O build/start atual também resolve a pendência técnica anterior da hero, registrada na TASK-082. Sem commit/push/deploy neste pedido.
