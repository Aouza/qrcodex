# TASK-082 — Hero institucional conforme referência

**Epic:** Institutional Site
**Status:** BLOCKED
**Dependencies:** TASK-067, TASK-080 (header existente)

## Objetivo e desenho aprovado
Pedido direto do usuário em 2026-11-16: implementar a hero do screenshot fornecido. Antecipar somente a hero da TASK-071, sem concluir sua home/footer ou introduzir aliases. Texto HTML à esquerda, título condensado itálico branco/vermelho, fundo de guitarrista com luz vermelha à direita, CTA Agenda e Cardápio. Reutilizar o header existente. Sem indicadores fictícios de carrossel ou autoplay. Descrição sem fatos locais não confirmados.

## Plano de implementação
Execução inline com as skills writing-plans/executing-plans; revisão independente no fechamento. Composição em Server Component e CSS Module. Fontes locais ao componente via @font-face no CSS Module. Não refazer a app nem o header. A imagem conceitual de revisão inicial foi substituída pelo asset fornecido e selecionado pelo usuário em `public/images/hero/hero.png`; usar o arquivo sem seletor por ambiente, preservando o original. Não presumir fotografia documental do bar.

Arquivos: `src/components/site/site-hero.tsx`, `site-hero.module.css`, `src/app/page.tsx`, `page.module.css`, `public/images/hero/`, fontes em `public/assets/fonts/` e testes de render. Documentação: design/assets/site index, PRD e rastreamento de tarefas.

1. Testar render sem JS, título, links existentes e seleção segura de mídia; observar RED.
2. Implementar hero responsiva desde 320 px e integrar em `/`; observar GREEN.
3. Validar lint/typecheck/build, testes e navegador quando disponível; revisão independente.
4. Sincronizar documentação, evidências e próxima tarefa (TASK-068).

## Critérios de aceite
- [x] Hero reproduz a hierarquia/composição, com título HTML e dois destinos reais por slug.
- [x] Hero usa o asset fornecido e selecionado pelo usuário; conceito anterior não é mais referenciado.
- [x] Componente validado em fixture de navegador em 320/360/768/1440 px, foco, smoke de zoom e movimento reduzido, sem tema global. Aceite da rota completa depende do build abaixo.
- [ ] Testes, lint/typecheck/build e documentação verificados; limites registrados.

## Limites
Sem commit/push/deploy, migrations, edição de env ou dados remotos. Não concluir TASK-070/071/080. A nova prioridade visual foi solicitada explicitamente; TASK-068 permanece READY e será retomada depois deste incremento.

## Notas de conclusão
Atualização posterior em 2026-11-16: usuário forneceu e selecionou `public/images/hero/hero.png` (1774 × 887 px) para a hero. A página agora usa esse arquivo com `next/image`, sem seletor de ambiente nem aviso de conceito. `hero-media.ts` removido por não ter mais função. Teste de render atualizado: falhou primeiro pela presença do aviso antigo e passou após a substituição; testes de hero/navegação passaram (3/3). A seleção do usuário autoriza o uso deste asset na hero, sem presumir que documente uma apresentação real no bar. Evidências abaixo preservam a etapa anterior; capturas existentes mostram o conceito substituído. Bloqueio de build/rota real permanece, sem nova tentativa de build nesta troca de asset.

Implementada localmente em 2026-11-16 na branch `feat/site-home-hero`, sem commit/push/deploy. Server Component com título HTML, SVGs decorativos e links existentes para Agenda/Cardápio. CSS Module próprio, fonte Barlow Condensed oficial auto-hospedada com licença OFL, imagem WebP de 67.164 bytes e recorte mobile. Sem carrossel ou fatos locais não confirmados. Admin, Menu, TV e autorização não foram alterados.

RED: os três testes novos falharam pela ausência dos módulos. GREEN: três testes da hero e regressão da navegação passaram; suíte completa com 142 testes passou. Typecheck passou. Revisão independente inicial e final sem problemas acionáveis. Lint passou na primeira validação e na verificação final direcionada aos arquivos alterados; a repetição geral ficou presa e foi encerrada. Typecheck, verificador documental e diff passaram no fechamento.

Revisão visual em Chromium com fixture isolada dos componentes reais, preservando namespaces dos CSS Modules, fontes e imagem reais. Capturas revisadas: [1440 px](../../output/site-hero-review/hero-1440.png), [768 px](../../output/site-hero-review/hero-768.png), [360 px](../../output/site-hero-review/hero-360.png), [320 px](../../output/site-hero-review/hero-320.png). Sem overflow horizontal; botões >=44 px, foco visível, movimento reduzido e conteúdo/links sem JavaScript. Smoke de escala 2x não substitui aceite completo de zoom/reflow da rota real. Harness temporário removido; as capturas preservam a evidência visual.

Bloqueio: build completo não validado. Turbopack apresentou `UNKNOWN: unknown error, read` e `ENOENT ... mkdir '\\?'`; uma tentativa adicional ficou sem concluir. Diagnóstico alternativo com Webpack chegou a erros de seletores globais já existentes em `admin-products.module.css` e `auth-shell.module.css`; esses arquivos não foram alterados. Sem atribuir uma causa única não comprovada. A tentativa de revisar a rota real também ficou aguardando compilação; os screenshots são da fixture, não prova da rota completa em build/start. Supabase local continua pausado, sem troca para credenciais de produção.

Próximo passo: concluir build e smoke de `/` em ambiente funcional antes de DONE/publicação. TASK-068 segue READY para retomada; TASK-070/071/080 e aceites de Música não foram concluídos por este incremento. O asset atual foi selecionado pelo usuário; o seletor do conceito anterior foi removido, conforme a atualização acima.

Publicação do código solicitada pelo usuário em 2026-11-16: registrar commit e PR de revisão, preservando o status BLOCKED e a pendência do build. Não autoriza merge, deploy ou migrations. As capturas históricas retratam o conceito anterior, e não o PNG atual.
