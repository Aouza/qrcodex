"use client";

import Image from "next/image";
import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";
import { siteNavigation } from "@/lib/site/navigation";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./site-header.module.css";

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
      {siteNavigation.map((link) => (
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
      className={`${ui.button} ${styles.reservation}`}
      onClick={closeOnNavigation}
    >
      <SiteIcon name="calendar" />
      Reserve sua mesa
      <SiteIcon name="arrow" size={18} />
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
            width={128}
            height={64}
            sizes="128px"
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
