import Link from "next/link";
import styles from "@/components/admin/admin-content.module.css";

export default function CategoryNotFound() {
  return <div className={styles.pending}><strong>Categoria não encontrada</strong><p>Ela não existe ou não pertence ao estabelecimento desta conta.</p><Link href="/admin/categories">Voltar para categorias</Link></div>;
}
