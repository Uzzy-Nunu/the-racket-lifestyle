"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();

    if (!email || !password) {
      setError("Enter your admin email and password.");
      return;
    }

    try {
      setPending(true);
      setError("");
      await login(email, password, "admin");
      router.push("/admin");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cobalt px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-cream p-8 shadow-2xl">
        <p className="eyebrow">Operations access</p>
        <h1 className="display mt-2 text-4xl">Admin sign in</h1>
        <p className="mt-3 text-sm text-ink/65">Use the local admin account or create a new account from the customer sign-up flow and promote it in the demo store.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <input name="email" type="email" placeholder="Email address" className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3" defaultValue="admin@theracketlifestyle.com" />
          <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3" defaultValue="admin123" />
          {error && <p className="rounded-xl bg-pink/15 p-3 text-sm">{error}</p>}
          <button disabled={pending} className="w-full rounded-full bg-lime px-5 py-3 text-sm font-bold disabled:opacity-60">
            {pending ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-ink/65">
          Back to the storefront <Link href="/" className="font-semibold text-cobalt">Return home</Link>
        </div>
      </div>
    </main>
  );
}
