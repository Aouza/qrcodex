export default function PublicAgendaLoading() {
  return (
    <main className="public-agenda public-agenda--loading" role="status" aria-busy="true">
      <p className="public-menu__sr-only">Carregando agenda...</p>
      <header className="public-agenda__header"><div className="public-agenda__inner"><span className="public-menu__skeleton public-agenda__skeleton-back" /><span className="public-menu__skeleton public-agenda__skeleton-title" /></div></header>
      <div className="public-agenda__inner public-agenda__content" aria-hidden="true"><span className="public-menu__skeleton public-agenda__skeleton-heading" /><span className="public-menu__skeleton public-agenda__skeleton-card" /></div>
    </main>
  );
}
