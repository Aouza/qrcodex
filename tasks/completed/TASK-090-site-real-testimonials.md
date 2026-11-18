# TASK-090 — Exibir depoimentos reais sem datas

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-089

## Objetivo e fonte
Usuário confirmou depoimentos reais e forneceu screenshot legível em 2026-11-17, autorizando substituir os exemplos e omitir mês/ano. Fonte fornecida: `Captura de tela 2026-11-17 182100.png`. Autores: Gilson Amorim, Karol Paixão, Jéssica Castro. Avaliação informada pelo screenshot: 4,5 no Google / 776 avaliações; snapshot manual, não consulta em tempo real ou API.

## Plano e aceite
- [x] Transcrever fielmente os três textos/nomes fornecidos, sem datas, estimativas de idade ou autores de exemplo.
- [x] Exibir em todos os ambientes, título Quem vem, faz parte e nota/quantidade fornecidas, mantendo texto HTML acessível e layout responsivo.
- [x] Não inventar URL de avaliações: botão somente com endereço real fornecido/confirmado; pergunta opcional ao usuário feita sem bloquear o conteúdo.
- [x] Testar produção/Preview/desenvolvimento, ausência de datas/fake data, mobile/desktop; sincronizar docs e tarefas.

Escopo: componente/CSS de depoimentos, testes e contrato editorial. Sem import automático do Google, dados estruturados de review, backend novo ou transformar conteúdo de avaliação em promoção vigente da casa. Sem commit/push/deploy inferidos. Mídia/Agenda e mudanças locais anteriores preservadas.

## Notas de conclusão
Concluída em 2026-11-18 após retomada autorizada pelo usuário. Os textos/nomes de Gilson Amorim, Karol Paixão e Jéssica Castro foram transcritos fielmente do [screenshot aprovado](../../docs/site/reference/testimonials-approved-2026-11-17.png). Nenhum mês/ano, idade da avaliação, autor de exemplo ou aviso de depoimento fictício permanece na seção. O bloco renderiza em todos os ambientes, após A Casa, com título Quem vem, faz parte e resumo Google 4,5 / 776 avaliações informado pelo usuário. Não representa consulta ao Google em tempo real; não há APIs, review structured data ou promoção vigente inferida da citação de um avaliador.

Componente continua Server Component estático, em HTML semântico (section/h2/figure/blockquote/figcaption), com CSS Module local. Quatro colunas no desktop; título/nota acima das três citações no tablet; lista vertical no celular. Ícone G decorativo em CSS, sem nova imagem/font/biblioteca ou chamada externa. Campo opcional de link só produz CTA quando há destino confirmado; não foi inventada URL. Usuário autorizou seguir sem o endereço e a seção permanece utilizável sem o botão. O link é follow-up editorial, não bloqueio dos depoimentos.

RED/GREEN dos novos testes: transcrição, autores, produção/Preview/desenvolvimento, ausência de datas/exemplos e comportamento do CTA opcional. `node --test tests/*.test.mjs`: 157 testes passaram. `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd run build` passaram. Smoke `node tests/site-home-http-smoke.mjs` em production e preview passou com o servidor compilado, verificando os três nomes/ordem/ausência das datas e mantendo as regressões de Agenda, sem dados remotos. Execuções do smoke foram serializadas porque usam a mesma porta.

Browser Chromium no servidor local em 1440/1024/768/360/320 px: transcrição integral e autores presentes, sem datas, overflow ou erro de hidratação. Capturas conferidas: [desktop](../../output/site-real-testimonials-review/testimonials-1440.png), [celular](../../output/site-real-testimonials-review/testimonials-320.png). Harness temporário removido; servidor do usuário preservado. Revisão independente sem achados acionáveis; dois testes direcionados repetidos pelo revisor passaram.

PRD, arquitetura, design, contrato editorial e inventário sincronizados; `check-docs` e `git diff --check` passaram. Durante a execução, o código foi observado já registrado no HEAD `8ec7ebb`; o agente não fez novo commit/push/deploy. Não foram alterados banco/credenciais/Agenda/admin/Música. Link real do Google continua pendente de fornecimento. Próximo incremento READY: TASK-068.
