# TASK-091 — Usar nova imagem do palco na hero

**Status:** DONE
**Dependencies:** TASK-090

## Objetivo e plano
Substituir a imagem da hero por `public/images/hero/hero-relicas.png`, fornecida e selecionada pelo usuário em 2026-11-18. Manter título HTML, botões, dimensões, contraste e otimização next/image. Preservar arquivos anteriores e os demais domínios. Troca pontual, sem nova direção de layout, banco ou publicação.

## Critérios de aceite
- [x] Home usa a nova imagem em todos os ambientes, com preload/sizes e alt decorativo.
- [x] Desktop e celular preservam texto legível, imagem reconhecível e navegação.
- [x] Testes pertinentes, lint/tipos e check-docs passam; documentação sincronizada.

## Notas de conclusão
Home referencia a nova imagem, mantendo texto e botões. Após feedback do usuário, hero passa a 520–760 px no desktop, com contain, cena centralizada e bordas dissolvidas por máscara a partir de 640 px para mostrar a cena inteira sem ampliar/cortar; no celular mantém recorte e camada escura. Remove também a faixa de prévia, seus estilos e helper sem uso, a pedido do usuário. Original preservado e inventário/design sincronizados. 157 testes, lint, typecheck e build passaram. Browser Chromium em 2535/1920/1440/768/360/320 px: imagem carregada e decodificada, sem overflow; capturas em `output/site-hero-stage-review/` e `output/site-hero-fit-review/` (primeiro encaixe, substituído) e `output/site-hero-blend-review/` (composição final). Smoke HTTP do build/start passou, sem dados reais. Revisão visual do desktop e 320 px confirmou legibilidade e palco reconhecível. Sem commit/push/deploy ou mudança de banco. TASK-068 continua READY.
