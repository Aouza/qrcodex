"use client";

export default function PublicMenuError({ reset }: { reset: () => void }) {
  return (
    <main className="public-menu public-menu__error">
      <section className="public-menu__inner" role="alert" aria-labelledby="menu-error-title">
        <h1 id="menu-error-title">Não foi possível carregar o cardápio.</h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <button type="button" onClick={() => reset()}>Tentar novamente</button>
      </section>
    </main>
  );
}
