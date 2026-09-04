const SECRET = process.env.RKL_SECRET || "please-set-RKL_SECRET";
const TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

export type TokenPayload = { id: string; email: string; role: "customer" | "admin"; exp: number };

function base64urlEncode(buffer: Uint8Array | Buffer) {
  if (typeof window === "undefined" && (Buffer as any).from) {
    return Buffer.from(buffer).toString("base64url");
  }
  // browser
  return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecodeToUint8Array(s: string) {
  // Node Buffer supports base64url via from with base64url, but to keep consistent decode manually
  if (typeof window === "undefined" && (Buffer as any).from) {
    const b = Buffer.from(s, "base64url");
    return new Uint8Array(b);
  }
  // browser
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  s += "=".repeat(pad);
  const bin = atob(s);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function hmacSha256(dataStr: string) {
  const enc = new TextEncoder();
  const data = enc.encode(dataStr);

  if (typeof globalThis?.crypto?.subtle?.importKey === "function") {
    const keyData = new TextEncoder().encode(SECRET);
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"] as any);
    const sig = await crypto.subtle.sign("HMAC", key as any, data as any);
    return new Uint8Array(sig as ArrayBuffer);
  }

  // Fallback to Node's crypto for non-edge environments
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = await import("crypto");
  const sig = nodeCrypto.createHmac("sha256", SECRET).update(dataStr).digest();
  return new Uint8Array(sig);
}

export async function signToken(payload: Omit<TokenPayload, "exp">) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL;
  const body = { ...payload, exp } as TokenPayload;
  const data = (typeof Buffer !== "undefined" ? Buffer.from(JSON.stringify(body)).toString("base64url") : base64urlEncode(new TextEncoder().encode(JSON.stringify(body))));
  const sigBytes = await hmacSha256(data);
  const sig = (typeof Buffer !== "undefined" ? Buffer.from(sigBytes).toString("base64url") : base64urlEncode(sigBytes));
  return `${data}.${sig}`;
}

export async function verifyToken(token: string | null | undefined): Promise<TokenPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedBytes = await hmacSha256(data);
  const sigBytes = base64urlDecodeToUint8Array(sig);

  // timingSafeEqual for Node
  if (typeof (globalThis as any).Buffer !== "undefined") {
    const bufExpected = Buffer.from(expectedBytes);
    const bufSig = Buffer.from(sigBytes);
    try {
      if (bufExpected.length !== bufSig.length) return null;
      const nodeCrypto = await import("crypto");
      if (!nodeCrypto.timingSafeEqual(bufExpected, bufSig)) return null;
    } catch {
      return null;
    }
  } else {
    // browser compare
    if (expectedBytes.length !== sigBytes.length) return null;
    let diff = 0;
    for (let i = 0; i < expectedBytes.length; i++) diff |= expectedBytes[i] ^ sigBytes[i];
    if (diff !== 0) return null;
  }

  try {
    const bodyText = (typeof Buffer !== "undefined") ? Buffer.from(data, "base64url").toString("utf8") : new TextDecoder().decode(base64urlDecodeToUint8Array(data));
    const body = JSON.parse(bodyText) as TokenPayload;
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}
