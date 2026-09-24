# Relica's --- Design System & UI/UX Specification

**Versão:** 1.0\
**Produto:** Cardápio digital via QR Code\
**Plataforma:** Web responsiva, mobile-first\
**Objetivo:** consulta e apresentação de produtos\
**Fora do escopo:** pedidos, carrinho, checkout, pagamentos e comandas

------------------------------------------------------------------------

## 1. Conceito do produto

O Relica's Menu é um cardápio digital pensado para uso dentro do bar. O
cliente escaneia um QR Code e deve conseguir entender o cardápio,
navegar entre categorias, pesquisar itens, comparar preços e visualizar
detalhes com o mínimo possível de esforço.

A experiência não deve se comportar como e-commerce ou aplicativo de
delivery.

Fluxo principal:

``` text
QR Code
   ↓
Cardápio
   ↓
Busca / Categorias / Destaques
   ↓
Produto
   ↓
Detalhes opcionais
   ↓
Pedido realizado diretamente com a equipe do bar
```

A principal métrica de qualidade da interface é: **quão rapidamente
alguém consegue encontrar o que deseja consumir.**

------------------------------------------------------------------------

## 2. Princípios de UX

### 2.1 Consulta primeiro

Toda decisão deve favorecer descoberta e leitura do cardápio.

O usuário deve responder rapidamente:

-   O que tem?
-   Quanto custa?
-   Em qual categoria está?
-   Está disponível?
-   O que a casa destaca?
-   Quais são os ingredientes ou características principais?

### 2.2 Mobile-first real

O QR Code será normalmente aberto pelo celular. O design deve funcionar
primeiro em 320--430 px e depois expandir para tablet e desktop.

### 2.3 Uma mão, pouca atenção

O contexto real inclui música, conversa, pouca iluminação e atenção
dividida. Controles devem ser grandes, previsíveis e facilmente
alcançáveis.

### 2.4 Conteúdo acima de decoração

Fotografia e identidade são importantes, mas nunca devem dificultar
busca, leitura, preço ou navegação.

### 2.5 Sem falsas affordances

Não utilizar elementos que sugiram funcionalidades inexistentes.

**Proibidos no MVP:**

-   botão `+` em produtos;
-   carrinho;
-   quantidade;
-   "Adicionar";
-   "Comprar";
-   "Pedir agora";
-   checkout;
-   pagamento;
-   subtotal;
-   conta do consumidor;
-   histórico de pedidos;
-   delivery;
-   endereço de entrega.

------------------------------------------------------------------------

## 3. Personalidade visual

O conceito é **rock bar contemporâneo**.

A interface deve parecer:

-   noturna;
-   urbana;
-   moderna;
-   direta;
-   premium sem parecer sofisticada demais;
-   levemente underground;
-   confortável em ambiente escuro.

A identidade rock deve aparecer por meio de marca, fotografia,
contraste, pequenos detalhes gráficos e tom visual. Não devemos
transformar cada componente em uma referência a metal ou rock.

------------------------------------------------------------------------

## 4. Paleta --- Design Tokens

### Background

``` css
--color-bg: #0B0B0B;
--color-bg-soft: #101010;
--color-surface: #151515;
--color-surface-elevated: #1C1C1C;
--color-surface-hover: #242424;
```

### Texto

``` css
--color-text-primary: #F5F5F5;
--color-text-secondary: #B3B3B3;
--color-text-muted: #7D7D7D;
--color-text-inverse: #111111;
```

### Accent

O amarelo/dourado funciona como assinatura visual e deve ser usado
seletivamente.

``` css
--color-accent: #F4B400;
--color-accent-hover: #FFC329;
--color-accent-soft: #2A230D;
--color-accent-foreground: #111111;
```

### Bordas

``` css
--color-border: #292929;
--color-border-strong: #3A3A3A;
```

### Estados

``` css
--color-success: #22C55E;
--color-warning: #F4B400;
--color-danger: #E5484D;
```

O vermelho não deve ser a única indicação de erro ou indisponibilidade.

------------------------------------------------------------------------

## 5. Regra 80/15/5 de cor

A interface deve permanecer predominantemente neutra:

-   \~80% preto/cinza/surfaces;
-   \~15% branco/cinza de conteúdo;
-   \~5% amarelo de destaque.

