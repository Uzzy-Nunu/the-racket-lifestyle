import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const storePath = path.join(rootDir, "data", "store.json");

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@theracketlifestyle.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Operations Admin";

  let store = { products: [], users: [] };

  try {
    const raw = await fs.readFile(storePath, "utf8");
    store = JSON.parse(raw);
  } catch {
    // No existing store yet; continue with an empty default store.
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

  console.log(`Admin seeded successfully: ${email} / ${password}`);
  console.log(`Store written to ${storePath}`);
}

main().catch((error) => {
  console.error("Failed to seed admin user:", error);
  process.exit(1);
});
