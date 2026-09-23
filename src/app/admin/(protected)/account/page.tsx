import type { Metadata } from "next";
import { AccountPasswordForm } from "@/components/admin/account-password-form";
import styles from "@/components/admin/admin-content.module.css";

export const metadata: Metadata = {
  title: "Conta | Administração",
};

export default function AdminAccountPage() {
  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Segurança</p>
        <h1>Conta</h1>
        <p>Atualize sua senha e encerre acessos antigos à administração.</p>
      </header>
      <AccountPasswordForm />
    </>
  );
}