O accent não deve pintar tudo. Seu valor vem justamente da escassez.

Usos apropriados:

-   categoria ativa;
-   pequenos detalhes;
-   badges selecionados;
-   foco;
-   elementos importantes da marca.

------------------------------------------------------------------------

## 6. Tipografia

Fonte recomendada para UI:

**Inter**, ou outra sans-serif altamente legível.

A tipografia própria do Relica's deve ficar restrita à marca ou títulos
especiais.

### Escala

``` css
--font-xs: 12px;
--font-sm: 14px;
--font-md: 16px;
--font-lg: 18px;
--font-xl: 24px;
--font-2xl: 32px;
```

### Pesos

``` text
400 — texto
500 — labels
600 — produtos/preços
700 — títulos
```

### Hierarquia

**H1:** 30--32 / 700\
**H2:** 22--24 / 700\
**H3:** 18 / 600\
**Body:** 14--16 / 400\
**Price:** 16--18 / 700\
**Caption:** 12--13 / 400--500

Preço precisa ser imediatamente legível.

------------------------------------------------------------------------

## 7. Espaçamento

Grid base de 4 px.

``` css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

Margem mobile padrão: **16 px**.

Separação entre grandes seções: **32--40 px**.

------------------------------------------------------------------------

## 8. Radius

``` css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-pill: 999px;
```

Cards principais: 12--16 px.\
Hero: 16--20 px.\
Chips: pill.

Evitar arredondamento excessivo em todos os elementos.

------------------------------------------------------------------------

## 9. Estrutura da página

``` text
Header
↓
Hero / destaque editorial
↓
Busca
↓
Categorias
↓
Destaques
↓
Seções do cardápio
↓
Informações do estabelecimento
```

Não criar uma homepage extensa antes do cardápio. O usuário escaneou o
QR para consultar produtos.

------------------------------------------------------------------------

## 10. Header

Deve conter apenas informações úteis:

-   logo;
-   nome do estabelecimento, quando necessário;
-   acesso à busca, se a busca não estiver imediatamente abaixo.

Não utilizar avatar, carrinho, notificações ou endereço de entrega.

Altura aproximada: **56--64 px**.

------------------------------------------------------------------------

## 11. Hero

O hero dá personalidade ao cardápio, mas não deve dominar a primeira
viewport.

Altura mobile recomendada: **180--220 px**.

Pode apresentar:

-   fotografia do bar/produto;
-   frase da marca;
-   especial real;
-   evento;
-   promoção configurada pelo estabelecimento.

Exemplo:

> Boa comida. Música boa.

Evitar carrossel automático.

Uma única peça editorial forte tende a funcionar melhor.

Enquanto não houver foto aprovada do estabelecimento, o menu usa uma
ilustração editorial local, rotulada como `Arte ilustrativa`. Ela não
representa o local nem um produto específico. A troca por mídia real será
configurável no admin futuramente. Fotos geradas para testes de produtos
não devem aparecer automaticamente em itens sem imagem cadastrada. Esses
itens mostram uma miniatura ilustrativa neutra de estado vazio, no mesmo
espaço reservado às fotos reais, sem sugerir a aparência do produto.

------------------------------------------------------------------------

## 12. Busca

Placeholder recomendado:

> Buscar cerveja, drink, lanche...

Pesquisa por:

-   nome;
-   descrição;
-   categoria quando útil.

O campo deve ser visualmente evidente e possuir botão para limpar o
texto.

A busca é local sobre os produtos públicos já carregados. Os resultados
continuam agrupados por categoria, e a navegação mostra apenas as
categorias com correspondências enquanto houver consulta. Destaques e
indisponibilidade acompanham o filtro.

Não incluir ícone de filtros enquanto não existirem filtros reais.

### Sem resultados

> Nenhum item encontrado para "IPA".

Ação:

> Limpar busca

------------------------------------------------------------------------

## 13. Categorias

Exemplo:

``` text
Porções
Lanches
Cervejas
Drinks
Doses
Cachaças
Vinhos
Whiskies
```

Categorias devem ser horizontalmente roláveis. Cada item tem uma imagem
ilustrativa quadrada acima do nome, com dimensões fixas para não deslocar
a navegação durante o carregamento. O nome continua visível e é a fonte
de identificação acessível; a imagem é decorativa. Categorias novas usam
uma ilustração neutra até receberem mídia própria no admin.

Estado ativo:

-   background accent;
-   texto escuro;
-   contraste alto.

Estado normal:

-   surface;
-   borda discreta;
-   texto secundário/primário.

------------------------------------------------------------------------

## 14. Navegação sticky

Depois que o usuário entra no conteúdo, a navegação de categorias pode
ficar sticky.

Comportamento:

1.  toca em Cervejas;
2.  scroll para a seção;
3.  item Cervejas fica ativo;
4.  conforme o scroll manual avança, a categoria ativa acompanha a
    seção;
5.  o item ativo permanece visível horizontalmente.

Respeitar `prefers-reduced-motion`.

------------------------------------------------------------------------

## 15. Estratégia de densidade

Não utilizar cards fotográficos gigantes para todos os produtos.

O cardápio de bar pode possuir dezenas de bebidas. Uma grade de cards
grandes aumentaria excessivamente o scroll.

Usar densidade conforme o conteúdo:

``` text
Destaques        → card grande
Porções          → card/lista com imagem
Lanches          → card/lista com imagem
Drinks autorais  → card visual
Cervejas         → lista compacta
Doses            → lista compacta
Whiskies         → lista compacta
Água/refrigerante→ lista muito compacta
```

Essa é uma diferença importante entre um conceito bonito de delivery e
uma boa UX de cardápio real.

------------------------------------------------------------------------

## 16. Featured Product Card

Uso exclusivo para destaques.

Conteúdo:

-   imagem;
-   nome;
-   descrição curta opcional;
-   preço;
-   badge real opcional.

O card inteiro pode abrir detalhes.

**Não possuir botão `+`.**

------------------------------------------------------------------------

## 17. Product List Item

Componente principal das listas.

Estrutura:

``` text
[imagem] Nome do produto
         descrição curta
         R$ 34,90
