import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-compatible token verification (uses Web Crypto API only).
// This avoids importing any Node-only crypto module from middleware so Next's
// edge runtime build does not trace server-only modules.

function base64urlToUint8Array(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  s += "=".repeat(pad);
  const bin = atob(s);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function uint8ArrayToBase64url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSha256Web(keyStr: string, dataStr: string) {
  const enc = new TextEncoder();
  const keyData = enc.encode(keyStr);
  const data = enc.encode(dataStr);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  return new Uint8Array(sig as ArrayBuffer);
}

async function verifyTokenEdge(token?: string | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  try {
    const secret = process.env.RKL_SECRET || "please-set-RKL_SECRET";
    const expected = await hmacSha256Web(secret, data);
    const sigBytes = base64urlToUint8Array(sig);
    if (expected.length !== sigBytes.length) return null;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ sigBytes[i];
    if (diff !== 0) return null;
    // decode payload
    const payloadJson = decodeURIComponent(escape(atob(data.replace(/-/g, "+").replace(/_/g, "/"))));
    const body = JSON.parse(payloadJson);
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Protect /admin routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const cookie = request.cookies.get("rkl_token")?.value || null;
    const payload = await verifyTokenEdge(cookie || undefined);
    if (!payload || payload.role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
