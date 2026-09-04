import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { verifyToken } from "@/lib/auth";

const dataFile = path.join(process.cwd(), "data", "store.json");

let memoryStore: { products: Product[]; users: unknown[] } | null = null;

async function readStore(): Promise<{ products: Product[]; users: unknown[] }> {
  if (memoryStore) return memoryStore;
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as { products: Product[]; users: unknown[] };
    memoryStore = parsed;
    return parsed;
  } catch {
    const products = await getProducts();
    const fallback = { products, users: [] };
    memoryStore = fallback;
    try {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, JSON.stringify(fallback, null, 2), "utf8");
    } catch {
      // ignore write errors in read-only FS
    }
    return fallback;
  }
}

async function writeProducts(products: Product[]) {
  const store = await readStore();
  store.products = products;
  memoryStore = store;
  try {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // read-only FS: keep in-memory only
  }
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");
  const search = request.nextUrl.searchParams.get("q")?.toLowerCase();
  const products = await getProducts();
  const result = products.filter((product: Product) => (!sport || product.sport === sport) && (!search || `${product.name} ${product.description}`.toLowerCase().includes(search)));
  return NextResponse.json({ data: result });
}

async function requireAdmin(request: Request | NextRequest) {
  const header = (request as any).headers?.get?.("authorization") || (request as any).headers?.get?.("Authorization");
  const tokenHeader = header?.startsWith("Bearer ") ? header!.slice(7) : null;
  const cookieHeader = (request as any).headers?.get?.("cookie") || "";
  const cookieMatch = cookieHeader.split(";").map((s: string) => s.trim()).find((s: string) => s.startsWith("rkl_token="));
  const cookieToken = cookieMatch ? cookieMatch.split("=")[1] : null;
  const token = tokenHeader || cookieToken;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function POST(request: Request) {
  const payloadToken = await requireAdmin(request);
  if (!payloadToken) return unauthorized();

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
  const payloadToken = await requireAdmin(request);
  if (!payloadToken) return unauthorized();

  const payload = (await request.json()) as Product & { id: string };
  const products = await getProducts();
  const next = products.map((product: Product) => (product.id === payload.id ? { ...product, ...payload, price: Number(payload.price ?? product.price) } : product));
  await writeProducts(next);
  return NextResponse.json({ data: next.find((product: Product) => product.id === payload.id) });
}

export async function DELETE(request: Request) {
  const payloadToken = await requireAdmin(request);
  if (!payloadToken) return unauthorized();

  const payload = (await request.json()) as { id: string };
  const products = await getProducts();
  const next = products.filter((product: Product) => product.id !== payload.id);
  await writeProducts(next);
  return NextResponse.json({ data: next });
}
