import { notFound } from "next/navigation";
import { loadPublicMenu } from "@/lib/menu/load-public-menu";

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const menu = await loadPublicMenu(slug);

  if (!menu) {
    notFound();
  }

  const productCount = menu.categories.reduce(
    (count, category) => count + category.products.length,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10">
      <h1 className="break-words text-2xl font-semibold">
        {menu.establishment.name}
      </h1>
      <p className="mt-3 text-sm text-neutral-600">
        {menu.categories.length}{" "}
        {menu.categories.length === 1 ? "categoria" : "categorias"},{" "}
        {productCount} {productCount === 1 ? "produto" : "produtos"}
      </p>
    </main>
  );
}
