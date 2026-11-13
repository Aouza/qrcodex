# Produto — Cardápio

## Propósito

Permitir ao cliente consultar produtos, preços e disponibilidade rapidamente no celular. Rota existente: `/[slug]/cardapio`. O futuro `/cardapio` institucional reutiliza o mesmo catálogo; não cria outro produto ou backend.

## Fontes responsáveis

| Assunto | Fonte |
|---|---|
| Escopo e regras de produtos/categorias/busca | [PRD](../PRD.md), §§5, 8–11 e 14 |
| Loaders e composição pública/admin | [Arquitetura](../ARCHITECTURE.md) |
| Produtos, categorias, centavos e buckets | [Banco](../DATABASE.md) |
| UI de consulta, busca e estados | [Design system](../DESIGN_SYSTEM.md), §§1–32 e 34–46 |
| Integração institucional | [Contrato de integração](../site/04-QRCODEX-INTEGRATION.md) e [TASK-068](../../tasks/planned/TASK-068-site-menu-route.md) |

## Capacidade existente e limites

Menu público sem login, categorias ordenadas, produtos ativos, destaques, `Esgotado`, fotos opcionais, fallback neutro e busca local por nome/descrição. Admin mantém produtos, categorias, ordenação, disponibilidade e imagens. A busca não pesquisa nome da categoria. Preços usam centavos inteiros.

Imagens de categoria já são persistidas e gerenciadas pelo admin. A substituição do **hero editorial** por foto aprovada via settings é outra pendência; não confundir as duas capacidades. Os impressos em `docs/cardapio/` são fonte do catálogo inicial, não o registro de preços depois de edições administrativas.

Sem carrinho, quantidade, pedidos ou pagamentos. Tela de detalhe de produto é possibilidade de design condicionada a tarefa futura; não é rota entregue nem critério obrigatório do MVP atual.

## Código e evidência

- Público: `src/app/[slug]/cardapio/`, `src/lib/menu/`, `src/components/menu/`.
- Gestão: `src/app/admin/(protected)/products/`, `categories/` e validações correspondentes.
- Regressão: `tests/filter-menu-categories.test.mjs`, `get-featured-products.test.mjs`, validações de produto/categoria/imagem e testes SQL de tenant/Storage.

## Andamento e dependências

[BACKLOG](../../tasks/BACKLOG.md), epics Public Menu, Product Administration e Category Administration, registra as entregas existentes. A TASK-068 integra o destino institucional; TASK-078 cobre regressão integrada. QR definitivo depende da [TASK-028](../../tasks/active/TASK-028-permanent-qr.md). Consulte [CURRENT](../../tasks/CURRENT.md) antes de executar.
