"use client";

import { useEffect, useRef, useState } from "react";

type CategoryLink = {
  id: string;
  name: string;
};

export function CategoryNavigation({ categories }: { categories: CategoryLink[] }) {
  const [activeId, setActiveId] = useState(`category-${categories[0]?.id}`);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreScrollUntil = useRef(0);

  useEffect(() => {
    const syncFromHash = () => {
      const target = window.location.hash.slice(1);
      if (categories.some((category) => `category-${category.id}` === target)) {
        setActiveId(target);
      }
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

    if (window.location.hash) syncFromHash();
    else syncFromScroll();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
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
              {category.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
