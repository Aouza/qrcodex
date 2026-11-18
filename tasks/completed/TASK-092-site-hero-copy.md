# TASK-092 — Aplicar texto aprovado à hero

**Status:** DONE
**Dependencies:** TASK-091

## Objetivo e plano
Aplicar o texto enviado pelo usuário em 2026-11-18: identificação Relica’s Rock Bar, título “O ponto de encontro do rock na zona sul de São Paulo.” e descrição “Shows ao vivo, cerveja gelada, petiscos e uma galera que vive o rock de verdade.”. Manter texto em HTML, imagem, enquadramento e botões existentes; título creme conforme referência, sem o destaque vermelho da palavra antiga.

## Aceite
- [x] Texto completo aprovado exibido com h1 único e navegação preservada.
- [x] Desktop e celular sem overflow ou corte de texto.
- [x] Testes, lint/tipos e documentação verificados.

## Notas de conclusão
Texto aprovado aplicado em HTML; removido o estilo sem uso do antigo destaque vermelho. Dois testes do hero, ESLint dos componentes afetados e typecheck passaram. Browser Chromium em 2535/1440/768/360/320 px confirmou texto completo, ausência do aviso de prévia e ausência de overflow. Capturas em `output/site-hero-copy-review/`; revisão visual de 2535 e 320 px. Contrato visual/PRD/backlog/CURRENT sincronizados. Sem commit/push/deploy ou alteração de dados. TASK-068 continua READY.
