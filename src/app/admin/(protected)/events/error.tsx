"use client";

import contentStyles from "@/components/admin/admin-content.module.css";
import productStyles from "@/components/admin/admin-products.module.css";

export default function AdminEventsError({ reset }: { reset: () => void }) {
  return (
    <>
      <header className={contentStyles.heading}>
        <p className={contentStyles.eyebrow}>Agenda</p>
        <h1>Eventos</h1>
        <p>Não foi possível carregar os eventos agora.</p>
      </header>
      <section className={productStyles.noResults} role="alert">
        <h2>Falha ao carregar eventos</h2>
        <p>Tente novamente em alguns instantes.</p>
        <button type="button" onClick={reset}>Tentar novamente</button>
      </section>
    </>
  );
}
