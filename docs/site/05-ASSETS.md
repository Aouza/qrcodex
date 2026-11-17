# Assets — inventário e entrega

## Materiais encontrados
### Substituições selecionadas pelo usuário — TASK-085
Os arquivos abaixo substituem a montagem de cerveja/petiscos e o microfone do pacote inicial. Originais preservados, sem geração/edição de bitmap ou recompressão em disco. Servidos por next/image com otimização responsiva, lazy, sizes e alt vazio. Seleção para uso visual não comprova fotografia documental; permanece o gate de revisão local/Preview identificado da TASK-084.

| Asset | Dimensões / bytes | Uso |
|---|---|---|
| `public/images/comidas-cardapio-section.png` | 2172 × 724, 1.963.078 bytes, sem alpha | Cena única em Drinks & Petiscos; texto à direita no desktop, foto com foco à esquerda e texto abaixo no celular. TASK-086 limita arte a 1280 px, com imagem contida e faixa compacta, evitando zoom/corte em telas largas |
| `public/images/microfone-agenda.png` | 1086 × 1448, 672.588 bytes, alpha | Microfone transparente com enquadramento CSS e espaço próprio ao lado da introdução; sem desbotamento. TASK-086 fixa altura máxima de apresentação em 260 px desktop / 160 px mobile |

### Pacote visual vigente — TASK-084
Fonte aprovada para direção visual: `docs/site/reference/layout-aprovado.png`, com hero `hero-relicas.webp` e três ZIPs fornecidos pelo usuário. `02-agenda-e-cardapio.zip` e `03-casa-e-complementos.zip` foram extraídos com validação dos destinos para `public/assets/site-review/`; `04-referencias.zip` permanece preservado sem duplicar a imagem aprovada. São arquivos conceituais para revisão identificada local/Preview, não prova de foto documental. Produção não renderiza essa mídia. Nenhuma imagem foi gerada nesta tarefa.

| Asset em `public/assets/site-review/` | Uso | Bytes |
|---|---|---|
| `hero-relicas.webp` | Hero decorativa, preload/sizes, 1672 × 941 | 47030 |
| `agenda/microfone.webp` | Histórico; substituído na TASK-085 | 8010 |
| `agenda/show-vocalista.webp`, `show-guitarrista.webp`, `show-plateia.webp` | Referências preservadas; não substituem flyers cadastrados no app | 8058 / 6542 / 11216 |
| `cardapio/cerveja.webp`, `petiscos.webp` | Histórico; montagem substituída na TASK-085 | 18866 / 15172 |
| `casa/ambiente-conceitual.webp` | A Casa, decorativa; fonte 363 × 219 px. TASK-087 limita apresentação a 480 px, com cena inteira; versão maior é necessária para uso amplo nítido | 19196 |
| `spotify/vinil-decorativo.webp` | Vinil decorativo, sem link de playlist presumido | 4962 |
| `mapa/mapa-ilustrativo.webp` | Mapa explicitamente ilustrativo, sem direções fictícias | 6344 |
| `cta/plateia-vermelho.webp` | Preservado, não utilizado: seção CTA extra ausente do layout | 11318 |

`public/assets/textures/site-grain.svg` é ruído vetorial criado em código, decorativo e restrito ao wrapper do site. Texto permanece em HTML; imagens inferiores usam next/image/lazy e alt vazio por serem conceitos decorativos. Nenhum bitmap do layout inteiro é usado na página.

### Inventário histórico — apresentação anterior substituída
Os itens abaixo preservam origem/evidência das TASK-072/082/083; papel, hero antiga e mão de depoimentos não são usados na composição da TASK-084. Arquivos do usuário foram mantidos.

Decoração de depoimentos (TASK-083): `public/assets/textures/testimonials.svg`, canvas 1440 × 320, criada em código a partir da direção visual da referência: ruído, traços vermelhos e mão estilizada. Vetor decorativo, sem fotografia ou texto embutido; aplicado por CSS somente à faixa de revisão. Não copia o screenshot nem representa foto da casa.

Papel da Agenda: `public/images/agenda.png`, 2172 × 724 px, 2.308.291 bytes, com transparência; fornecido e selecionado pelo usuário em 2026-11-16. Original preservado. Derivado `public/images/agenda-paper.webp`, mesmas dimensões/alpha, 325.584 bytes, usado como decoração por `border-image` no CSS Module da seção. O fatiamento conserva bordas rasgadas enquanto o centro acompanha o conteúdo no celular. Não contém texto nem dados de eventos; não recebe alt ou foco. Substitui a necessidade de criar A03/A04 para este incremento.

