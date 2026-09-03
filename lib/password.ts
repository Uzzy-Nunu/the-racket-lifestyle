import crypto from "crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  if (!storedPassword) return false;

  if (storedPassword.includes(":")) {
    const separatorIndex = storedPassword.indexOf(":");
    const salt = storedPassword.slice(0, separatorIndex);
    const hash = storedPassword.slice(separatorIndex + 1);

    if (!salt || !hash) return false;

    const derived = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
  }

  return storedPassword === password;
}
