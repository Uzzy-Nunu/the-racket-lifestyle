import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-12">
        <section className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">About the brand</p>
            <h1 className="display mt-3 text-5xl">Built for players who live the rhythm of the court.</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/75">
              The Racket Lifestyle brings together performance kit, smart essentials, and a warm sense of community. We source what helps players feel sharper, move better, and look polished on and off the court.
            </p>
            <Link href="/shop" className="mt-8 inline-flex rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink">Shop the collection</Link>
          </div>
          <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] bg-chalk">
            <Image src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80" alt="Female tennis player serving" fill className="object-cover" />
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { title: "Club-minded", text: "We curate gear for real sessions, not just showroom beauty." },
            { title: "Nigeria-first", text: "Local delivery, informed pricing, and thoughtful fulfilment for Lagos and beyond." },
            { title: "Performance led", text: "From grips and strings to bags and towels, the details matter." },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] bg-chalk p-6">
              <p className="eyebrow">{item.title}</p>
              <p className="mt-4 text-base leading-relaxed text-ink/75">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
