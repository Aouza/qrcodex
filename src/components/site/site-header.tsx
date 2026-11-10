"use client";

import Image from "next/image";
import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";
import styles from "./site-header.module.css";

const links = [
  { href: "/", label: "Início", current: true },
  { href: "/relicas/agenda", label: "Agenda" },
  { href: "/relicas/cardapio", label: "Cardápio" },
  { href: "#a-casa", label: "A Casa" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
] as const;

function closeOnEscape(event: KeyboardEvent<HTMLDetailsElement>) {
  const menu = event.currentTarget;
  if (event.key === "Escape" && menu.open) {
    event.preventDefault();
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }
}

function closeOnNavigation(event: MouseEvent<HTMLAnchorElement>) {
  const menu = event.currentTarget.closest("details");
  if (menu) menu.open = false;
}

function NavigationLinks() {
  return (
    <ul className={styles.links}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-current={"current" in link ? "page" : undefined}
            className={styles.link}
            onClick={closeOnNavigation}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ReservationLink({ href }: { href?: string | null }) {
  return (
    <a
      href={href ?? "#contato"}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className={styles.reservation}
      onClick={closeOnNavigation}
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a9.9 9.9 0 0 0-8.6 14.9L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.3 8.3 0 1 1 12 20.3Zm4.6-6.2c-.3-.2-1.5-.8-1.8-.8-.2-.1-.4-.1-.5.1l-.8 1c-.2.1-.3.2-.6 0-1.5-.7-2.5-1.5-3.3-2.9-.2-.3 0-.4.1-.5l.6-.7c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.4-.3-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.2.2 1.8 2.7 4.3 3.8 1.6.7 2.3.8 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.5-.4Z" />
      </svg>
      Reserve sua mesa
    </a>
  );
}

export function SiteHeader({ reservationHref }: { reservationHref?: string | null }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/images/logo/logo-site.png"
            alt="Relica’s Rock Bar — Início"
            width={144}
            height={72}
            sizes="(max-width: 959px) 120px, 144px"
          />
        </Link>
        <nav className={styles.desktop} aria-label="Navegação principal">
          <NavigationLinks />
        </nav>
        <div className={styles.desktopReservation}>
          <ReservationLink href={reservationHref} />
        </div>
        <details className={styles.mobile} onKeyDown={closeOnEscape}>
          <summary className={styles.toggle}>Menu</summary>
          <nav className={styles.panel} aria-label="Navegação principal">
            <NavigationLinks />
            <ReservationLink href={reservationHref} />
          </nav>
        </details>
      </div>
    </header>
  );
}