```

Imagem opcional: 72--88 px.

Nome: máximo recomendado de duas linhas.

Descrição: máximo de duas linhas na listagem.

Preço sempre visível.

Todo o item pode ser clicável quando existir página de detalhe.

------------------------------------------------------------------------

## 18. Produto sem imagem

A UI deve funcionar perfeitamente sem fotografia.

Exemplo:

``` text
Heineken 600ml
Cerveja • 600ml                         R$ 19,90
```

ou:

``` text
Heineken 600ml                          R$ 19,90
```

Enquanto não houver foto cadastrada, usar a ilustração neutra de estado
vazio definida para a listagem; nunca uma foto fictícia do produto.

------------------------------------------------------------------------

## 19. Produtos indisponíveis

Produtos normalmente vendidos podem continuar visíveis.

Tratamento:

-   redução moderada de contraste;
-   badge textual `Esgotado`;
-   nome, preço e descrição em tons neutros apagados para comunicar estado desabilitado sem remover legibilidade;
-   imagem com opacidade reduzida, preservando o badge como indicação textual explícita;
-   preço preservado, se desejado;
-   nenhuma aparência de ação de compra.

Nunca comunicar indisponibilidade apenas por cor.

------------------------------------------------------------------------

## 20. Badges

Permitidos:

-   Destaque
-   Novo
-   Promoção
-   Esgotado

Somente quando representam estado real.

Evitar poluição como:

`HOT • TOP • BEST • CHEF • FAVORITO`.

------------------------------------------------------------------------

## 21. Preço

Padrão brasileiro:

``` text
R$ 34,90
```

O preço nunca deve exigir abertura do detalhe.

Em listas muito compactas:

``` text
Heineken 600ml                     R$ 19,90
```

------------------------------------------------------------------------

## 22. Página de detalhe

Detalhes são opcionais. A listagem deve resolver a maior parte da
decisão.

Estrutura:

``` text
← Voltar

[imagem]

Nome do produto
R$ 34,90

Descrição factual.

