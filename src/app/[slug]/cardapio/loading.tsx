export default function PublicMenuLoading() {
  return (
    <main className="public-menu public-menu__loading" role="status" aria-busy="true">
      <p className="public-menu__sr-only">Carregando cardápio...</p>
      <header className="public-menu__header" aria-hidden="true">
        <div className="public-menu__inner public-menu__identity">
          <span className="public-menu__skeleton public-menu__skeleton-logo" />
          <span className="public-menu__skeleton public-menu__skeleton-brand" />
        </div>
      </header>
      <div className="public-menu__inner" aria-hidden="true">
        <div className="public-menu__skeleton public-menu__skeleton-hero" />
        <div className="public-menu__skeleton public-menu__skeleton-label" />
        <div className="public-menu__skeleton public-menu__skeleton-search" />
        <div className="public-menu__skeleton public-menu__skeleton-title" />
      </div>
      <div className="public-menu__skeleton-nav" aria-hidden="true">
        <div className="public-menu__inner public-menu__skeleton-nav-inner">
          <span className="public-menu__skeleton" />
          <span className="public-menu__skeleton" />
          <span className="public-menu__skeleton" />
        </div>
      </div>
      <div className="public-menu__inner public-menu__skeleton-content" aria-hidden="true">
        <div className="public-menu__skeleton public-menu__skeleton-heading" />
        {[0, 1].map((item) => (
          <div className="public-menu__skeleton-row" key={item}>
            <span className="public-menu__skeleton public-menu__skeleton-thumbnail" />
            <span className="public-menu__skeleton-copy">
              <span className="public-menu__skeleton public-menu__skeleton-line" />
              <span className="public-menu__skeleton public-menu__skeleton-line public-menu__skeleton-line--short" />
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
