import Image from "next/image";
import { notFound } from "next/navigation";
import { MenuCatalog } from "@/components/menu/menu-catalog";
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

      <MenuCatalog categories={menu.categories} establishmentSlug={menu.establishment.slug} />
    </main>
  );
}