Informações
Serve 2–3 pessoas
```

Mostrar somente dados realmente cadastrados.

Não inventar ingredientes, alergênicos, tamanho, avaliações ou
informações nutricionais.

Não existe CTA de compra.

Uma orientação geral pode informar:

> Faça seu pedido diretamente com nossa equipe.

------------------------------------------------------------------------

## 23. Favoritos

Fora do MVP.

Apesar de comum em referências de food apps, cria estado persistente sem
benefício claro para uma visita ao bar.

Reavaliar somente com evidência de uso.

------------------------------------------------------------------------

## 24. Fotografia

Direção recomendada:

-   iluminação quente;
-   fundo escuro/neutro;
-   comida reconhecível;
-   enquadramento consistente;
-   boa resolução;
-   pouca poluição;
-   proporções padronizadas.

Uma foto ruim é pior do que nenhuma foto.

Evitar imagens que não representem o produto realmente servido.

------------------------------------------------------------------------

## 25. Performance de imagens

Utilizar:

-   `next/image`;
-   dimensões corretas;
-   formatos modernos;
-   lazy loading;
-   placeholder;
-   otimização de tamanho;
-   prioridade apenas para imagens acima da dobra.

O cardápio deve continuar útil em conexão móvel ruim.

------------------------------------------------------------------------

## 26. Loading

Preferir skeletons que preservem a estrutura da página.

O skeleton da rota pública reserva espaço para header, hero, busca,
categorias e início da listagem. A animação é discreta e desativada com
`prefers-reduced-motion`.

Evitar spinner bloqueando toda a tela.

Objetivos:

-   evitar layout shift;
-   transmitir progresso;
-   permitir percepção rápida da estrutura.

------------------------------------------------------------------------

## 27. Estados de erro

### Erro geral

> Não foi possível carregar o cardápio.

Botão:

> Tentar novamente

### Categoria vazia

> Nenhum item disponível nesta categoria no momento.

### Cardápio vazio

Sem categorias e com categorias sem nenhum produto são estados distintos;
mostrar uma mensagem factual para cada um, sem campo de busca inútil.

Nunca exibir mensagens técnicas de Next.js, Supabase ou banco para
clientes.

------------------------------------------------------------------------

## 28. Interação

Todos os elementos interativos precisam de:

-   default;
-   hover quando aplicável;
-   pressed;
-   focus-visible;
-   disabled quando aplicável.

Área mínima recomendada para controles: **44 × 44 px**.

------------------------------------------------------------------------

## 29. Motion

Permitido:

-   150--250 ms;
-   feedback de toque;
-   transições de chips;
-   pequenas mudanças de estado;
-   scroll suave quando apropriado.

Evitar:

-   parallax;
-   animação de entrada de todos os cards;
-   carrossel automático;
-   animações decorativas pesadas.

------------------------------------------------------------------------

## 30. Acessibilidade

Meta: WCAG AA quando aplicável.

Obrigatório:

-   contraste adequado;
-   foco visível;
-   HTML semântico;
-   alt em imagens relevantes;
-   controles nomeados;
-   não depender somente de cor;
-   zoom permitido;
-   suporte a teclado;
-   `prefers-reduced-motion`;
-   tipografia confortável.

A legibilidade é especialmente importante porque o produto será usado em
ambiente noturno.

------------------------------------------------------------------------

## 31. Responsividade

### Mobile --- prioridade

320 px em diante.

Uma coluna.

### Tablet

Conteúdo centralizado; cards de destaque podem utilizar duas colunas.

### Desktop

Não esticar o cardápio indefinidamente.

``` css
max-width: 1080px;
margin-inline: auto;
```

O desktop continua sendo cardápio, não dashboard.

------------------------------------------------------------------------

## 32. Informações do bar

No final ou em área secundária:

-   endereço;
-   horário;
-   Instagram;
-   contato;
-   Wi-Fi, caso configurado;
-   observações gerais.

Não competir visualmente com produtos.

------------------------------------------------------------------------

## 33. Design do admin

O painel administrativo prioriza produtividade e não precisa copiar a
estética pública.

A tela de login compartilha os tokens de preto, cinza e dourado do cardápio,
sem copiar seus elementos editoriais. Usa tipografia compacta, campos de
toque confortáveis e formulário sem card decorativo. Erros de autenticação
aparecem junto ao formulário, sem exibir detalhes internos; o estado
conectado oferece uma ação clara de saída.

Exemplo:

``` text
Produtos

Buscar produto...

Cervejas

