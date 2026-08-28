import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const { sport } = await searchParams;
  const products = await getProducts();
  const shown = sport ? products.filter((item: Product) => item.sport === sport) : products;

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-12">
        <p className="eyebrow">The collection</p>
        <h1 className="display mt-2 text-5xl">{sport ? `${sport} gear in Nigeria` : "Everything for the court."}</h1>
        <p className="mt-4 max-w-2xl">Thoughtful essentials for tennis, badminton and padel players. Clear specs, Nigeria-wide delivery, no guesswork.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {["all", "tennis", "badminton", "padel"].map((option) => (
            <a
              key={option}
              className={`rounded-full border px-4 py-2 text-sm capitalize ${(option === "all" && !sport) || sport === option ? "border-ink bg-ink text-cream" : "bg-cream"}`}
              href={option === "all" ? "/shop" : `/shop?sport=${option}`}
            >
              {option}
            </a>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
