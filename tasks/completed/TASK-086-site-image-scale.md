# TASK-086 — Corrigir escala das imagens em telas largas

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-085

## Objetivo e diagnóstico
Usuário mostrou em 2535 px que a foto ficou ampliada/cortada, divergindo da referência compacta. Reprodução no navegador: faixa com 481 px de altura e imagem ocupando 2535 px; `object-fit:cover` ampliava a foto para o viewport, enquanto texto/container ficavam limitados a 1280 px. QA anterior até 1440 px não cobria esse caso.

## Plano e aceite
- [x] Limitar arte à mesma largura central de 1280 px, com faixa de cerca de 280 px no desktop e imagem contida sem ampliar/cortar o copo.
- [x] Manter texto HTML à direita e composição mobile empilhada; limitar também altura do microfone, independente da lista de shows.
- [x] Preservar fotos originais, contexto/links/dados e gate de revisão; ajustar sizes à largura efetiva.
- [x] Verificar no navegador 2535/1920/1440/768/360/320 e ampliar texto, sem overflow ou sobreposição.
- [x] Checks pertinentes, documentação e fechamento sincronizados.

Arquivos: `home-features.module.css`, `home-agenda.module.css` e sizes em `home-features.tsx`; design/asset docs e tarefas. Mudança CSS delimitada, sem reconstrução ou conteúdo novo. Sem commit/push/deploy. Preservar alterações locais anteriores e skills adicionadas pelo usuário.

## Notas de conclusão
Concluída localmente em 2026-11-17. Reprodutor geométrico RED confirmou a falha em 2535 px antes da correção: faixa 481 px, foto com largura de 2535 px. GREEN após limitar arte ao container de 1280 px e usar imagem contida, com faixa de 281 px (incluindo borda) no desktop. Foto não cresce com o monitor e copo permanece inteiro; bordas suaves integram a cena ao fundo. Microfone tem altura de 260 px desktop/160 px mobile, sem acompanhar altura da lista. Sizes do Next Image acompanha a largura limitada. Nenhum bitmap foi alterado ou gerado.

Browser Chromium no servidor local do usuário, em 2535/1920/1440/768/360/320 px, com imagens carregadas e sem erros de hidratação/overflow. Faixa desktop medida: 281 px nos três monitores largos e aproximadamente 313 px em 768 px para acomodar texto; mobile mantém foto/texto empilhados. Texto ampliado a 200% em 1440 px permaneceu legível e sem overflow. Capturas: [monitor largo](../../output/site-scale-review/menu-2535.png), [desktop](../../output/site-scale-review/menu-1440.png), [celular](../../output/site-scale-review/menu-320.png). A Agenda local respondeu com seu fallback de dados; nenhum loader/dado foi alterado ou validado remotamente. Harness temporário removido e servidor do usuário preservado.

Typecheck e ESLint direcionado passaram; cinco testes de Agenda, depoimentos e navegação passaram. Revisão independente sem achados acionáveis. `node scripts/check-docs.mjs` e `git diff --check` passaram. Build completo não repetido por ser correção CSS/sizes de baixo impacto; compilação dev, navegador e tipos verificados. Design e inventário registram a regra e a largura adicional de QA, preservando evidência histórica da TASK-085. Sem commit/push/deploy; próximo incremento READY continua TASK-068.
