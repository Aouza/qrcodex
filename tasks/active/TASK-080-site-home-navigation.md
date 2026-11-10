# TASK-080 — Navegação institucional da home

**Epic:** Institutional Site
**Status:** BLOCKED
**Dependencies:** TASK-063

## Objetivo
Entregar a navbar da home a partir de `docs/site/refs/ce9e2a06-3f9a-401e-9a85-538aa4d958d7.png` e dos dois design systems. Antecipar a navegação da TASK-071 como incremento independente.

## Aceite
- [x] Navbar preta, logo local e Início sublinhado em vermelho. Ordem solicitada de Início, Agenda, Cardápio, A Casa, Galeria e Contato.
- [x] CTA vermelho de reserva com ícone do WhatsApp. Abre o número cadastrado ou a seção Contato quando indisponível.
- [x] Agenda e Cardápio apontam para os destinos públicos atuais.
- [x] Menu mobile implementado com disclosure nativo, tratamento de Escape e alvos de toque de 44 px.
- [x] Header disponível na raiz, CSS local, foco visível e controles sem animação.
- [x] Testes da ordem dos seis itens e das alternativas de destino do CTA.
- [ ] Conferir larguras e foco após Escape no navegador. A sessão retornou navegador indisponível.

## Arquivos
`src/app/page.tsx`, `src/app/page.module.css`, `src/components/site/site-header.tsx`, CSS Module da navbar e `tests/site-navigation.test.mjs`.

## Decisão de escopo
Usar o PNG fornecido para a marca institucional. A Casa, Galeria e Contato apontam para seções da home. Galeria exibe o estado vazio até receber fotos aprovadas. Hero editorial, Footer e grupo de rotas definitivos seguem na TASK-071.

## Evidências
Teste de renderização verificou os destinos e o disclosure no HTML. Lint, typecheck, 98 testes e build passaram. A revisão visual em 320/360/768/1440 px e o fluxo de teclado real aguardam navegador.

Revisão da navbar com seis links e CTA de reserva: lint, 100 testes e build com TypeScript passaram. A home compilada respondeu em teste HTTP local com WhatsApp simulado e sem contato, incluindo as três âncoras e o destino alternativo do CTA.

O sublinhado de hover passou a se aplicar apenas aos links inativos. Início usa um único indicador quando recebe o cursor.
