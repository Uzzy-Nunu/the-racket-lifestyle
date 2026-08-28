export type Sport = "tennis" | "badminton" | "padel";
export type Product = { id: string; slug: string; name: string; sport: Sport; category: string; description: string; price: number; compareAt?: number; image: string; badge?: string; specs: Record<string, string>; inStock: boolean };
export type CartItem = Product & { quantity: number };
