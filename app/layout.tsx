import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = { title: "The Racket Lifestyle | Nigeria", description: "Premium tennis, badminton and padel gear in Nigeria." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider><CartProvider>{children}</CartProvider></AuthProvider></body></html>;
}
