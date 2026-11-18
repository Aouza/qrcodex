# TASK-093 — Aplicar nova referência de A Casa

**Status:** DONE
**Dependencies:** TASK-092

## Objetivo e plano
Atualizar apenas A Casa conforme screenshot fornecido em 2026-11-18: título “Mais que um bar, um refúgio do rock.”, parágrafo aprovado e imagem `public/images/a-casa.png` com bordas rasgadas já presentes no arquivo. Texto HTML à esquerda e foto inteira à direita, container de 1280 px, sem ampliar pela tela toda. No celular/tablet, texto acima da foto. Remover o CTA antigo ausente da nova referência. Preservar hero, Agenda, dados e destinos existentes.

## Aceite
- [x] Texto aprovado e nova imagem em todos os ambientes; h2/id e navegação A Casa preservados.
- [x] Foto proporcional, sem cortes, layout compacto e legível desde 320 px até monitores largos.
- [x] Checks e browser pertinentes passam; docs/backlog/CURRENT sincronizados.

## Notas de conclusão
Texto e imagem fornecidos aplicados somente em A Casa; retirado o CTA ausente da referência, mantendo id/h2 e links da navbar. Foto 2172 × 724 proporcional e completa, até 768 px no desktop. 157 testes, lint, typecheck, build e smoke HTTP compilado passaram; primeira tentativa de build encerrou sem diagnóstico, repetição fora do ambiente restrito passou. Browser em 2535/1440/1024/768/360/320 px e texto a 200% em 1440/320 px: imagem decodificada, contain e sem overflow. Capturas em `output/site-house-approved-review/`; revisão visual de 1440/320 px. Screenshot original preservado em `docs/site/reference/house-approved-2026-11-18.png`. Docs de produto/design/assets e backlog/CURRENT sincronizados. Sem commit/push/deploy ou alteração de banco. Próximo incremento: TASK-068 READY.
