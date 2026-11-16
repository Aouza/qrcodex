import Link from "next/link";
import { notFound } from "next/navigation";
import { localPocAllowed } from "@/lib/music/runtime";
import { YouTubePocRequestForm } from "@/components/youtube-poc/youtube-poc-request-form";

export default async function YouTubeMusicPocPage({ params }: { params: Promise<{ slug: string }> }) {
  if(!localPocAllowed())notFound();
  const { slug } = await params;

  return (
    <main className="youtube-poc">
      <header className="youtube-poc__header">
        <div className="youtube-poc__inner">
          <Link className="public-agenda__back" href={`/${slug}`}>
            <span aria-hidden="true">←</span> Inicio
          </Link>
          <p className="youtube-poc__kicker">Experimento</p>
          <h1>Pedir musica</h1>
          <p className="youtube-poc__intro">
            Busque um vídeo no YouTube e adicione à fila experimental de músicas.
          </p>
        </div>
      </header>

      <div className="youtube-poc__inner youtube-poc__content">
        <YouTubePocRequestForm slug={slug} />
      </div>
    </main>
  );
}
