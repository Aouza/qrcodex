"use client";

export default function PublicHubError({ reset }: { reset: () => void }) {
  return (
    <main className="public-menu public-menu__error">
      <section className="public-menu__inner" role="alert" aria-labelledby="hub-error-title">
        <h1 id="hub-error-title">Não foi possível carregar este estabelecimento.</h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <button type="button" onClick={() => reset()}>Tentar novamente</button>
      </section>
    </main>
  );
}