Heineken 600ml
R$ 19,90
Disponível ●
Editar
```

Ações frequentes --- principalmente disponibilidade --- devem exigir
poucos passos.

A página de conta segue o mesmo shell administrativo e formulário claro.
Troca de senha apresenta senha atual, nova senha e confirmação, requisitos
curtos junto ao campo e uma única ação principal. Mensagens nunca revelam
credenciais ou detalhes internos de autenticação.

A navegação pública de categorias usa itens compactos, com imagem acima do
nome e aproximadamente quatro opções visíveis em um celular comum. O estado
ativo destaca borda e texto, sem preencher todo o card com a cor de acento.
Nomes ocupam no máximo duas linhas e a rolagem horizontal continua explícita.

No cabeçalho público, a logo do estabelecimento aparece centralizada acima
do nome e do rótulo `Cardápio digital`. Para a Relica's, a identidade local é
o fallback quando nenhuma logo persistida foi cadastrada. A administração
mostra uma prévia quadrada e controles explícitos para substituir ou voltar
ao padrão.

O shell autenticado usa uma superfície clara e neutra para separar o
trabalho administrativo da experiência pública escura. Em telas amplas,
a navegação fica em uma lateral compacta; em telas pequenas, vira uma
faixa horizontal rolável abaixo do cabeçalho. O estabelecimento atual
permanece visível na lateral, e acesso ao cardápio e encerramento da sessão
continuam disponíveis sem competir com a tarefa principal.

O Admin cresce como um único ambiente dividido em áreas de trabalho:
`Visão geral`, `Cardápio`, `Agenda`, `Música`, `Estabelecimento` e `Conta`.
No desktop, a lateral agrupa destinos relacionados e destaca área e página
atuais. No celular, a navegação permanece compacta e não tenta exibir todos
os módulos e ações simultaneamente.

A Visão geral usa resumos curtos e atalhos, por exemplo quantidade de
produtos, próximo evento ou pedidos de música aguardando. Formulários,
listas extensas e ações operacionais permanecem dentro de suas áreas. Isso
evita um dashboard decorativo ou uma tela única sobrecarregada.

Agenda e Música só entram na navegação quando estiverem implementadas. A
fila de músicas é uma superfície operacional própria, adequada a atualização
frequente; ela não deve ser apresentada como mais um formulário de conteúdo.
Todas as áreas preservam o nome do estabelecimento e os mesmos padrões de
feedback, foco, erro e ações destrutivas.

Áreas ainda não implementadas devem mostrar um estado pendente intencional,
sem controles inativos que pareçam funcionais. Painéis e listas evitam
decoração editorial, priorizando leitura, comparação e ações recorrentes.

A listagem administrativa de produtos usa linhas compactas, com nome e
categoria como identificação principal, preço alinhado e estados textuais
de disponibilidade e atividade. Busca e filtro de categoria aparecem antes
da lista e podem ser combinados. Em telas pequenas, preço e identidade
ocupam a primeira linha e os estados passam para uma segunda linha, sem
rolagem horizontal da página.

O formulário de produto mantém rótulos acima dos campos, preço com prefixo
visual `R$`, seletor de categoria e estados binários em linhas com checkbox,
título e descrição curta. Erros aparecem junto ao campo correspondente e a
mensagem geral não expõe detalhes do banco. No celular, ações ocupam a largura
disponível; em telas maiores, ficam alinhadas ao final do formulário.

A administração de categorias usa linhas compactas com miniatura, nome, slug,
posição e estado. Criação e edição mantêm nome e slug como campos explícitos;
a imagem opcional é gerenciada na edição e sempre mostra o fallback vigente
quando não há mídia persistida. Ativação rápida e ordenação são controles
separados, introduzidos apenas nas tarefas correspondentes.

Disponibilidade é uma ação operacional frequente e permanece acessível na
listagem por meio de um switch compacto com o texto `Disponível` ou
`Esgotado`. O controle informa seu estado também semanticamente, bloqueia
novos envios enquanto salva e só muda depois da confirmação do servidor.

Desativação é a opção recomendada para retirar um produto do cardápio e
permanece no formulário de edição. Exclusão permanente aparece somente em
uma seção separada, depois das ações normais. Um diálogo convencional mostra
o nome do produto, explica que a ação é irreversível e oferece `Cancelar` com
foco inicial e `Excluir permanentemente`. A ação destrutiva usa vermelho sem
se tornar o elemento visual dominante da página.

------------------------------------------------------------------------

## 34. Componentes sugeridos

``` text
components/
├── ui/
│   ├── button
│   ├── badge
│   ├── input
│   ├── skeleton
│   └── icon-button
│
└── menu/
    ├── menu-header
    ├── menu-hero
    ├── search-field
    ├── category-chip
    ├── category-navigation
    ├── category-section
    ├── product-list-item
    ├── featured-product-card
    ├── product-image
    ├── unavailable-badge
    ├── empty-state
    └── bar-information
