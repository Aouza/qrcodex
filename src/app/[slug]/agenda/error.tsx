"use client";

export default function PublicAgendaError({ reset }: { reset: () => void }) {
  return (
    <main className="public-agenda public-agenda__error">
      <section className="public-agenda__inner" role="alert" aria-labelledby="agenda-error-title">
        <p className="public-agenda__kicker">Agenda</p>
        <h1 id="agenda-error-title">Não foi possível carregar os eventos.</h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <button type="button" onClick={() => reset()}>Tentar novamente</button>
      </section>
    </main>
  );
}
