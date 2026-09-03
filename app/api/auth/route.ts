import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

const storePath = path.join(process.cwd(), "data", "store.json");
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@theracketlifestyle.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

type Role = "customer" | "admin";

type StoreUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

type StoreData = {
  products: unknown[];
  users: StoreUser[];
};

let memoryStore: StoreData | null = null;

async function ensureDefaultAdmin(store: StoreData) {
  const adminEmail = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();
  const adminUser = store.users.find((user) => user.email.toLowerCase() === adminEmail);

  if (adminUser) {
    if (!adminUser.password.includes(":")) {
      adminUser.password = hashPassword(DEFAULT_ADMIN_PASSWORD);
    }
    adminUser.role = "admin";
    return;
  }

  store.users.push({
    id: "admin-1",
    name: "Operations Admin",
    email: adminEmail,
    password: hashPassword(DEFAULT_ADMIN_PASSWORD),
    role: "admin",
  });
}

async function readStore(): Promise<StoreData> {
  if (memoryStore) return memoryStore;
  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    await ensureDefaultAdmin(parsed);
    memoryStore = parsed;
    return parsed;
  } catch {
    // fallback to seed in-memory store (safe for serverless/read-only mounts)
    const fallback: StoreData = {
      products: [],
      users: [],
    };
    await ensureDefaultAdmin(fallback);
    memoryStore = fallback;
    try {
      await fs.mkdir(path.dirname(storePath), { recursive: true });
      await fs.writeFile(storePath, JSON.stringify(fallback, null, 2), "utf8");
    } catch (err) {
      // writing failed (likely read-only FS in serverless). continue with in-memory store.
      // console.warn("Could not persist store to disk, using in-memory fallback.", err);
    }
    return fallback;
  }
}

async function writeStore(data: StoreData) {
  memoryStore = data;
  try {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Could not write to disk (read-only). Keep in-memory and continue.
    // console.warn("writeStore: falling back to in-memory store", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: "login" | "signup";
      name?: string;
      email?: string;
      password?: string;
      role?: Role;
    };

    if (!body.action || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing required details." }, { status: 400 });
    }

    const store = await readStore();
    const email = body.email.trim().toLowerCase();
    const password = body.password.trim();

    if (body.action === "signup") {
      if (!body.name) {
        return NextResponse.json({ error: "A full name is required." }, { status: 400 });
      }
      if (store.users.some((user) => user.email.toLowerCase() === email)) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }

      const user: StoreUser = {
        id: `user-${Date.now()}`,
        name: body.name.trim(),
        email,
        password: hashPassword(password),
        role: "customer",
      };

      store.users.push(user);
      await writeStore(store);

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
      res.headers.append("Set-Cookie", `rkl_token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`);
      return res;
    }

    const matchingUser = store.users.find((user) => user.email.toLowerCase() === email && (body.role ? user.role === body.role : true));

    if (!matchingUser) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const isValidPassword = verifyPassword(password, matchingUser.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    if (!matchingUser.password.includes(":")) {
      matchingUser.password = hashPassword(password);
      await writeStore(store);
    }

    const token = signToken({ id: matchingUser.id, email: matchingUser.email, role: matchingUser.role });
    const res = NextResponse.json({ user: { id: matchingUser.id, name: matchingUser.name, email: matchingUser.email, role: matchingUser.role } });
    res.headers.append("Set-Cookie", `rkl_token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`);
    return res;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Authentication failed." }, { status: 500 });
  }
}
