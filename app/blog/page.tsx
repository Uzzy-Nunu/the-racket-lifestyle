import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const posts = [
  {
    title: "What to pack in your court bag for a tournament week",
    excerpt: "A compact guide to grips, towels, hydration, and the items you wish you had when your session runs long.",
    tag: "Essentials",
  },
  {
    title: "3 ways to level up your padel confidence in Lagos",
    excerpt: "From movement cues to positioning and racket setup, these easy changes help players feel more settled on court.",
    tag: "Padel",
  },
  {
    title: "Why racket care is part of performance",
    excerpt: "Storing your gear properly, replacing worn grips, and keeping strings in check protects both feel and longevity.",
    tag: "Care",
  },
];

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-12">
        <p className="eyebrow">Journal</p>
        <h1 className="display mt-3 text-5xl">Stories from the court.</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-[2rem] bg-chalk p-6">
              <span className="rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase">{post.tag}</span>
              <h2 className="mt-4 text-2xl font-semibold leading-tight">{post.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink/70">{post.excerpt}</p>
              <Link href="/shop" className="mt-5 inline-flex text-sm font-semibold text-cobalt">Read more</Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
