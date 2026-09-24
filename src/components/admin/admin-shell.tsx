import type { ReactNode } from "react";
import Link from "next/link";
import { AdminNav } from "./admin-nav";
import { SignOutForm } from "./sign-out-form";
import styles from "./admin-shell.module.css";

type AdminShellProps = {
  establishment: {
    name: string;
    slug: string;
  };
  email: string | null;
  children: ReactNode;
};

export function AdminShell({ establishment, email, children }: AdminShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/admin" className={styles.brand}>
            <span>Relica&apos;s</span>
            <small>Administração</small>
          </Link>
          <Link href={`/${establishment.slug}/cardapio`} className={styles.menuLink}>
            Ver cardápio
          </Link>
        </div>
      </header>

      <div className={styles.mobileNav}>
        <AdminNav />
      </div>

      <div className={styles.frame}>
        <aside className={styles.sidebar}>
          <div className={styles.identity}>
            <p>Estabelecimento</p>
            <strong>{establishment.name}</strong>
          </div>
          <AdminNav />
          <div className={styles.account}>
            <span title={email ?? undefined}>{email ?? "Conta administrativa"}</span>
            <SignOutForm className={styles.signOut} />
          </div>
        </aside>

        <section className={styles.content}>{children}</section>
      </div>
    </main>
  );
}
