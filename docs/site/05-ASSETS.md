# Assets — inventário e entrega

## Materiais encontrados
`public/images/logo/logo-site.png` é o logo horizontal fornecido para a navbar institucional, com 1774 × 887 px.

`public/images/logo/relicas-logo.jpg`, `public/images/menu-editorial.webp` e ilustrações em `public/images/categories/`. O hero editorial é ilustrativo, não fotografia real. Mídia cadastrada em Storage depende de inventário autorizado posterior; esta atualização não a inspecionou. Conceitos mencionados no ZIP não são arquivos entregues neste checkout.

## Assets planejados (não criados)
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
Registrar caminho, seção, origem/autor, autorização/crédito, status (conceito/aprovado), dimensões, peso, recorte/foco e alt. Fonte conceitual não vira foto documental sem aprovação. Endereço/horários/contato de screenshots são não verificados e não devem ser publicados automaticamente.

## Entrega e validação
WebP/AVIF para fotos, SVG para marca/vetor autorizado e papel. Reservar proporção, informar `sizes`, priorizar só LCP, lazy-load galeria e mídia inferior. Hero sem texto embutido; recorte mobile preserva assunto e texto HTML. Revisar 320/360/768/1440 px, contraste e rede limitada.

Assets geridos pelo proprietário ficam no Storage com contrato próprio aprovado; arquivos estáticos de marca/decoração permanecem locais. Galeria administrável depende de tarefa específica. Não ampliar remotePatterns para qualquer host.
