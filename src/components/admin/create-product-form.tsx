"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProduct, type CreateProductState } from "@/app/admin/(protected)/products/new/actions";
import type { AdminCategory } from "@/lib/admin/load-admin-products";
import styles from "./product-form.module.css";

const initialState: CreateProductState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Salvando..." : "Criar produto"}</button>;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className={styles.fieldError}>{message}</p> : null;
}

export function CreateProductForm({ categories }: { categories: AdminCategory[] }) {
  const [state, action] = useActionState(createProduct, initialState);

  return (
    <form action={action} className={styles.form} noValidate>
      {state.formError && <p className={styles.formError} role="alert">{state.formError}</p>}

      <div className={styles.field}>
        <label htmlFor="product-name">Nome</label>
        <input id="product-name" name="name" type="text" maxLength={120} required aria-invalid={Boolean(state.fieldErrors?.name)} aria-describedby={state.fieldErrors?.name ? "product-name-error" : undefined} />
        {state.fieldErrors?.name && <div id="product-name-error"><FieldError message={state.fieldErrors.name} /></div>}
      </div>

      <div className={styles.field}>
        <label htmlFor="product-description">Descrição <span>Opcional</span></label>
        <textarea id="product-description" name="description" rows={4} maxLength={500} aria-invalid={Boolean(state.fieldErrors?.description)} aria-describedby={state.fieldErrors?.description ? "product-description-error" : undefined} />
        {state.fieldErrors?.description && <div id="product-description-error"><FieldError message={state.fieldErrors.description} /></div>}
      </div>

      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor="product-price">Preço</label>
          <div className={styles.priceField}>
            <span>R$</span>
            <input id="product-price" name="price" type="text" inputMode="decimal" placeholder="19,90" required aria-invalid={Boolean(state.fieldErrors?.price)} aria-describedby={state.fieldErrors?.price ? "product-price-error" : "product-price-help"} />
          </div>
          <p id="product-price-help" className={styles.help}>Use vírgula ou ponto para os centavos.</p>
          {state.fieldErrors?.price && <div id="product-price-error"><FieldError message={state.fieldErrors.price} /></div>}
        </div>

        <div className={styles.field}>
          <label htmlFor="product-category">Categoria</label>
          <select id="product-category" name="categoryId" defaultValue="" required aria-invalid={Boolean(state.fieldErrors?.categoryId)} aria-describedby={state.fieldErrors?.categoryId ? "product-category-error" : undefined}>
            <option value="" disabled>Selecione</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          {state.fieldErrors?.categoryId && <div id="product-category-error"><FieldError message={state.fieldErrors.categoryId} /></div>}
        </div>
      </div>

      <fieldset className={styles.states}>
        <legend>Exibição</legend>
        <label><input name="available" type="checkbox" defaultChecked /><span><strong>Disponível</strong><small>Pode ser pedido agora</small></span></label>
        <label><input name="featured" type="checkbox" /><span><strong>Destaque</strong><small>Aparece na seção de destaques</small></span></label>
        <label><input name="active" type="checkbox" defaultChecked /><span><strong>Ativo</strong><small>Visível no cardápio público</small></span></label>
      </fieldset>

      <div className={styles.actions}>
        <Link href="/admin/products">Cancelar</Link>
        <SubmitButton />
      </div>
    </form>
  );
}
