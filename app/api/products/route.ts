import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

const dataFile = path.join(process.cwd(), "data", "store.json");

async function writeProducts(products: Product[]) {
  const store = await readStore();
  store.products = products;
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

async function readStore(): Promise<{ products: Product[]; users: unknown[] }> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as { products: Product[]; users: unknown[] };
  } catch {
    return { products: [], users: [] };
  }
}

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");
  const search = request.nextUrl.searchParams.get("q")?.toLowerCase();
  const products = await getProducts();
  const result = products.filter((product: Product) => (!sport || product.sport === sport) && (!search || `${product.name} ${product.description}`.toLowerCase().includes(search)));
  return NextResponse.json({ data: result });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Product & { id?: string; slug?: string; name: string };
  const products = await getProducts();
  const record: Product = {
    ...payload,
    id: payload.id ?? `p-${Date.now()}`,
    slug: payload.slug ?? payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    price: Number(payload.price ?? 0),
    compareAt: payload.compareAt ? Number(payload.compareAt) : undefined,
    inStock: payload.inStock ?? true,
    specs: payload.specs ?? {},
  };

  const next = [...products, record];
  await writeProducts(next);
  return NextResponse.json({ data: record }, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as Product & { id: string };
  const products = await getProducts();
  const next = products.map((product: Product) => (product.id === payload.id ? { ...product, ...payload, price: Number(payload.price ?? product.price) } : product));
  await writeProducts(next);
  return NextResponse.json({ data: next.find((product: Product) => product.id === payload.id) });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as { id: string };
  const products = await getProducts();
  const next = products.filter((product: Product) => product.id !== payload.id);
  await writeProducts(next);
  return NextResponse.json({ data: next });
}
