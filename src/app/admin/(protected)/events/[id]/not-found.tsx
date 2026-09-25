import Link from "next/link";
import styles from "@/components/admin/admin-content.module.css";

export default function EventNotFound() {
  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Agenda</p>
        <h1>Evento não encontrado</h1>
        <p>Este evento não existe ou não está disponível para esta conta.</p>
      </header>
      <div className={styles.pending}>
        <Link href="/admin/events">Voltar para eventos</Link>
      </div>
    </>
  );
}
