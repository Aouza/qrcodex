import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";
import styles from "@/components/admin/admin-content.module.css";
import { createCategory } from "./actions";

export const metadata: Metadata = { title: "Nova categoria | Administração" };

export default function NewCategoryPage() {
  return <><header className={styles.heading}><p className={styles.eyebrow}>Organização</p><h1>Nova categoria</h1><p>Crie uma seção para organizar os produtos no cardápio.</p></header><CategoryForm action={createCategory} submitLabel="Criar categoria" /></>;
}
