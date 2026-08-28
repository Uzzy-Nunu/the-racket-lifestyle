import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { const product = getProduct((await params).slug); return product ? NextResponse.json({ data: product }) : NextResponse.json({ error: "Product not found" }, { status: 404 }); }
