import Image from "next/image";
import { notFound } from "next/navigation";
import { CategoryNavigation } from "@/components/menu/category-navigation";
import { ProductListItem } from "@/components/menu/product-list-item";
import { getFeaturedProducts } from "@/lib/menu/get-featured-products";
import { loadPublicMenu } from "@/lib/menu/load-public-menu";

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const menu = await loadPublicMenu(slug);

  if (!menu) {
    notFound();
  }

  const featuredProducts = getFeaturedProducts(menu.categories);

  return (
    <main className="public-menu">
      <header className="public-menu__header">
        <div className="public-menu__inner public-menu__identity">
          {menu.establishment.logo_url && (
            <Image
              src={menu.establishment.logo_url}
              alt=""
              width={48}
              height={48}
              unoptimized
              className="public-menu__logo"
            />
          )}
          <div className="public-menu__brand">
            <h1>{menu.establishment.name}</h1>
            <p>Cardápio digital</p>
          </div>
        </div>
      </header>

      {menu.establishment.slug === "relicas" && (
        <section className="public-menu__inner" aria-labelledby="menu-hero-title">
          <div className="public-menu__hero">
            <Image
              src="/images/menu-editorial.webp"
              alt="Ilustração de guitarra, amplificador e copo de cerveja"
              fill
              sizes="(max-width: 1080px) 100vw, 1080px"
              className="public-menu__hero-image"
              fetchPriority="high"
            />
            <div className="public-menu__hero-copy">
              <h2 id="menu-hero-title">Boa comida.<br />Música boa.</h2>
              <p>Arte ilustrativa</p>
            </div>
          </div>
        </section>
      )}

      <div className="public-menu__inner public-menu__intro">
        <h2 id="menu-categories">Cardápio</h2>
        <span>{menu.categories.length} categorias</span>
      </div>

      {menu.categories.length > 0 && (
        <CategoryNavigation
          establishmentSlug={menu.establishment.slug}
          categories={menu.categories.map(({ id, name, slug }) => ({ id, name, slug }))}
        />
      )}

      {featuredProducts.length > 0 && (
        <section className="public-menu__inner public-menu__featured" aria-labelledby="menu-featured">
          <h2 id="menu-featured">Destaques</h2>
          <ul className="public-menu__featured-products">
            {featuredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} featured />
            ))}
          </ul>
        </section>
      )}

      <section className="public-menu__inner public-menu__content" aria-labelledby="menu-categories">
        {menu.categories.map((category, index) => (
          <section
            key={category.id}
            id={`category-${category.id}`}
            className="public-menu__category-section"
            aria-labelledby={`category-title-${category.id}`}
          >
            <div className="public-menu__category-heading">
              <span className="public-menu__category-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 id={`category-title-${category.id}`}>{category.name}</h3>
            </div>
            {category.products.length > 0 && (
              <ul className="public-menu__products">
                {category.products.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </ul>
            )}
          </section>
        ))}
      </section>
    </main>
  );
}
