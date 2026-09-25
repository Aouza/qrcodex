import contentStyles from "@/components/admin/admin-content.module.css";
import productStyles from "@/components/admin/admin-products.module.css";

export default function AdminEventsLoading() {
  return (
    <>
      <header className={contentStyles.heading}>
        <p className={contentStyles.eyebrow}>Agenda</p>
        <h1>Eventos</h1>
        <p>Carregando eventos do estabelecimento...</p>
      </header>
      <div className={productStyles.skeleton} aria-label="Carregando eventos">
        <span /><span /><span />
      </div>
    </>
  );
}
