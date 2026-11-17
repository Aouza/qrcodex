# TASK-083 — Depoimentos abaixo da Agenda

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-072

## Objetivo e desenho
Pedido do usuário em 2026-11-16: reproduzir a faixa de depoimentos da referência abaixo da Agenda. Textos e nomes da imagem autorizados somente como exemplos durante o desenvolvimento; serão substituídos. Faixa escura, aspas e estrelas vermelhas, três colunas com divisórias e lista vertical no celular. HTML legível e decoração vetorial/CSS, sem rasterizar os textos.

Abordagem: Server Component e CSS Module locais, reutilizando a fonte existente. Carrossel e backend editorial não são necessários para esta revisão estática. Aviso visível de conteúdo ilustrativo. Exemplos disponíveis em desenvolvimento ou Vercel Preview; produção oculta a seção até conteúdo aprovado em tarefa futura. Não representa avaliação verificada, média agregada ou integração com plataforma de avaliações.

## Plano de execução
- [x] Verificar a restrição dos exemplos por ambiente em teste de renderização.
- [x] Criar `src/components/site/home-testimonials.tsx` e CSS Module; inserir imediatamente após Suspense da Agenda em `src/app/page.tsx`.
- [x] Verificar lint, tipos, build, regressões de home e layout 320/360/768/1440 px.
- [x] Sincronizar contratos, backlog e CURRENT; registrar evidência e mover tarefa ao concluir.

## Critérios de aceite
- [x] Três textos/nomes da referência, com estrelas e aspas decorativas; título acessível.
- [x] Inserção abaixo da Agenda, sem alterar suas consultas/estados e destinos existentes.
- [x] Desktop em três colunas; mobile sem corte/rolagem horizontal.
- [x] Exemplos identificados e ausentes em produção; sem schema, API, dependência ou structured data de avaliações.
- [x] Checks pertinentes passam e documentação sincronizada.

## Limites e fontes
AGENTS.md; docs/PRD.md; docs/ARCHITECTURE.md; docs/DESIGN_SYSTEM.md; docs/DECISIONS.md; docs/site/00-PRODUCT-SPEC.md, 01-ARCHITECTURE.md, 02-DESIGN-SYSTEM.md e 05-ASSETS.md. Sem commit/push/deploy ou alterações remotas. Trabalho na branch de homepage existente, preservando `.claude/` não rastreado. Plano e desenho reunidos nesta tarefa segundo a governança do repositório; execução inline, sem commits automáticos.

## Notas de conclusão
Implementação local em 2026-11-16. Três depoimentos da referência com aviso “Depoimentos ilustrativos — conteúdo em revisão.”; texto HTML, figuras/blockquote/figcaption, título acessível, estrelas com nome acessível e aspas grandes decorativas. Fonte Barlow Condensed já existente e CSS Module local; fundo SVG próprio com ruído/traços/mão, sem uso do screenshot como bitmap. Três colunas no desktop, lista vertical abaixo de 768 px; decoração reduzida ao rodapé no celular.

Disponível somente em `NODE_ENV=development` ou `VERCEL_ENV=preview`. Nos demais ambientes, Server Component retorna null. Conteúdo real/aprovado e gestão futura não fazem parte desta tarefa; substituir exemplos antes de habilitar produção. Sem schema/RLS/Storage, serviço, dependência, formulário público, nota agregada ou structured data de avaliações. Root apenas compõe o componente após a Agenda; contratos legados preservados.

Verificação: teste inicial RED por componente inexistente; GREEN com matriz de ambientes. `node --test tests/*.test.mjs`: 149/149 passaram. `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd run build` passaram; lint final sem avisos após remover o harness temporário. `node tests/site-home-http-smoke.mjs` passou com VERCEL_ENV=production (sem exemplos) e preview (com aviso/nomes/ordem), com home/Agenda compiladas e transporte inteiramente interceptado, sem dados remotos.

Browser Chromium headless com componentes e CSS reais da Agenda/depoimentos, fonte e assets locais: 320/360/768/1440 px sem overflow e com textos integrais. Capturas: [desktop](../../output/site-testimonials-review/testimonials-1440.png), [mobile](../../output/site-testimonials-review/testimonials-320.png). Revisão isolada usa estado vazio da Agenda; não comprova conteúdo remoto ou release. Harness temporário removido. Não houve commit/push/deploy. Próximo incremento READY segue TASK-068.

Revisão independente concluída sem achados acionáveis; teste de renderização repetido pelo revisor passou. Documentação sincronizada, check-docs passou; exemplos aprovados apenas como conteúdo temporário de desenvolvimento, sem aceite de publicação real.
