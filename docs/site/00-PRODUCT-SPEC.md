# Site institucional — requisitos conciliados

## Referência vigente
Em 2026-11-17 o usuário aprovou `reference/layout-aprovado.png` como única direção visual e autorizou substituir a apresentação anterior. [ADR-022](../DECISIONS.md#adr-022--layout-aprovado-como-referência-visual-única) registra alcance e limites. Referências antigas e tarefas concluídas preservam evidência histórica, sem prevalecer sobre este desenho.

## Objetivo e fronteiras
Descoberta de shows, cardápio, casa e contato dentro do Next existente. Menu em `/[slug]/cardapio`, Agenda e admin seguem como fonte única. Sem reconstrução, backend paralelo ou mudança de Música. `/cardapio` e `/agenda` institucionais continuam sujeitos ao inventário de slugs/hosts; a home usa `/relicas/cardapio` e `/relicas/agenda` enquanto os aliases não forem implementados.

## Composição da homepage
| Ordem | Seção | Contrato |
|---|---|---|
| 1 | Header/Hero | Marca, Início, Agenda, Cardápio, A Casa, Localização e Contato. Header sobre hero escura, título HTML creme/vermelho; CTAs Reserve sua mesa e Ver a agenda |
| 2 | Agenda | Até dois eventos publicados/relevantes com início na semana atual, segunda a domingo, São Paulo. Intervalo antes do limite, flyer cadastrado e linhas escuras. Contato de reserva somente com WhatsApp cadastrado. Semana vazia não puxa shows futuros; link abre Agenda completa sem esse recorte |
| 3 | Drinks & Petiscos | Composição visual de cerveja/petiscos e acesso ao catálogo existente, sem preços ou catálogo paralelo |
| 4 | A Casa | Texto e imagem editorial; link Conhecer a casa leva à localização na própria página |
| 5 | Depoimentos | Três avaliações reais fornecidas/autorizadas pelo usuário na TASK-090, com autores e sem datas. Quem vem, faz parte; nota Google 4,5/776 avaliações é snapshot manual informado, sem API ou structured data. Exibição em todos os ambientes; link somente quando confirmado |
| 6 | Playlist/Localização | Vinil, identidade musical, endereço/direções somente confirmados e mapa ilustrativo identificado. Sem embed externo obrigatório |
| 7 | Footer/Contato | Marca, navegação e contatos reais cadastrados. Ausência de links comunica indisponibilidade |

Galeria e papel rasgado não integram o novo layout. Não incluir seção CTA adicional só por haver asset no ZIP. RSVP, venda de ingressos e gestão de reservas não são funções deste site: botões de reserva abrem conversa com WhatsApp cadastrado e têm fallback em Contato.

## Conteúdo de revisão e produção
Aprovação de layout não comprova fotografia documental, endereço, horários, playlist ou redes. Na TASK-089 o usuário autorizou as imagens selecionadas em todos os ambientes. Na TASK-090 confirmou e forneceu três depoimentos reais para substituir os exemplos, também em todos os ambientes e sem mês/ano. A TASK-091 remove o aviso visual de revisão por solicitação do usuário; conteúdo autorizado continua incondicional. O mapa mantém identificação ilustrativa. Não usar as bandas da referência como shows confirmados; a TASK-088 registra a autorização específica dos três eventos temporários identificados como TESTE.

Playlist sem URL oficial mostra “Link oficial em breve”. Sem endereço confirmado, consultar a casa pelo contato disponível; sem dados confirmados não criar botão de mapa externo. Instagram/WhatsApp vêm do cadastro existente. Spotify/Facebook/YouTube não ganham URLs por inferência. Texto informativo não é controle desabilitado.

## Administração
Preservar login, membership/RLS, shell, CRUD de menu/eventos. Schema editorial e edição no admin continuam nas TASK-073/074; não são concluídos por esta apresentação. Conteúdo estático de revisão não substitui a autonomia planejada. Galeria administrável depende de escopo futuro.

## Aceite
320 px, teclado/foco, menu mobile com Escape, conteúdo legível sem login, movimento reduzido e CSS restrito ao site. Agenda reflete publicação/tempo/tenant com falha isolada; Menu/Hub/admin/TV mantêm contratos. Hero priorizada; mídia inferior lazy e dimensões reservadas. Checks e browser/build/start documentados, sem inferir produção ou publicação de conceitos.

## Fora de escopo
Carrinho, pagamentos, pedidos, contas de visitantes, reservas operacionais, CMS genérico, novos provedores de reviews, newsletter, analytics, integrações especulativas e expansão de Música.
