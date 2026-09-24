import Image from "next/image";
import { notFound } from "next/navigation";
import { MenuCatalog } from "@/components/menu/menu-catalog";
import { getEstablishmentLogo } from "@/lib/menu/get-establishment-logo";
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

  const logoUrl = getEstablishmentLogo(menu.establishment.logo_url, menu.establishment.slug);

  return (
    <main className="public-menu">
      <header className="public-menu__header">
        <div className="public-menu__inner public-menu__identity">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`Logo de ${menu.establishment.name}`}
              width={80}
              height={80}
              className="public-menu__logo"
            />
          )}
          <div className="public-menu__brand">
            <h1>{menu.establishment.name}</h1>
            <p>Cardápio digital</p>
          </div>
          {(menu.establishment.instagram || menu.establishment.whatsapp) && <div className="public-menu__contacts">
            {menu.establishment.instagram && <a href={`https://instagram.com/${menu.establishment.instagram}`} target="_blank" rel="noreferrer">Instagram</a>}
            {menu.establishment.whatsapp && <a href={`https://wa.me/${menu.establishment.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>}
          </div>}
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
