"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const emptyForm = {
  id: "",
  name: "",
  sport: "tennis",
  category: "Apparel",
  description: "",
  price: "",
  compareAt: "",
  image: "",
  badge: "",
  inStock: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProducts() {
    const response = await fetch("/api/products");
    const result = (await response.json()) as { data: Product[] };
    setProducts(result.data ?? []);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        id: form.id || `p-${Date.now()}`,
        price: Number(form.price || 0),
        compareAt: form.compareAt ? Number(form.compareAt) : undefined,
        slug: (form.name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        specs: {
          Category: form.category,
          Sport: form.sport,
          Status: form.inStock ? "In stock" : "Sold out",
        },
      };

      const method = form.id ? "PUT" : "POST";
      const response = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to save product.");
      }

      setForm(emptyForm);
      await loadProducts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      await loadProducts();
    }
  }

  return (
    <main className="min-h-screen bg-chalk">
      <header className="border-b bg-cream">
        <div className="page-shell flex h-20 items-center justify-between">
          <Link href="/admin" className="font-display text-xl">THE RACKET<br />LIFESTYLE</Link>
          <Link href="/admin" className="rounded-full border border-ink px-4 py-2 text-xs font-bold uppercase">Back to dashboard</Link>
        </div>
      </header>

      <div className="page-shell py-10">
        <p className="eyebrow">Catalogue manager</p>
        <h1 className="display mt-2 text-5xl">Manage products</h1>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-cream p-6">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Product name</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border bg-cream px-4 py-3" placeholder="Aero Court Tee" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Sport</label>
                <select value={form.sport} onChange={(event) => setForm({ ...form, sport: event.target.value as Product["sport"] })} className="w-full rounded-xl border bg-cream px-4 py-3">
                  <option value="tennis">Tennis</option>
                  <option value="padel">Padel</option>
                  <option value="badminton">Badminton</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Category</label>
                <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-xl border bg-cream px-4 py-3" placeholder="Apparel" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Description</label>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 w-full rounded-xl border bg-cream px-4 py-3" placeholder="Describe the fit, material, and court use." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Price (NGN)</label>
                <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full rounded-xl border bg-cream px-4 py-3" placeholder="250000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Compare-at</label>
                <input type="number" value={form.compareAt} onChange={(event) => setForm({ ...form, compareAt: event.target.value })} className="w-full rounded-xl border bg-cream px-4 py-3" placeholder="300000" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Image URL</label>
              <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="w-full rounded-xl border bg-cream px-4 py-3" placeholder="https://images.unsplash.com/..." />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">Badge</label>
              <input value={form.badge ?? ""} onChange={(event) => setForm({ ...form, badge: event.target.value })} className="w-full rounded-xl border bg-cream px-4 py-3" placeholder="Best seller" />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} />
              In stock
            </label>
            {error && <p className="rounded-xl bg-pink/15 p-3 text-sm">{error}</p>}
            <button disabled={saving} className="w-full rounded-full bg-lime px-5 py-3 text-sm font-bold disabled:opacity-60">
              {saving ? "Saving…" : form.id ? "Update product" : "Add product"}
            </button>
          </form>

          <div className="space-y-4">
            {products.map((product) => (
              <article key={product.id} className="rounded-[2rem] bg-cream p-5">
                <div className="flex gap-4">
                  <div className="relative h-28 w-24 overflow-hidden rounded-xl bg-chalk">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-cobalt">{product.sport}</p>
                        <h2 className="mt-1 font-semibold">{product.name}</h2>
                      </div>
                      <span className="rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase">{product.inStock ? "In stock" : "Sold out"}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink/70">{product.category}</p>
                    <p className="mt-2 font-mono text-sm">₦{(product.price / 100).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({
                      id: product.id,
                      name: product.name,
                      sport: product.sport,
                      category: product.category,
                      description: product.description,
                      price: String(product.price),
                      compareAt: product.compareAt ? String(product.compareAt) : "",
                      image: product.image,
                      badge: product.badge ?? "",
                      inStock: product.inStock,
                    })}
                    className="rounded-full border border-ink px-4 py-2 text-xs font-bold uppercase"
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => void handleDelete(product.id)} className="rounded-full bg-pink px-4 py-2 text-xs font-bold uppercase text-ink">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
