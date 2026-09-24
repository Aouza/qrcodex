import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPublicHub } from "@/lib/hub/load-public-hub";
import { getEstablishmentLogo } from "@/lib/menu/get-establishment-logo";

export default async function PublicHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const establishment = await loadPublicHub(slug);

  if (!establishment) {
    notFound();
  }

  const logoUrl = getEstablishmentLogo(establishment.logo_url, establishment.slug);

  return (
    <main className="public-hub">
      <header className={`public-hub__hero${establishment.slug === "relicas" ? " public-hub__hero--relicas" : ""}`}>
        {establishment.slug === "relicas" && (
          <Image
            src="/images/menu-editorial.webp"
            alt=""
            fill
            sizes="100vw"
            className="public-hub__hero-image"
            priority
          />
        )}
        <div className="public-hub__hero-shade" aria-hidden="true" />
        <div className="public-hub__inner public-hub__identity">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`Logo de ${establishment.name}`}
              width={96}
              height={96}
              className="public-hub__logo"
              priority
            />
          )}
          <div>
            <p className="public-hub__eyebrow">Bem-vindo ao</p>
            <h1>{establishment.name}</h1>
            <p className="public-hub__tagline">Boa comida. Música boa.</p>
          </div>
        </div>
        {establishment.slug === "relicas" && <span className="public-hub__art-label">Arte ilustrativa</span>}
      </header>
      <section className="public-hub__destinations" aria-labelledby="hub-destinations-title">
        <div className="public-hub__inner public-hub__section-heading">
          <p className="public-hub__section-kicker">Explore</p>
          <h2 id="hub-destinations-title">O que você procura?</h2>
        </div>
        <Link className="public-hub__menu-link" href={`/${slug}/cardapio`}>
          <span className="public-hub__inner public-hub__menu-content">
            <span className="public-hub__menu-copy">
              <span className="public-hub__menu-label">Principal</span>
              <strong>Cardápio</strong>
              <span>Comidas, bebidas e preços atualizados</span>
            </span>
            <span className="public-hub__menu-arrow" aria-hidden="true">→</span>
          </span>
        </Link>
      </section>
      {(establishment.instagram || establishment.whatsapp) && (
        <footer className="public-hub__contacts">
          <div className="public-hub__inner public-hub__contacts-inner">
            <span>Acompanhe a casa</span>
            <nav aria-label="Contatos do estabelecimento">
              {establishment.instagram && <a href={`https://instagram.com/${establishment.instagram}`} target="_blank" rel="noreferrer">Instagram</a>}
              {establishment.whatsapp && <a href={`https://wa.me/${establishment.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>}
            </nav>
          </div>
        </footer>
      )}
    </main>
  );
}
