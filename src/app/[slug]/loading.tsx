export default function PublicHubLoading() {
  return (
    <main className="public-hub public-menu__loading" role="status" aria-busy="true">
      <p className="public-menu__sr-only">Carregando estabelecimento...</p>
      <header className="public-hub__hero public-hub__hero--loading" aria-hidden="true">
        <div className="public-hub__inner public-hub__identity">
          <span className="public-menu__skeleton public-menu__skeleton-logo" />
          <span className="public-menu__skeleton public-menu__skeleton-brand" />
        </div>
      </header>
      <div className="public-hub__loading-content" aria-hidden="true">
        <span className="public-menu__skeleton public-hub__skeleton-heading" />
        <span className="public-menu__skeleton public-hub__skeleton-action" />
      </div>
    </main>
  );
}
