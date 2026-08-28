"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "@/components/auth-provider";

function AuthFormContent({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const { login, signup } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const redirectTo = params.get("redirect") ?? "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please provide your details to continue.");
      return;
    }

    try {
      setPending(true);
      setError("");
      if (mode === "signup") {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      router.push(redirectTo);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-chalk px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-cream p-7 shadow-xl shadow-cobalt/5">
        <p className="eyebrow">The Racket Lifestyle</p>
        <h1 className="display mt-3 text-4xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-3 text-sm text-ink/65">
          {mode === "login" ? "Sign in to unlock saved favourites and checkout in minutes." : "Start shopping for tennis, badminton, and padel essentials."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          {mode === "signup" && (
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Full name"
              className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 outline-none transition focus:border-cobalt"
            />
          )}

          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 outline-none transition focus:border-cobalt"
          />

          <input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Password"
            className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 outline-none transition focus:border-cobalt"
          />

          {error && <p className="rounded-xl bg-pink/15 p-3 text-sm text-ink">{error}</p>}

          <button disabled={pending} className="mt-2 w-full rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink disabled:opacity-60">
            {pending ? "Please wait…" : mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-ink/65">
          {mode === "login" ? (
            <>
              New here? <Link href="/signup" className="font-semibold text-cobalt">Create an account</Link>
            </>
          ) : (
            <>
              Already a member? <Link href="/login" className="font-semibold text-cobalt">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-chalk px-5 py-12"><div className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-cream p-7 shadow-xl shadow-cobalt/5">Loading…</div></div>}>
      <AuthFormContent mode={mode} />
    </Suspense>
  );
}
