import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const storePath = path.join(process.cwd(), "data", "store.json");

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

async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const fallback: StoreData = {
      products: [],
      users: [
        {
          id: "admin-1",
          name: "Operations Admin",
          email: "admin@theracketlifestyle.com",
          password: "admin123",
          role: "admin",
        },
      ],
    };
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeStore(data: StoreData) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(data, null, 2), "utf8");
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
        password,
        role: "customer",
      };

      store.users.push(user);
      await writeStore(store);

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    const matchingUser = store.users.find(
      (user) => user.email.toLowerCase() === email && user.password === password && (body.role ? user.role === body.role : true)
    );

    if (!matchingUser) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: matchingUser.id,
        name: matchingUser.name,
        email: matchingUser.email,
        role: matchingUser.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Authentication failed." }, { status: 500 });
  }
}
