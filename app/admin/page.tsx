import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Box, CreditCard, PackageCheck, Truck } from "lucide-react";
const metrics = [{ label: "Gross sales", value: "₦0", icon: CreditCard }, { label: "Paid orders", value: "0", icon: PackageCheck }, { label: "Fulfillment pending", value: "0", icon: Box }, { label: "Exceptions", value: "0", icon: AlertTriangle }];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-chalk">
      <header className="border-b bg-cream">
        <div className="page-shell flex h-20 items-center justify-between">
          <Link href="/" className="font-display text-xl">THE RACKET<br/>LIFESTYLE</Link>
          <p className="rounded-full bg-lime px-4 py-2 text-xs font-bold">OPERATIONS</p>
        </div>
      </header>

      <div className="page-shell py-10">
        <p className="eyebrow">Dashboard</p>
        <h1 className="display mt-2 text-5xl">Today at a glance.</h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <section key={label} className="rounded-2xl bg-cream p-5">
              <Icon size={20} className="text-cobalt" />
              <p className="mt-7 text-sm text-ink/65">{label}</p>
              <p className="mt-1 font-mono text-3xl">{value}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl bg-cream p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Fulfillment queue</h2>
              <Link href="/admin/orders" className="text-sm font-semibold text-cobalt">View orders</Link>
            </div>
            <div className="mt-6 grid place-items-center rounded-xl border border-dashed py-14 text-center">
              <Truck className="text-ink/35" />
              <p className="mt-3 font-semibold">No actions pending</p>
              <p className="mt-1 text-sm text-ink/55">Verified paid orders will appear here for fulfillment.</p>
            </div>
          </section>

          <section className="rounded-2xl bg-ink p-6 text-cream">
            <p className="eyebrow text-lime">Quick actions</p>
            <Link href="/admin/orders" className="mt-7 flex items-center justify-between border-b border-cream/20 pb-4 text-sm">Review orders <ArrowUpRight size={17} /></Link>
            <Link href="/admin/products" className="mt-4 flex items-center justify-between border-b border-cream/20 pb-4 text-sm">Manage catalogue <ArrowUpRight size={17} /></Link>
            <Link href="/admin/suppliers" className="mt-4 flex items-center justify-between pb-1 text-sm">Supplier mappings <ArrowUpRight size={17} /></Link>
          </section>
        </div>
      </div>
    </main>
  );
}
