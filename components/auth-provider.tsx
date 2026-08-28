"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type UserRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "racket-auth-user";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved) as AuthUser);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login: async (email: string, password: string, role: UserRole = "customer") => {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "login", email, password, role }),
        });
        const payload = (await response.json()) as { user?: AuthUser; error?: string };
        if (!response.ok || !payload.user) {
          throw new Error(payload.error ?? "Unable to sign in.");
        }
        setUser(payload.user);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.user));
      },
      signup: async (name: string, email: string, password: string) => {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "signup", name, email, password }),
        });
        const payload = (await response.json()) as { user?: AuthUser; error?: string };
        if (!response.ok || !payload.user) {
          throw new Error(payload.error ?? "Unable to create account.");
        }
        setUser(payload.user);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.user));
      },
      logout: () => {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
