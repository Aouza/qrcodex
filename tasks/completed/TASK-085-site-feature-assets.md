# TASK-085 — Substituir imagens do Cardápio e da Agenda

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-084

## Objetivo e plano
Pedido explícito do usuário: usar `public/images/comidas-cardapio-section.png` e `public/images/microfone-agenda.png` no lugar das imagens anteriores. Preservar o layout aprovado, dados/CTAs e gate de revisão local/Preview. Imagem panorâmica única substitui a montagem cerveja/petiscos; microfone transparente substitui o pequeno bitmap anterior sem máscara de desbotamento. Texto continua HTML; enquadramento próprio no celular.

1. Inspecionar dimensões/transparência e composição das imagens fornecidas.
2. Alterar `home-features.tsx`/CSS e `home-agenda.tsx`/CSS, sem editar os PNGs originais ou gerar imagens.
3. Verificar carregamento, legibilidade e enquadramento em 320/360/768/1440, lint/tipos e regressões pertinentes.
4. Atualizar inventário/design, notas, BACKLOG e CURRENT; concluir somente após checks.

## Critérios de aceite
- [x] Cardápio usa uma cena panorâmica, com texto à direita no desktop e abaixo no celular.
- [x] Microfone mantém transparência, detalhes e proporção, sem cobrir texto.
- [x] Imagens locais via next/image com sizes/lazy e alt decorativo; originais preservados.
- [x] CSS local, gate de conceitos e links/dados existentes preservados; sem overflow desde 320 px.
- [x] Checks, revisão visual e documentação sincronizados.

## Limites
Uma substituição visual delimitada, sem escopo de backend ou mudança de produto. Autorização de seleção não comprova foto documental de itens reais. Sem commit/push/deploy. Branch existente `feat/site-home-agenda`; preservar `.claude/` e demais mudanças locais. Não é necessário criar nova direção visual ou novos testes que espelhem paths de imagens: verificar CSS/layout no navegador e regressões existentes.

## Notas de conclusão
Concluída localmente em 2026-11-17. Imagem panorâmica única substitui a montagem de dois bitmaps na faixa Drinks & Petiscos; no desktop o texto ocupa a área escura à direita, no celular aparece abaixo da foto, com foco no copo/comidas. Microfone PNG com alpha substitui o arquivo pequeno; enquadramento CSS preserva o objeto transparente sem desbotamento, com espaçamento próprio para não encobrir a introdução.

Originais do usuário preservados: comidas 2172 × 724 / 1.963.078 bytes e microfone 1086 × 1448 / 672.588 bytes. Sem edição/geração de imagem, sem dependências ou mudança de dados/rotas/CTAs. Next/image mantém otimização responsiva, lazy e alt decorativo. Gate de revisão permanece; seleção visual não autoriza publicação factual. Inventário e design temático atualizados.

Verificação: `npm.cmd run typecheck`, ESLint direcionado aos dois TSX e cinco testes de Agenda/depoimentos/navegação passaram. Browser Chromium no servidor local informado pelo usuário, em 1440/768/360/320 px: novas imagens carregadas/decodificadas, sem overflow ou erro de hidratação. Revisão visual conferiu texto e proporções; [Cardápio desktop](../../output/site-asset-review/menu-1440.png), [Cardápio mobile](../../output/site-asset-review/menu-320.png), [Agenda desktop](../../output/site-asset-review/agenda-1440.png), [Agenda mobile](../../output/site-asset-review/agenda-320.png). A Agenda local respondeu com seu estado de erro de dados durante a captura; nenhuma consulta/alteração de produção foi executada para validar esse estado e esta tarefa não modifica o loader. Não é aceite remoto de eventos. Harness temporário removido e servidor do usuário preservado.

Revisão independente dos quatro arquivos sem achados acionáveis; revisor repetiu os cinco testes com sucesso. `node scripts/check-docs.mjs` e `git diff --check` passaram. Build completo não foi repetido para esta troca de imagens/CSS; compilação dev e checagem de tipos foram verificadas. Sem commit/push/deploy. Próximo incremento READY: TASK-068.
