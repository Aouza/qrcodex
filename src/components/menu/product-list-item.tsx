import Image from "next/image";
import type { PublicProduct } from "@/lib/menu/load-public-menu";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductListItem({ product }: { product: PublicProduct }) {
  return (
    <li className={`public-menu__product${product.image_url ? " public-menu__product--with-image" : ""}`}>
      {product.image_url && (
        <Image
          className="public-menu__product-image"
          src={product.image_url}
          alt={product.name}
          width={80}
          height={80}
          sizes="80px"
        />
      )}
      <div className="public-menu__product-info">
        <div className="public-menu__product-main">
          <h4>{product.name}</h4>
          <strong>{currency.format(product.price_cents / 100)}</strong>
        </div>
        {product.description && <p>{product.description}</p>}
      </div>
    </li>
  );
}
