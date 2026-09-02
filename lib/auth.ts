import crypto from "crypto";

const SECRET = process.env.RKL_SECRET || "please-set-RKL_SECRET";
const TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

export type TokenPayload = { id: string; email: string; role: "customer" | "admin"; exp: number };

export function signToken(payload: Omit<TokenPayload, "exp">) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL;
  const body = { ...payload, exp } as TokenPayload;
  const data = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string | null | undefined): TokenPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  try {
    const body = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as TokenPayload;
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}
