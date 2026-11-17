# TASK-089 — Agenda semanal e imagens públicas da home

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-072, TASK-084

## Objetivo e autorização
Usuário pediu até dois shows da semana na home, com os demais na Agenda completa. Semana de segunda 00h até segunda seguinte 00h, São Paulo; usar eventos reais publicados ainda relevantes, sem fabricar frequência/dias. A seleção não restringe artificialmente outros dias cadastrados; os shows habituais de sexta/sábado entram por suas datas.

Também confirmou explicitamente exibir normalmente todas as imagens em produção durante o desenvolvimento. Isso substitui o gate de imagens da TASK-084/ADR-022; não autoriza depoimentos fictícios ou afirmar que conceitos são fotografia documental. Esses depoimentos continuam restritos a desenvolvimento/Preview. A restrição anterior do código, não Storage ou carregamento, era a causa das imagens ausentes; flyers da Agenda não eram condicionados ao gate.

## Plano e aceite
- [x] Semana e limite de dois aplicados antes do limite SQL, preservando publicação, tenant, mídia e relevância. Agenda/Hub completos inalterados.
- [x] Testar bordas domingo/segunda no fuso de São Paulo, viradas de mês/ano, semana vazia e publicação/erro. Não preencher semana vazia com shows futuros.
- [x] Título/estado vazio explicitam a semana e mantêm Ver agenda completa.
- [x] Hero, microfone, comidas, A Casa, vinil e mapa são apresentados também em produção; depoimentos fictícios continuam ocultos e mapa segue identificado como ilustrativo.
- [x] Checks, build/start, revisão e documentação sincronizados, sem dados remotos/commit/push/deploy inferidos.

Arquivos: loader canônico com filtro opcional de intervalo, helper semanal server-side, adaptador da home e componentes de mídia; testes/fixtures e contratos. Sem novo schema, fonte paralela ou client bundle para consultas. Contrato de entrada temporal existente mantém offset -03:00 para São Paulo.

## Notas de conclusão
Concluída localmente em 2026-11-17. `week-range.ts` calcula a semana civil corrente em São Paulo; `loadHomeEvents` passa intervalo e limite dois ao loader canônico. `loadPublicAgenda` aceita opcionalmente `startsAtRange`, aplicando gte/lt antes do limite, sem alterar consultas dos consumidores que não o enviam. Publicação/tenant/relevância/mídia continuam centrais e inalteradas. Domingo local ainda pertence à semana anterior até 03h UTC de segunda, segundo o contrato -03:00 existente. Semana vazia não empresta shows posteriores; título passa a Shows da semana e CTA continua Agenda completa. Leitura é dinâmica por requisição, sem push de mudança de semana para aba já aberta.

Causa das imagens ausentes era a condição de revisão em server rendering, não erro do Storage. Após autorização explícita, imagens são renderizadas incondicionalmente em hero/Agenda/features/visit e a prop de revisão foi removida desses componentes. Depoimentos fictícios e aviso de revisão continuam usando `isSiteReview`; produção não apresenta esses depoimentos. Mapa preserva sua identificação ilustrativa; nada afirma procedência documental, endereço ou link de playlist.

Verificação RED/GREEN dos novos contratos e módulo semanal. `node --test tests/*.test.mjs`: 156 testes passaram, incluindo limites semanais, virada UTC/local/mês/ano, intervalo antes do limite, semana vazia sem antecipação, preservação de Agenda completa, mutações e imagens em produção sem liberar depoimentos. `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd run build` passaram. Revisão independente sem achados acionáveis.

`node tests/site-home-http-smoke.mjs` passou em production e preview: servidor compilado com transporte inteiramente isolado, dois de três eventos na home e todos na Agenda, semana seguinte excluída da home e mantida na completa, todos os assets em HTML de produção e gate dos depoimentos preservado, publicação/mídia/exclusão/tenant/erro. Nenhuma consulta ou escrita remota por este smoke.

Browser Chromium do build em modo production, com fixtures isoladas: 1440/320 px, todas as imagens carregadas/decodificadas, dois itens na home, nenhum depoimento fictício, sem overflow ou erro de hidratação. Clique em Ver agenda completa exibiu o terceiro item após aguardar renderização da rota. [Desktop](../../output/site-weekly-review/production-1440.png) e [celular](../../output/site-weekly-review/production-320.png). Harness/estado temporários removidos e servidor de QA encerrado. Capturas mostram dados identificados como fixtures, não dados reais do bar.

PRD, arquitetura, design, contratos de conteúdo/assets e ADR-023 sincronizados. `check-docs` e `git diff --check` passaram. Sem alteração de banco/env local, novo commit/push ou deploy; produção hospedada exige publicação posterior desta versão. Próximo incremento READY: TASK-068.
