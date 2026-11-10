# Design institucional — Rock Editorial Minimal

Complementa `../DESIGN_SYSTEM.md`, seção 51. A primeira aplicação do tema está na navbar e na abertura da home.

## Navbar da home
A navbar usa fundo escuro, marca à esquerda e links claros. Início recebe o traço vermelho da referência. A ordem é Início, Agenda, Cardápio, A Casa, Galeria e Contato. O PNG da marca mantém proporção 2:1, com 144 px no desktop e 120 px no menu compacto.

`Reserve sua mesa` aparece em destaque vermelho com borda irregular e ícone do WhatsApp. No desktop, fica à direita dos seis links. Abaixo de 960 px, fica no menu recolhível, com alvos de 44 px e foco visível. O botão abre uma conversa com o WhatsApp cadastrado. Quando o número está indisponível, leva à seção Contato.

## Tokens no wrapper institucional
| Papel | Valor inicial |
|---|---|
| Fundo | `#101012` |
| Superfície | `#19191C` |
| Texto | `#F0EDE7` |
| Secundário | `#A9A5A3` |
| Destaque | `#C52D32` |
| Papel da Agenda | `#E9E3D9` |
| Tinta sobre papel | `#171719` |
| Borda | `#353438` |

Aplicar via CSS Module/escopo `.institutional-site`, nunca substituir globalmente o dourado de `:root`. Verificar contraste de cada combinação; vermelho pequeno não é automaticamente acessível.

## Tipografia e composição
Display condensado (Barlow Condensed ou Oswald como candidatos) e sans legível; seleção/necessidade de fonte adicional é da TASK-070, não decisão de instalar ambas. Pesos limitados, fallback estável, português completo e fontes restritas ao site. Títulos com `clamp`, texto HTML sobre imagem, sem UI embutida no bitmap.

Container de 1200–1280 px; padding aproximado 20/32/48 px mobile/tablet/desktop. Escala 4/8/12/16/24/32/48/64/96. Mínimo 320 px; alvos de 44 px, foco visível, landmarks e heading hierarchy. Transições discretas 150–250 ms com redução de movimento.

## Seções e comportamento
- Hero cinematográfico com área de texto legível e recorte próprio mobile quando necessário.
- Papel rasgado somente na Agenda, SVG/CSS decorativo, sem capturar foco ou eventos.
- Agenda começa em lista vertical; não presumir carrossel. Não tornar card inteiro clicável sem destino real; CTA externo quando fornecido.
- Drinks/A Casa: uma foto principal por seção; galeria limitada pode variar a composição.
- Navegação mobile com botão semântico, estado expandido, teclado e retorno de foco.
- Sem autoplay/carrosséis automáticos, mapa pesado obrigatório ou bibliotecas de animação por padrão.
- O CTA de reserva encaminha uma conversa para o bar. Disponibilidade e confirmação ficam com o atendimento.

## QA
Verificar 320/360/768/1440 px, texto longo, zoom, contraste, fallback sem imagem/fontes, teclado e movimento reduzido. Comparar menu legado/admin/TV para detectar vazamento de tema. Registrar evidência visual, não apenas assertions de CSS.
