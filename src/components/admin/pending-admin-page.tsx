import styles from "./admin-content.module.css";

type PendingAdminPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  nextStep: string;
};

export function PendingAdminPage({
  eyebrow,
  title,
  description,
  nextStep,
}: PendingAdminPageProps) {
  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <div className={styles.pending} role="status">
        <strong>Área em preparação</strong>
        <p>{nextStep}</p>
      </div>
    </>
  );
}
