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
      <header className="public-hub__header">
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
      {(establishment.instagram || establishment.whatsapp) && (
        <footer className="public-hub__inner public-hub__contacts">
          {establishment.instagram && <a href={`https://instagram.com/${establishment.instagram}`} target="_blank" rel="noreferrer">Instagram</a>}
          {establishment.whatsapp && <a href={`https://wa.me/${establishment.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>}
        </footer>
      )}
    </main>
  );
}
