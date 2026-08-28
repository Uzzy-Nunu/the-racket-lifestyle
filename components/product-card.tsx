import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
export function ProductCard({ product }: { product: Product }) { return <article className="group"><Link href={`/products/${product.slug}`}><div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-chalk"><Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105"/>{product.badge && <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase">{product.badge}</span>}</div><p className="mt-4 text-xs uppercase tracking-widest text-cobalt">{product.sport} / {product.category}</p><h3 className="mt-1 font-semibold">{product.name}</h3><p className="mt-1 font-mono text-sm">{formatNaira(product.price)} {product.compareAt && <del className="ml-1 text-ink/45">{formatNaira(product.compareAt)}</del>}</p></Link></article>; }
