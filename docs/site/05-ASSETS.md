# Assets — inventário e entrega

## Materiais encontrados
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
