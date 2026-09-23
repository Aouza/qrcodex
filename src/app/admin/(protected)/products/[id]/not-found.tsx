import Link from "next/link";
import styles from "@/components/admin/admin-content.module.css";

export default function ProductNotFound() {
  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Cardápio</p>
        <h1>Produto não encontrado</h1>
        <p>Este produto não existe ou não está disponível para esta conta.</p>
      </header>
      <div className={styles.pending}>
        <Link href="/admin/products">Voltar para produtos</Link>
      </div>
    </>
  );
}
