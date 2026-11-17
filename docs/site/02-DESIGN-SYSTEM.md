# Design institucional — layout aprovado

## Fonte e substituição
`reference/layout-aprovado.png` é a referência única desde 2026-11-17 (TASK-084 / ADR-022). Substitui papel da Agenda, hero anterior, galeria provisória e depoimentos com estrelas. Preservar assets e notas anteriores como histórico, sem reproduzir duas direções visuais concorrentes.

## Identidade
Fundo quase preto `#0b0b0a`, texto creme `#f0eae1`, secundário `#b8ad9f`, vermelho `#c52a2d`, bordas bronze `#514438`/`#b49d80`. Vermelho em títulos grandes/acentos; texto pequeno claro. Textura de grão discreta, sem animação. Fontes Barlow Condensed 600 normal/800 itálico já disponíveis localmente; corpo sans legível. Nenhum token global dourado de Menu/admin/TV é alterado.

A fundação vive em `src/app/page.module.css`, com variáveis restritas ao wrapper. `site-ui.module.css` compartilha títulos, pequenos marcadores /// e botões de borda fina. Header/hero/Agenda/features/depoimentos/visit/footer têm CSS Modules próprios. Container de até 1280 px, padding responsivo 20–72 px.

## Composição
- Header integrado à hero, logo à esquerda, seis destinos e reserva em contorno à direita; Início marcado por traço vermelho. Abaixo de 960 px, menu nativo details/summary com Escape, fechamento em navegação e foco visível.
- Hero: guitarrista à direita, título em três linhas “Mais que um bar, / uma casa do / rock.”, rock grande/vermelho. CTAs reserva vermelho e Agenda em contorno. No celular, imagem permanece reconhecível e camada escura protege o texto.
- Agenda escura: introdução/microfone à esquerda e título Shows da semana; até dois eventos da semana em linhas à direita, com coluna de data, título/descrição/horário, flyer cadastrado e contato opcional. Tipos de show/couvert não são inferidos. No celular introdução sobre lista; nomes longos quebram, botão acompanha o conteúdo.
- Drinks & Petiscos: cena panorâmica única fornecida na TASK-085, com cerveja/petiscos à esquerda e título/cópia/link em HTML à direita. Correção TASK-086: faixa compacta de cerca de 280 px no desktop, arte contida no mesmo limite central de 1280 px do texto; não ampliar a foto pela largura total de monitores grandes ou cortar o copo com cover. A altura pode crescer para acomodar texto ampliado. No celular, foto com foco à esquerda sobre o texto. A Casa mantém a composição anterior. Microfone PNG transparente fica limitado a 260 px de altura no desktop e 160 px no celular, sem desbotamento e sem crescer com a lista de shows.
- Depoimentos após A Casa: título à esquerda e três citações, aspas vermelhas e divisórias. Sem estrelas ou nota agregada. Revisão temporária identificada, ausente em produção.
- A Casa (TASK-087): imagem pequena do pacote é limitada a 480 px, preservando a proporção original 363:219 e a cena completa, sem cover/zoom. No celular acompanha o texto com 20 px de margem. Não esticar a foto para preencher toda a coluna: uso maior/nítido depende de novo asset em alta resolução.
- Playlist/localização: vinil decorativo, identidade musical, texto de localização e mapa leve; dados não confirmados permanecem explicitamente pendentes. Sem embeds/links fictícios.
- Footer compacto com marca, navegação e contatos efetivos. Não mostrar ícones com destinos inventados.

## Acessibilidade e desempenho
Texto em HTML, h1 único e h2 de seção, imagens decorativas com alt vazio. Skip link, alvos >=44 px, foco visível e ausência de motion decorativo. Sem carrossel, autoplay, mapa interativo obrigatório ou novas bibliotecas/fontes. Hero otimizada por next/image e preload; demais imagens lazy/sizes e espaço reservado. Funcionar desde 320 px, sem overflow ou corte de textos.

## Conteúdo e QA
Imagens selecionadas são exibidas também em produção por autorização da TASK-089/ADR-023; isso não confirma fotografia documental. Apenas depoimentos fictícios seguem limitados a revisão local/Preview. Testar 320/360/768/1440 px, zoom, nomes longos, estados vazio/erro, teclado/Escape e redução de movimento. Comparar com referência completa, além de verificar HTML/CSS. Registros e capturas pertencem à tarefa; não são prova de produção.
