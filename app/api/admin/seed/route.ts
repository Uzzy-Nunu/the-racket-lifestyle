import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

const storePath = path.join(process.cwd(), "data", "store.json");

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      secret?: string;
      email?: string;
      password?: string;
      name?: string;
    };

    const expectedSecret = process.env.ADMIN_SEED_SECRET || process.env.RKL_SECRET || "local-seed-secret";
    if (body.secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid admin seed secret." }, { status: 401 });
    }

    const email = (body.email || process.env.ADMIN_EMAIL || "admin@theracketlifestyle.com").trim().toLowerCase();
    const password = body.password || process.env.ADMIN_PASSWORD || "admin123";
    const name = body.name || "Operations Admin";

    let store: { products: unknown[]; users: Array<{ id: string; name: string; email: string; password: string; role: "customer" | "admin" }> } = { products: [], users: [] };

    try {
      const raw = await fs.readFile(storePath, "utf8");
      store = JSON.parse(raw) as typeof store;
    } catch {
      // no existing store yet; create it on first seed.
    }

    const existingUser = store.users.find((user) => user.email.toLowerCase() === email);
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashPassword(password);
      existingUser.role = "admin";
    } else {
      store.users.push({
        id: `admin-${Date.now()}`,
        name,
        email,
        password: hashPassword(password),
        role: "admin",
      });
    }

    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      user: {
        email,
        role: "admin",
        passwordHint: "Use the supplied password or set ADMIN_PASSWORD in your env file.",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to seed admin user." }, { status: 500 });
  }
}
