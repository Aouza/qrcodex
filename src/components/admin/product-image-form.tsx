"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  removeProductImage,
  uploadProductImage,
  type ProductImageState,
} from "@/app/admin/(protected)/products/[id]/image-actions";
import styles from "./product-image-form.module.css";

const initialState: ProductImageState = { status: "idle" };

function UploadButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Enviando..." : "Salvar imagem"}</button>;
}

function RemoveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Removendo..." : "Remover imagem"}</button>;
}

export function ProductImageForm({
  productId,
  productName,
  imageUrl,
}: {
  productId: string;
  productName: string;
  imageUrl: string | null;
}) {
  const uploadAction = uploadProductImage.bind(null, productId);
  const removeAction = removeProductImage.bind(null, productId);
  const [uploadState, uploadFormAction] = useActionState(uploadAction, initialState);
  const [removeState, removeFormAction] = useActionState(removeAction, initialState);
  const message = uploadState.message ?? removeState.message;
  const failed = uploadState.status === "error" || removeState.status === "error";

  return (
    <section className={styles.section} aria-labelledby="product-image-title">
      <div>
        <p className={styles.eyebrow}>Imagem</p>
        <h2 id="product-image-title">Foto do produto</h2>
        <p>JPEG, PNG ou WebP de até 768 KB.</p>
      </div>
      <div className={styles.editor}>
        <Image
          className={styles.preview}
          src={imageUrl ?? "/images/categories/generic.webp"}
          alt={imageUrl ? productName : "Produto sem imagem"}
          width={160}
          height={160}
          sizes="160px"
        />
        <div className={styles.controls}>
          <form action={uploadFormAction}>
            <label htmlFor="product-image">Selecionar imagem</label>
            <input id="product-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
            <UploadButton />
          </form>
          {imageUrl && <form action={removeFormAction} className={styles.remove}><RemoveButton /></form>}
          {message && <p role={failed ? "alert" : "status"} data-error={failed || undefined}>{message}</p>}
        </div>
      </div>
    </section>
  );
}
