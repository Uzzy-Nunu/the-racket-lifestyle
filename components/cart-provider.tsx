"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { CartItem, Product } from "@/lib/types";
type CartContextValue = { items: CartItem[]; add: (product: Product) => void; remove: (id: string) => void; update: (id: string, quantity: number) => void; total: number; count: number };
const CartContext = createContext<CartContextValue | undefined>(undefined);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo(() => ({ items, add: (product: Product) => setItems((current) => { const found = current.find((item) => item.id === product.id); return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]; }), remove: (id: string) => setItems((current) => current.filter((item) => item.id !== id)), update: (id: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item)), total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), count: items.reduce((sum, item) => sum + item.quantity, 0) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }
