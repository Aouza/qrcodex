# TASK-094 — Exibir destaques abaixo da hero

**Status:** DONE
**Dependencies:** TASK-092

## Objetivo e plano
Inserir a faixa da referência fornecida pelo usuário em 2026-11-18 entre hero e Agenda, sem modificar seções/dados existentes. Quatro itens: 4,5 no Google / 776 avaliações; Preço médio / R$ 40 – 100; Música ao vivo / Sextas e Sábados; Ambiente acolhedor / e LGBT+ friendly. Ícones SVG do sistema atual, fundo escuro e divisórias. Quatro colunas no desktop e duas no celular. Server Component sem JS adicional, novas fontes ou API. Compartilhar snapshot Google com depoimentos para evitar divergência. Preço e dias são conteúdo editorial fornecido, não catálogo, regra da Agenda ou atualização automática.

## Aceite
- [x] Faixa na posição correta, conteúdo completo, sem links ou dados inventados.
- [x] Sem overflow desde 320 px, texto ampliado e desktop largo; ícones decorativos e lista semântica.
- [x] Checks/browser pertinentes e documentação sincronizada.

## Notas de conclusão
HomeHighlights inserido entre hero e Suspense da Agenda; SVGs locais e snapshot Google único compartilhado com depoimentos. 157 testes, ESLint dos arquivos alterados, typecheck, build e smoke HTTP compilado passaram. Browser em 2535/1440/1024/768/360/320 px e texto a 200% em 1440/320 px: quatro itens, sem overflow; no celular a grade pode virar uma coluna com fonte ampliada para evitar palavras cortadas. Capturas em `output/site-highlights-review/`, referência preservada em `docs/site/reference/highlights-approved-2026-11-18.png`; revisão visual de desktop, celular e zoom. Docs de produto/design/conteúdo/assets e tarefas sincronizados. Sem commit/push/deploy ou mudança de banco. TASK-068 continua READY.
