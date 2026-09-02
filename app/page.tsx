import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

const sports = [
  { name: "Tennis", caption: "Club nights, league matches and weekend tournaments.", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=85" },
  { name: "Badminton", caption: "Fast rallies, tournament weekends, considered kit.", image: "https://images.unsplash.com/photo-1613918431703-aa50889e3be9?auto=format&fit=crop&w=900&q=85" },
  { name: "Padel", caption: "For the Tuesday regulars and the first-timers learning the walls.", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=85" },
];

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-shell py-6 sm:py-10">
          <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-transparent text-ink">
          <Image
            priority
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1800&q=90"
            alt="Black female tennis player serving on a real court"
            fill
            className="object-cover object-center"
          />
          <div className="relative z-10 flex min-h-[620px] max-w-2xl flex-col justify-end p-8 sm:p-14">
            <p className="eyebrow text-lime">Held and shipped from Nigeria</p>
            <h1 className="display mt-4 text-5xl leading-[.86] sm:text-7xl">GEAR FOR EVERY RALLY.</h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ink/90">
              Shop tennis, padel, pickleball and badminton essentials selected for players who care about performance, style and everything around the game.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink">shop all gear</Link>
            </div>
          </div>
          </div>
        </section>

        <section id="sports" className="page-shell py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Shop by sport</p>
              <h2 className="display mt-2 text-4xl">Your court, your kit.</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-2 text-sm font-semibold sm:flex">View all <ArrowRight size={17} /></Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {sports.map((sport) => (
              <Link key={sport.name} href={`/shop?sport=${sport.name.toLowerCase()}`} className="group relative min-h-80 overflow-hidden rounded-2xl bg-chalk">
                <Image src={sport.image} alt={sport.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent" />
                <div className="absolute bottom-0 p-6 text-cream">
                  <h3 className="display text-3xl">{sport.name}</h3>
                  <p className="mt-2 max-w-xs text-sm text-cream/85">{sport.caption}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-chalk py-16">
          <div className="page-shell">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow">The essentials</p>
                <h2 className="display mt-2 text-4xl">New on court.</h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold">Shop all</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 4).map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell grid gap-9 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Off-court, still in play</p>
            <h2 className="display mt-3 text-5xl">THE GAME DOESN'T END AT THE COURT.</h2>
            <p className="mt-6 max-w-lg leading-relaxed">The match is only part of it. It's the people you meet at the club, the drinks after the final point, the weekend tournament, and the stories you bring home. The Racket Lifestyle is built for everything that happens around the game, too.</p>
            <Link href="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-bold">DISCOVER THE LIFESTYLE <ArrowRight size={17} /></Link>
          </div>
          <div className="relative min-h-[390px] overflow-hidden rounded-2xl">
            <Image src="https://images.unsplash.com/photo-1546484959-f6f86a4f12c6?auto=format&fit=crop&w=1200&q=85" alt="Group of racket sport players socialising after a match" fill className="object-cover" />
          </div>
        </section>

        <section className="bg-pink py-16">
          <div className="page-shell grid gap-8 md:grid-cols-2">
            <div>
              <p className="eyebrow text-ink">Why players shop with us</p>
              <h2 className="display mt-2 text-4xl">The details matter.</h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Curated for tennis, badminton and padel",
                "Stock held and shipped from within Nigeria",
                "Precise product specs, not marketing fluff",
                "Secure Paystack checkout and tracking",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-medium">
                  <Check className="shrink-0" size={19} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
