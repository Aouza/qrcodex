import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryImageForm } from "@/components/admin/category-image-form";
import styles from "@/components/admin/admin-content.module.css";
import { loadAdminCategory } from "@/lib/admin/load-admin-categories";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { getCategoryImage } from "@/lib/menu/get-category-image";
import { updateCategory } from "./actions";

export const metadata: Metadata = { title: "Editar categoria | Administração" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, access] = await Promise.all([loadAdminCategory(id), getAdminAccess()]);
  if (category === undefined) return null;
  if (!category) notFound();
  if (access.status !== "authorized") return null;
  return <><header className={styles.heading}><p className={styles.eyebrow}>Organização</p><h1>Editar categoria</h1><p>Atualize a identificação exibida no cardápio.</p></header><CategoryForm action={updateCategory.bind(null, id)} submitLabel="Salvar alterações" values={category} /><CategoryImageForm categoryId={id} categoryName={category.name} imageUrl={category.imageUrl} fallbackUrl={getCategoryImage(null, category.slug, access.establishment.slug)} /></>;
}
