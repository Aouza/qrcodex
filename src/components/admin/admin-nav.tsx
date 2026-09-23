"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin-shell.module.css";

const items = [
  { href: "/admin", label: "Início", detail: "Visão geral" },
  { href: "/admin/products", label: "Produtos", detail: "Itens e preços" },
  { href: "/admin/categories", label: "Categorias", detail: "Organização" },
  { href: "/admin/settings", label: "Configurações", detail: "Estabelecimento" },
  { href: "/admin/account", label: "Conta", detail: "Senha e segurança" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Administração">
      {items.map((item) => {
        const active = item.href === "/admin"
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={styles.navLink}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
          >
            <span>{item.label}</span>
            <small>{item.detail}</small>
          </Link>
        );
      })}
    </nav>
  );
}
