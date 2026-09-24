import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEstablishmentLogo } from "@/lib/menu/get-establishment-logo";
import { loadPublicMenu } from "@/lib/menu/load-public-menu";

export default async function PublicHubPage({
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
    <main className="public-hub">
      <header className="public-hub__header">
        <div className="public-hub__inner public-hub__identity">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`Logo de ${menu.establishment.name}`}
              width={96}
              height={96}
              className="public-hub__logo"
              priority
            />
          )}
          <div>
            <p className="public-hub__eyebrow">Bem-vindo ao</p>
            <h1>{menu.establishment.name}</h1>
          </div>
        </div>
      </header>
      <section className="public-hub__inner public-hub__destinations" aria-labelledby="hub-destinations-title">
        <h2 id="hub-destinations-title" className="public-hub__section-title">O que você procura?</h2>
        <Link className="public-hub__menu-link" href={`/${slug}/cardapio`}>
          <span className="public-hub__menu-copy">
            <span className="public-hub__menu-label">Principal</span>
            <strong>Cardápio</strong>
            <span>Comidas, bebidas e preços atualizados</span>
          </span>
          <span className="public-hub__menu-arrow" aria-hidden="true">→</span>
        </Link>
      </section>
      {(menu.establishment.instagram || menu.establishment.whatsapp) && (
        <footer className="public-hub__inner public-hub__contacts">
          {menu.establishment.instagram && <a href={`https://instagram.com/${menu.establishment.instagram}`} target="_blank" rel="noreferrer">Instagram</a>}
          {menu.establishment.whatsapp && <a href={`https://wa.me/${menu.establishment.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>}
        </footer>
      )}
    </main>
  );
}
