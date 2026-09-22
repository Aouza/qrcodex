import Image from "next/image";
import type { PublicProduct } from "@/lib/menu/load-public-menu";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductListItem({
  product,
  featured = false,
}: {
  product: PublicProduct;
  featured?: boolean;
}) {
  return (
    <li className={`public-menu__product${featured ? " public-menu__product--featured" : ""}${!product.available ? " public-menu__product--unavailable" : ""}`}>
      <Image
        className="public-menu__product-image"
        src={product.image_url ?? "/images/categories/generic.webp"}
        alt={product.image_url ? product.name : "Sem foto do produto"}
        width={featured ? 96 : 80}
        height={featured ? 96 : 80}
        sizes={featured ? "96px" : "80px"}
      />
      <div className="public-menu__product-info">
        <div className="public-menu__product-main">
          <h4>{product.name}</h4>
          <strong>{currency.format(product.price_cents / 100)}</strong>
        </div>
        {product.description && <p>{product.description}</p>}
        {!product.available && <span className="public-menu__product-status">Esgotado</span>}
      </div>
    </li>
  );
}
