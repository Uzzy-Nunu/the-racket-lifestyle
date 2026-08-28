"use client";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "./cart-provider";
export function AddToCart({ product }: { product: Product }) { const { add } = useCart(); return <button onClick={() => add(product)} className="flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-4 text-sm font-bold hover:bg-[#d5e724]"><ShoppingBag size={18}/> ADD TO BAG</button>; }