Imagem atual da hero: `public/images/hero/hero.png`, 1774 × 887 px, 2.064.560 bytes. Fornecida e selecionada pelo usuário em 2026-11-16 para substituir o conceito gerado. Original preservado; usada por `next/image` com `fill`, `sizes` e preload, permitindo otimização responsiva pelo pipeline existente. Guitarrista à direita e área escura à esquerda para texto HTML. Alt vazio por ser fundo decorativo. Seleção para uso na hero não comprova fotografia documental da casa; procedência não informada. Sem seletor de ambiente ou aviso do conceito antigo.

`public/images/logo/logo-site.png` é o logo horizontal fornecido para a navbar institucional, com 1774 × 887 px.

`public/images/logo/relicas-logo.jpg`, `public/images/menu-editorial.webp` e ilustrações em `public/images/categories/`. O hero editorial é ilustrativo, não fotografia real. Mídia cadastrada em Storage depende de inventário autorizado posterior; esta atualização não a inspecionou. Conceitos mencionados no ZIP não são arquivos entregues neste checkout.

## Assets planejados (não criados)
Conceito anterior da TASK-082 (substituído e não referenciado pela página): `public/assets/hero/rock-concept.webp`, 1672 × 941 px, 67.164 bytes. Gerado pela ferramenta integrada em 2026-11-16 com guitarrista à direita, palco escuro/vermelho e espaço negativo à esquerda. Serviu apenas à revisão inicial local/Preview; o PNG original permanece no diretório de imagens geradas do Codex. O usuário depois forneceu o arquivo descrito acima. As capturas de revisão anteriores retratam esse conceito inicial e não comprovam a imagem atual.

| ID | Destino em `public/assets/` | Situação |
|---|---|---|
| A01/A02 | `hero/hero-desktop.webp`, `hero/hero-mobile.webp` | foto autorizada/recortes pendentes |
| A03/A04 | `textures/torn-paper-top.svg`, `textures/torn-paper-bottom.svg` | criar na tarefa visual; decorativo |
| A05/A06 | `menu/drinks.webp`, `menu/petiscos.webp` | fotos reais pendentes; segunda opcional |
| A07 | `venue/interior.webp` | foto real pendente |
| A08–A10 | `gallery/*.webp` | seleção/autorização pendentes |
| A11/A12 | `brand/logo-light.svg`, `brand/logo-dark.svg` | vetor oficial pendente; não simular como aprovado |
| A13 | `brand/favicon.svg` | fonte oficial e revisão em tamanho pequeno pendentes |

Não criar placeholder para publicar eventos sem flyer: contrato atual exige imagem real cadastrada. Novos diretórios só quando houver arquivos concretos. Não mover `public/images` sem necessidade/referências.

## Registro por arquivo
Fonte da hero: `public/assets/fonts/barlow-condensed-semibold.ttf` (109.428 bytes, 600 normal) e `barlow-condensed-extra-bold-italic.ttf` (113.004 bytes, 800 itálico). Arquivos oficiais de `google/fonts`, diretório `ofl/barlowcondensed`, com licença em `OFL-Barlow-Condensed.txt`. Servidos localmente por `@font-face` no CSS Module da hero, sem download dessa família no build ou no navegador. Nenhuma fonte adicional foi instalada para admin/menu/TV.

Registrar caminho, seção, origem/autor, autorização/crédito, status (conceito/aprovado), dimensões, peso, recorte/foco e alt. Fonte conceitual não vira foto documental sem aprovação. Endereço/horários/contato de screenshots são não verificados e não devem ser publicados automaticamente.

## Entrega e validação
WebP/AVIF para fotos, SVG para marca/vetor autorizado e papel. Reservar proporção, informar `sizes`, priorizar só LCP, lazy-load galeria e mídia inferior. Hero sem texto embutido; recorte mobile preserva assunto e texto HTML. Revisar 320/360/768/1440 px, contraste e rede limitada.

Assets geridos pelo proprietário ficam no Storage com contrato próprio aprovado; arquivos estáticos de marca/decoração permanecem locais. Galeria administrável depende de tarefa específica. Não ampliar remotePatterns para qualquer host.
