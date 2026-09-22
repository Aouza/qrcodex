import contentStyles from "@/components/admin/admin-content.module.css";
import productStyles from "@/components/admin/admin-products.module.css";

export default function AdminProductsLoading() {
  return (
    <>
      <header className={contentStyles.heading}>
        <p className={contentStyles.eyebrow}>Cardápio</p>
        <h1>Produtos</h1>
        <p>Carregando itens do estabelecimento...</p>
      </header>
      <div className={productStyles.skeleton} aria-label="Carregando produtos">
        <span /><span /><span />
      </div>
    </>
  );
}