```

Criar abstrações apenas quando houver repetição real.

------------------------------------------------------------------------

## 35. Conteúdo

Nomes devem ser curtos e reconhecíveis.

Bom:

> Batata Frita Completa

Descrição boa:

> Batata frita com cheddar e bacon.

Evitar copy publicitária genérica:

> Uma incrível explosão de sabores que vai surpreender você!

O objetivo é informar.

------------------------------------------------------------------------

## 36. Hierarquia do produto

Prioridade:

1.  nome;
2.  preço;
3.  imagem quando útil;
4.  descrição;
5.  disponibilidade;
6.  informações complementares.

O usuário nunca deve precisar abrir detalhes para descobrir preço.

------------------------------------------------------------------------

## 37. Orientação sobre pedidos

Como a aplicação é somente consulta, pode existir uma mensagem única e
discreta:

> Consulte nosso cardápio e faça seu pedido diretamente com a equipe.

Não repetir em todos os produtos.

------------------------------------------------------------------------

## 38. O que aproveitar das referências

Aproveitar:

-   fotografia forte;
-   cards limpos;
-   categorias visuais;
-   chips;
-   busca evidente;
-   bom espaçamento;
-   hierarquia;
-   dark theme;
-   preços claros;
-   seções bem definidas.

Não copiar:

-   carrinho;
-   botão +;
-   checkout;
-   delivery;
-   perfil;
-   rewards;
-   quantidade;
-   subtotal;
-   avaliações fictícias.

------------------------------------------------------------------------

## 39. Estrutura conceitual mobile

``` text
┌──────────────────────────────┐
│          RELICA'S            │
│         ROCK & BAR           │
│                              │
│ 🔍 Buscar cerveja, drink...  │
│                              │
│ ┌──────────────────────────┐ │
│ │ FOTO                     │ │
│ │ Boa comida. Música boa.  │ │
│ └──────────────────────────┘ │
│                              │
│ [Porções][Lanches][Cervejas]→│
│                              │
│ DESTAQUES                    │
│                              │
│ ┌────────────┐ ┌───────────┐ │
│ │ foto       │ │ foto      │ │
│ │ Batata     │ │ X-Burger  │ │
│ │ R$ 34,90   │ │ R$ 27,00  │ │
│ └────────────┘ └───────────┘ │
│                              │
│ PORÇÕES                      │
│                              │
│ [img] Batata Completa        │
│       Cheddar + bacon        │
│       R$ 34,90               │
│ ──────────────────────────── │
│                              │
│ CERVEJAS                     │
│                              │
│ Heineken 600ml      R$ 19,90 │
│ Spaten 600ml        R$ 16,00 │
│ Original 600ml      R$ 16,00 │
└──────────────────────────────┘
```

------------------------------------------------------------------------

## 40. Regras para o Codex

Antes de implementar qualquer UI pública, consultar este documento.

### Não fazer

-   criar carrinho;
-   criar pedido;
-   criar pagamento;
-   adicionar botão `+`;
-   criar quantidade;
-   criar perfil do consumidor;
-   inventar promoções;
-   inventar avaliações;
-   inventar informações dos produtos;
-   criar filtros sem requisito;
-   priorizar efeitos sobre performance.

### Fazer

-   mobile-first;
-   utilizar tokens;
-   manter acessibilidade;
-   suportar produtos sem imagem;
-   suportar listas grandes;
-   preço sempre legível;
-   respeitar disponibilidade;
-   testar 320 px;
-   preservar identidade do estabelecimento;
-   manter interface focada em consulta.

------------------------------------------------------------------------

## 41. Conceitos explicitamente fora do domínio MVP

Nenhum componente, rota, tabela ou estado relacionado aos conceitos
abaixo deve ser criado sem alteração explícita do PRD:

``` text
Cart
Basket
Order
OrderItem
Checkout
Payment
PaymentMethod
Quantity
Delivery
DeliveryAddress
OrderHistory
CustomerAccount
Rewards
Loyalty
Coupon
TableOrder
KitchenTicket
```

------------------------------------------------------------------------

## 42. Ordem de implementação visual

1.  tokens globais;
2.  tipografia;
3.  container/layout;
4.  header;
5.  busca;
6.  categorias;
7.  ProductListItem;
8.  CategorySection;
9.  FeaturedProductCard;
10. loading/empty/error;
11. detalhe;
12. informações do bar;
13. responsividade;
14. acessibilidade;
15. performance.

A fundação é:

**categorias + produtos + busca + preços.**

------------------------------------------------------------------------

## 43. Teste de usabilidade no bar

Testar com usuários reais sem explicar a interface.

Exemplos:

> Encontre o preço da Heineken.

> Veja quais porções existem.

> Encontre uma caipirinha.

> Descubra quanto custa determinado whisky.

> Encontre um item sem saber sua categoria.

Observar:

-   tempo;
-   taps;
-   scroll;
-   hesitações;
-   erros;
-   busca;
-   entendimento das categorias.

------------------------------------------------------------------------

## 44. Critérios de aceite UX

O cardápio deve permitir que o usuário:

-   abra diretamente pelo QR;
-   não precise de login;
-   reconheça o Relica's;
-   veja conteúdo útil rapidamente;
-   encontre busca;
-   navegue categorias com uma mão;
-   veja preço sem abrir detalhes;
-   entenda produtos sem imagem;
-   identifique indisponibilidade;
-   navegue cardápios longos;
-   use a interface a partir de 320 px;
-   não confunda a aplicação com um sistema de pedidos.

------------------------------------------------------------------------

## 45. Definition of Done --- Design

A experiência é considerada pronta quando uma pessoa consegue:

1.  escanear o QR;
2.  reconhecer o cardápio;
3.  localizar uma categoria;
4.  pesquisar;
5.  comparar produtos e preços;
6.  identificar indisponibilidade;
7.  consultar detalhes;
8.  retornar sem perder contexto.

E principalmente:

> **Em nenhum momento a interface deve fazer o cliente acreditar que
> está realizando um pedido ou pagamento pelo sistema.**

------------------------------------------------------------------------

## 46. Norte de produto

O objetivo não é criar um "iFood do Relica's".

É criar **um excelente cardápio digital para uma pessoa que já está
fisicamente no bar**.

A experiência ideal é:

``` text
QR
 ↓
