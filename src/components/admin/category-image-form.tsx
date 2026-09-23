"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { removeCategoryImage, uploadCategoryImage, type CategoryImageState } from "@/app/admin/(protected)/categories/[id]/image-actions";
import styles from "./product-image-form.module.css";

const initialState: CategoryImageState = { status: "idle" };
function ActionButton({ busy, ready }: { busy: string; ready: string }) { const { pending } = useFormStatus(); return <button type="submit" disabled={pending}>{pending ? busy : ready}</button>; }

export function CategoryImageForm({ categoryId, categoryName, imageUrl, fallbackUrl }: { categoryId: string; categoryName: string; imageUrl: string | null; fallbackUrl: string }) {
  const [uploadState, uploadAction] = useActionState(uploadCategoryImage.bind(null, categoryId), initialState);
  const [removeState, removeAction] = useActionState(removeCategoryImage.bind(null, categoryId), initialState);
  const message = uploadState.message ?? removeState.message;
  const failed = uploadState.status === "error" || removeState.status === "error";
  return <section className={styles.section} aria-labelledby="category-image-title"><div><p className={styles.eyebrow}>Imagem</p><h2 id="category-image-title">Ilustração da categoria</h2><p>JPEG, PNG ou WebP de até 768 KB.</p></div><div className={styles.editor}>
    <Image className={styles.preview} src={imageUrl ?? fallbackUrl} alt={imageUrl ? categoryName : "Ilustração padrão da categoria"} width={160} height={160} sizes="160px" />
    <div className={styles.controls}><form action={uploadAction}><label htmlFor="category-image">Selecionar imagem</label><input id="category-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required /><ActionButton busy="Enviando..." ready="Salvar imagem" /></form>
    {imageUrl && <form action={removeAction} className={styles.remove}><ActionButton busy="Removendo..." ready="Usar imagem padrão" /></form>}
    {message && <p role={failed ? "alert" : "status"} data-error={failed || undefined}>{message}</p>}</div>
  </div></section>;
}
