# Site institucional — requisitos conciliados

## Objetivo
Evoluir QRCodex para o site público do Relica's, com descoberta de shows, cardápio, ambiente e localização. Maurício mantém menu/eventos e campos institucionais aprovados no mesmo admin. Reutilizar o que funciona; sem reconstrução.

## Estado versus destino
Implementado: menu em `/[slug]/cardapio`, Hub em `/[slug]`, Agenda pública/admin, uploads, autenticação e tenancy. Música possui implementação e ensaio de produção registrados, com aceite físico/comercial pendente. A raiz tem abertura e navbar que apontam para Agenda e cardápio existentes. As rotas institucionais `/cardapio` e `/agenda` seguem planejadas.

Destino: `/` institucional nos hosts aprovados; `/cardapio` e `/agenda` compartilham dados e apresentação dos domínios existentes. Preservar URLs antigas e demais tenants. Domínio definitivo ainda requer confirmação operacional.

## Homepage
| Ordem | Seção | Contrato |
|---|---|---|
| 1 | Header/Hero | Marca, foto autorizada e título HTML. Menu com Início, Agenda, Cardápio, A Casa, Galeria e Contato. CTA de atendimento `Reserve sua mesa` via WhatsApp cadastrado |
| 2 | Agenda | Até quatro publicados relevantes, ordem cronológica, flyer real, data/hora São Paulo; vazio/erro independentes; link completo |
| 3 | Drinks e petiscos | Foto real, texto aprovado e acesso ao catálogo; sem catálogo/preços paralelos |
| 4 | A Casa | Texto/foto e características confirmadas |
| 5 | Galeria | Seleção limitada de fotos autorizadas; administração depende de aprovação específica |
| 6 | Localização | Endereço/horários/contato verificados e direções externas |
| 7 | Footer | Identidade, navegação e links reais |

## Administração
Preservar login, membership/RLS, shell, CRUD de menu e eventos. Adicionar campos institucionais tipados na extensão de settings; não deixar conteúdo que Maurício precisa editar somente em código. Campos exatos e schema são definidos na TASK-073. Não duplicar Agenda nem usar produtos como conteúdo genérico.

Agenda inicial preserva rascunho/publicado (`active`), título, descrição, datas, flyer e link externo. Slug, detalhe, cancelamento, couvert, prévia e reordenação manual não são requisitos aprovados automaticamente; registrar decisão antes de implementação. Sem término, a regra atual expira na hora de início; explicar isso ao proprietário e não inventar duração.

## Aceite
- Site funciona desde 320 px, com teclado/foco, contraste e movimento reduzido.
- Menu/Agenda em um toque; rotas antigas e outro tenant continuam corretos.
- Alterações administrativas refletem publicamente segundo política testada, sem deploy.
- Rascunhos ocultos; falha de Agenda não derruba navegação/menu.
- Fotografias e informações reais aprovadas antes do release; nada de agenda fictícia em produção.
- Checks, regressão de browser, SEO e recuperação registrados.

## Fora de escopo
Carrinho, pedidos, pagamentos, gestão de reservas, venda de ingressos, contas de visitantes, newsletter, fidelidade, analytics, billing/onboarding SaaS, CMS/page builder genérico e expansão de Música. O CTA de reserva abre o atendimento do estabelecimento no WhatsApp.
