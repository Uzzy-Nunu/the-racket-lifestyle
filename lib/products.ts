import { promises as fs } from "fs";
import path from "path";
import { Product } from "./types";

const seedProducts: Product[] = [
  { id: "p1", slug: "tourna-dry-tac-overgrip", name: "Tourna Dry Tac Overgrip", sport: "tennis", category: "Grips", description: "Tacky, absorbent overgrip for long Lagos court sessions.", price: 850000, compareAt: 950000, image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=900&q=85", badge: "Best seller", specs: { Feel: "Tacky", Pack: "3 grips", Colour: "Cobalt" }, inStock: true },
  { id: "p2", slug: "yonex-mavis-350-shuttlecocks", name: "Mavis 350 Shuttlecocks", sport: "badminton", category: "Shuttlecocks", description: "Consistent nylon shuttlecocks for club drills and match play.", price: 1650000, image: "https://images.unsplash.com/photo-1613918431703-aa50889e3be9?auto=format&fit=crop&w=900&q=85", badge: "New", specs: { Speed: "77", Material: "Nylon", Tube: "6 shuttles" }, inStock: true },
  { id: "p3", slug: "court-weekender-racket-bag", name: "Court Weekender Racket Bag", sport: "tennis", category: "Bags", description: "A considered carry for the court, commute and coffee after.", price: 2850000, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=85", specs: { Capacity: "2 rackets", Fabric: "Water-resistant", Colour: "Cream" }, inStock: true },
  { id: "p4", slug: "adidas-padel-crew-socks", name: "Padel Crew Socks", sport: "padel", category: "Apparel", description: "Cushioned crew socks designed for quick movement and long rallies.", price: 720000, image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=900&q=85", specs: { Size: "UK 6–11", Cushioning: "Medium", Pack: "2 pairs" }, inStock: true },
  { id: "p5", slug: "wilson-championship-tennis-balls", name: "Championship Tennis Balls", sport: "tennis", category: "Balls", description: "Reliable all-court balls for club nights and weekend sets.", price: 990000, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=85", specs: { Surface: "All court", Pack: "3 balls", Duty: "Extra" }, inStock: true },
  { id: "p6", slug: "precision-court-towel", name: "Precision Court Towel", sport: "padel", category: "Accessories", description: "Soft, compact and made to live in your kit bag.", price: 690000, image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=85", specs: { Fabric: "Cotton", Size: "70 × 40cm", Colour: "Pink" }, inStock: true },
];

const dataFile = path.join(process.cwd(), "data", "store.json");

async function ensureStoreFile(): Promise<Product[]> {
  try {
    const existing = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(existing) as { products?: Product[] };
    if (Array.isArray(parsed.products) && parsed.products.length > 0) {
      return parsed.products;
    }
  } catch {
    // fall through to initial seed
  }

  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  const payload = JSON.stringify({ products: seedProducts, users: [] }, null, 2);
  await fs.writeFile(dataFile, payload, "utf8");
  return seedProducts;
}

export async function getProducts(): Promise<Product[]> {
  return ensureStoreFile();
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product: Product) => product.slug === slug);
}

export const products: Product[] = seedProducts;
