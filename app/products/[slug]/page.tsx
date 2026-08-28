import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCart } from "@/components/add-to-cart";
import { getProduct } from "@/lib/products";
import { formatNaira } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-chalk">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="lg:py-6">
            <p className="eyebrow">{product.sport} / {product.category}</p>
            <h1 className="display mt-3 text-5xl">{product.name}</h1>
            <p className="mt-5 font-mono text-xl">
              {formatNaira(product.price)}
              {product.compareAt && <del className="ml-2 text-base text-ink/45">{formatNaira(product.compareAt)}</del>}
            </p>
            <p className="mt-7 text-lg leading-relaxed">{product.description}</p>
            <div className="mt-8 border-y py-6">
              <p className="text-sm font-bold">Every spec that matters, before you buy.</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-chalk p-3">
                    <dt className="text-xs uppercase tracking-wider text-ink/55">{label}</dt>
                    <dd className="mt-1 font-mono text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-7">
              <AddToCart product={product} />
              <p className="mt-3 text-center text-xs text-ink/60">Secure Paystack checkout. Delivery estimate shown at checkout.</p>
            </div>
            <details className="mt-8 border-b pb-4">
              <summary className="cursor-pointer font-semibold">Nigeria-wide delivery</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">Orders in Lagos and Abuja are delivered by local courier; nationwide deliveries include tracking. Exact options show before payment.</p>
            </details>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
