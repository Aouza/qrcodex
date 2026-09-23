import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/admin/admin-content.module.css";
import categoryStyles from "@/components/admin/admin-categories.module.css";
import { loadAdminCategories } from "@/lib/admin/load-admin-categories";

export const metadata: Metadata = {
  title: "Categorias | Administração",
};

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  const [categories, query] = await Promise.all([loadAdminCategories(), searchParams]);
  if (!categories) return null;

  return <>
    <header className={styles.heading}><p className={styles.eyebrow}>Organização</p><h1>Categorias</h1><p>Gerencie as seções usadas para organizar o cardápio.</p></header>
    <div className={categoryStyles.toolbar}><Link href="/admin/categories/new">Nova categoria</Link></div>
    {(query.created === "1" || query.updated === "1") && <p className={categoryStyles.success} role="status">Categoria {query.created === "1" ? "criada" : "atualizada"} com sucesso.</p>}
    {categories.length ? <ul className={categoryStyles.list}>{categories.map((category) => <li key={category.id}>
      <Link href={`/admin/categories/${category.id}`} className={categoryStyles.category}>
        <Image src={category.imageUrl ?? "/images/categories/generic.webp"} alt="" width={52} height={52} />
        <span className={categoryStyles.identity}><strong>{category.name}</strong><small>/{category.slug}</small></span>
        <span className={categoryStyles.position}>Posição {category.position + 1}</span>
        <span className={categoryStyles.status} data-active={category.active || undefined}>{category.active ? "Ativa" : "Inativa"}</span>
        <span className={categoryStyles.edit}>Editar</span>
      </Link>
    </li>)}</ul> : <div className={categoryStyles.empty}><h2>Nenhuma categoria</h2><p>Crie a primeira categoria para começar a organizar os produtos.</p></div>}
  </>;
}
