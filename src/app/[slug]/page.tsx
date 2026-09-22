import Image from "next/image";
import { notFound } from "next/navigation";
import { CategoryNavigation } from "@/components/menu/category-navigation";
import { ProductListItem } from "@/components/menu/product-list-item";
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

      <div className="public-menu__inner public-menu__intro">
        <h2 id="menu-categories">Cardápio</h2>
        <span>{menu.categories.length} categorias</span>
      </div>

      {menu.categories.length > 0 && (
        <CategoryNavigation
          categories={menu.categories.map(({ id, name }) => ({ id, name }))}
        />
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
