import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./auth-shell.module.css";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  footerHref?: string;
  footerLabel?: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footerHref = "/relicas/cardapio",
  footerLabel = "Ver cardápio",
}: AuthShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/relicas" className={styles.brand}>Relica&apos;s</Link>
          <span className={styles.context}>Administração</span>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.panel} aria-labelledby="auth-title">
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id="auth-title">{title}</h1>
          <div className={styles.description}>{description}</div>
          {children}
        </section>

        <Link href={footerHref} className={styles.footerLink}>
          {footerLabel}
        </Link>
      </div>
    </main>
  );
}
