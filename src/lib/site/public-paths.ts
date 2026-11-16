export type PublicPathContext = { slug: string; mode: "site" | "slug" };
export type PublicPaths = { home: string; menu: string; agenda: string };

export function getPublicPaths({ slug, mode }: PublicPathContext): PublicPaths {
  if (typeof slug !== "string" || !slug || [".", ".."].includes(slug) || /[/\\\u0000-\u001f\u007f]/.test(slug)
    || !["site", "slug"].includes(mode) || (mode === "site" && slug !== "relicas")) {
    throw new Error("Invalid public navigation context.");
  }
  const base = mode === "site" ? "" : `/${encodeURIComponent(slug)}`;
  return { home: base || "/", menu: `${base}/cardapio`, agenda: `${base}/agenda` };
}
