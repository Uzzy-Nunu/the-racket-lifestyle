"use client";

import { useAuth } from "@/components/auth-provider";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      return;
    }
    router.replace("/admin/login");
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
