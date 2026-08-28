"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-provider";

const shopLinks = [
  { label: "Shop all products", href: "/shop" },
  { label: "Tennis", href: "/shop?sport=tennis" },
  { label: "Padel", href: "/shop?sport=padel" },
  { label: "Badminton", href: "/shop?sport=badminton" },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", dropdown: shopLinks },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-xs text-cream">Complimentary delivery in Lagos and Abuja on orders above ₦25,000.</div>
      <header className="sticky top-0 z-40 border-b bg-cream/95 backdrop-blur">
        <div className="page-shell flex h-20 items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl leading-none">THE RACKET<br />LIFESTYLE</Link>

          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="group relative">
                  <Link href={item.href} className="inline-flex items-center gap-1">
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="min-w-52 rounded-2xl border bg-cream p-2 shadow-lg">
                      {item.dropdown.map((link) => (
                        <Link key={link.label} href={link.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-chalk">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/shop" aria-label="Search">
              <Search size={19} />
            </Link>
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag size={19} />
              {count > 0 && <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold">{count}</span>}
            </Link>
            <Link href="/login" className="hidden rounded-full border border-ink px-3 py-2 text-xs font-bold uppercase sm:inline-flex">
              Login
            </Link>
            <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t bg-cream px-5 py-5 lg:hidden">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="border-b py-3">
                  <Link href={item.href} className="block font-medium" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                  <div className="mt-2 space-y-2 pl-3 text-sm text-ink/70">
                    {item.dropdown.map((link) => (
                      <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="block py-1">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.label} onClick={() => setOpen(false)} className="block border-b py-3 font-medium" href={item.href}>
                  {item.label}
                </Link>
              )
            )}
          </nav>
        )}
      </header>
    </>
  );
}
