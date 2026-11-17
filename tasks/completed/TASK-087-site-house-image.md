# TASK-087 — Corrigir enquadramento da imagem de A Casa

**Epic:** Institutional Site
**Status:** DONE
**Dependencies:** TASK-084

## Objetivo e diagnóstico
Corrigir foto ampliada/desfocada apontada pelo usuário na seção A Casa. O arquivo do pacote é de apenas 363 × 219 px; preenchia uma coluna de até 768 px com cover e corte da cena. A correção reduz a ampliação e preserva a proporção/cena completa. Não cria resolução inexistente; foto documental em maior resolução permanece necessária para uso amplo no release.

## Plano e aceite
- [x] Limitar imagem a 480 px, preservar aspecto 363:219 e mostrar cena inteira, com bordas suaves e faixa compacta.
- [x] Ajustar sizes e layout mobile sem espaços vazios excessivos, overflow ou perda de texto/CTA.
- [x] Preservar original, conteúdo, dados, links e gate de revisão; sem geração de imagem.
- [x] Verificar 2535/1920/1652/1440/768/360/320 no navegador; lint/tipos/regressões pertinentes e docs sincronizados.

Escopo: `home-features.tsx`/CSS; inventário/design e tarefas. Sem commit/push/deploy, backend ou mudança nas demais seções. Preservar alterações locais e skills do usuário. Reprodutor geométrico precede correção; não criar teste unitário que apenas espelhe CSS.

## Notas de conclusão
Concluída localmente em 2026-11-17. RED no navegador em 1652 px confirmou imagem com 768 × 293,58 px e cover. GREEN após limitar a 480 × 289,58 px, aspecto original e contain: toda a cena, inclusive mesas, permanece visível. Bordas suaves menos agressivas; mobile com margem de 20 px e altura proporcional, sem bloco mínimo de 220 px. Sizes deixa de anunciar 800 px para esse arquivo pequeno. Sem alterar bitmap, texto, CTA ou gate de revisão.

Browser Chromium no servidor local do usuário em 2535/1920/1652/1440/768/360/320 px: imagem carregada/decodificada, largura <=480 px, aspecto preservado, sem overflow ou erro de hidratação; CTA local válido. Capturas conferidas: [desktop](../../output/site-house-review/house-1652.png) e [celular](../../output/site-house-review/house-320.png). Harness temporário removido e servidor do usuário mantido.

`npm.cmd run typecheck`, ESLint direcionado e três testes de hero/navegação passaram. Revisão independente dos dois arquivos sem achados acionáveis. `node scripts/check-docs.mjs` e `git diff --check` passaram. Build completo não repetido por ser ajuste CSS/sizes; compilação dev, tipos e navegador verificados.

Limitação mantida explicitamente: fonte conceitual de 363 × 219 px não ganha nitidez real com CSS; para uso amplo é necessário fornecer uma versão maior/aprovada. Não foi criada fotografia fictícia. Inventário/design atualizados; sem commit/push/deploy ou dados remotos. Próximo incremento READY segue TASK-068.
