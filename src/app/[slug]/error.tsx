"use client";

export default function PublicHubError({ reset }: { reset: () => void }) {
  return (
    <main className="public-hub public-hub__error">
      <section className="public-hub__inner" role="alert" aria-labelledby="hub-error-title">
        <p className="public-hub__eyebrow">Relica&apos;s Bar Hub</p>
        <h1 id="hub-error-title">Não foi possível carregar este estabelecimento.</h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <button type="button" onClick={() => reset()}>Tentar novamente</button>
      </section>
    </main>
  );
}