abriu
 ↓
entendeu
 ↓
encontrou
 ↓
escolheu
```

A simplicidade faz parte do produto.

------------------------------------------------------------------------

## 47. Bar Hub page type

O Hub é a porta de entrada do estabelecimento, não uma lista genérica de
links nem uma landing page de e-commerce. A primeira viewport deve
comunicar identidade e tornar a próxima ação óbvia.

Hierarquia:

``` text
Logo / identidade do estabelecimento
Contexto breve

PRIMÁRIO
Cardápio — grande, inequívoco e acessível em um toque

SECUNDÁRIO
Somente módulos implementados, como Agenda ou Música

TERCIÁRIO
Instagram e informações aprovadas do estabelecimento
```

Regras:

- preservar os tokens escuros do rock bar contemporâneo;
- para o Relica's, usar a arte editorial aprovada em tela cheia no hero, com uma camada escura uniforme para manter a identidade legível;
- posicionar logo, nome e contexto na base do hero, preservando o estabelecimento como primeiro sinal visual;
- usar um destino primário forte sem transformar toda ação em card;
- apresentar Cardápio como uma faixa de largura total, com conteúdo alinhado ao mesmo limite interno do hero;
- manter contatos reais em uma faixa terciária discreta, quando cadastrados;
- nunca exibir módulos futuros como placeholders clicáveis desabilitados;
- manter alvos de toque de pelo menos 44 px e foco completo por teclado;
- funcionar desde 320 px e deixar conteúdo útil seguinte parcialmente visível;
- manter o cardápio denso e orientado à consulta após a navegação;
- a aquisição do domínio não altera o contrato visual ou de interação.
