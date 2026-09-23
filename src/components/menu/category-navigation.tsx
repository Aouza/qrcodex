"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getCategoryImage } from "@/lib/menu/get-category-image";

type CategoryLink = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

export function CategoryNavigation({
  categories,
  establishmentSlug,
}: {
  categories: CategoryLink[];
  establishmentSlug: string;
}) {
  const [activeId, setActiveId] = useState(`category-${categories[0]?.id}`);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreScrollUntil = useRef(0);

  useEffect(() => {
    const syncFromHash = () => {
      const target = window.location.hash.slice(1);
      if (categories.some((category) => `category-${category.id}` === target)) {
        setActiveId(target);
        return true;
      }
      return false;
    };

    const syncFromScroll = () => {
      if (Date.now() < ignoreScrollUntil.current) return;

      const navBottom = scrollerRef.current?.getBoundingClientRect().bottom ?? 0;
      let current: string | undefined = categories[0]?.id;
      for (const category of categories) {
        const section = document.getElementById(`category-${category.id}`);
        if (section && section.getBoundingClientRect().top <= navBottom + 24) {
          current = category.id;
        }
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = categories.at(-1)?.id;
      }
      if (current) setActiveId(`category-${current}`);
    };

    if (!syncFromHash()) syncFromScroll();
    const onHashChange = () => {
      if (!syncFromHash()) syncFromScroll();
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", syncFromScroll);
    };
  }, [categories]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector('a[aria-current="location"]');
    if (!scroller || !active) return;

    const left = active.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    const right = left + active.getBoundingClientRect().width;
    if (left < scroller.scrollLeft || right > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollTo({
        left: left - 16,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  }, [activeId]);

  return (
    <nav className="public-menu__category-nav" aria-label="Categorias">
      <div ref={scrollerRef} className="public-menu__inner public-menu__category-nav-inner">
        {categories.map((category) => {
          const target = `category-${category.id}`;
          const imageSrc = getCategoryImage(category.image_url, category.slug, establishmentSlug);
          return (
            <a
              key={category.id}
              href={`#${target}`}
              aria-current={activeId === target ? "location" : undefined}
              onClick={() => {
                ignoreScrollUntil.current = Date.now() + 600;
                setActiveId(target);
              }}
            >
              <span className="public-menu__category-image" aria-hidden="true">
                <Image src={imageSrc} alt="" width={64} height={64} />
              </span>
              <span className="public-menu__category-label">{category.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
