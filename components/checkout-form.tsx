"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { formatNaira } from "@/lib/utils";
import { useCart } from "./cart-provider";

export function CheckoutForm() {
  const { items, total } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    if (!isAuthenticated || !user) {
      setError("Please login or create an account before making payment.");
      return;
    }

    setState("loading");
    setError("");

    const payload = {
      email: formData.get("email") || user.email,
      phone: formData.get("phone"),
      region: formData.get("region"),
      city: formData.get("city"),
      addressLine1: formData.get("address"),
      items: items.map(({ id, quantity }) => ({ productVariantId: id, quantity })),
    };

    const response = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setState("error");
      setError(result.error ?? "We could not start checkout.");
      return;
    }

    window.location.assign(result.authorizationUrl || `/order-confirmation?reference=${result.reference}`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_350px]">
      {!isAuthenticated && (
        <div className="rounded-2xl border border-cobalt/20 bg-cobalt/5 p-5 lg:col-span-2">
          <p className="eyebrow text-cobalt">Secure checkout</p>
          <h2 className="mt-2 text-2xl font-semibold">Please login or sign up to complete payment.</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/login?redirect=/checkout" className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink">Login</Link>
            <Link href="/signup?redirect=/checkout" className="rounded-full border border-ink px-5 py-3 text-sm font-bold">Create account</Link>
          </div>
        </div>
      )}

      <form action={submit} className="space-y-7">
        <section>
          <h2 className="font-semibold">Contact</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input required name="email" type="email" defaultValue={user?.email ?? ""} placeholder="Email address" className="rounded-xl border bg-cream px-4 py-3" />
            <input required name="phone" placeholder="Phone number" className="rounded-xl border bg-cream px-4 py-3" />
          </div>
        </section>

        <section>
          <h2 className="font-semibold">Delivery address</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <select required name="region" className="rounded-xl border bg-cream px-4 py-3">
              <option value="">Select state</option>
              <option>Lagos</option>
              <option>FCT Abuja</option>
              <option>Oyo</option>
              <option>Rivers</option>
              <option>Other</option>
            </select>
            <input required name="city" placeholder="City" className="rounded-xl border bg-cream px-4 py-3" />
            <input required name="address" placeholder="Street address" className="rounded-xl border bg-cream px-4 py-3 sm:col-span-2" />
          </div>
        </section>

        {error && <p className="rounded-xl bg-pink/20 p-4 text-sm">{error}</p>}

        <button disabled={state === "loading" || !items.length || !isAuthenticated} className="rounded-full bg-lime px-6 py-4 text-sm font-bold disabled:opacity-50">
          {state === "loading" ? "STARTING SECURE PAYMENT…" : "PAY SECURELY WITH PAYSTACK"}
        </button>
        <p className="text-xs text-ink/60">Your payment is processed by Paystack. We never store card details.</p>
      </form>

      <aside className="h-fit rounded-2xl bg-chalk p-6">
        <h2 className="font-semibold">Order summary</h2>
        {items.map((item) => (
          <div key={item.id} className="mt-4 flex justify-between gap-4 text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-mono">{formatNaira(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-5 flex justify-between border-t pt-5 font-semibold">
          <span>Total</span>
          <span className="font-mono">{formatNaira(total)}</span>
        </div>
      </aside>
    </div>
  );
}
