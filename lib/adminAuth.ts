import crypto from "crypto";

const SESSION_COOKIE = "siwakare_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12h

function secret() {
  return process.env.ADMIN_PASSWORD || "";
}

export function makeSessionToken(): string {
  const expires = Date.now() + TTL_MS;
  const sig = crypto.createHmac("sha256", secret()).update(String(expires)).digest("hex");
  return `${expires}.${sig}`;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [expiresStr, sig] = token.split(".");
  if (!expiresStr || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(expiresStr).digest("hex");
  if (sig !== expected) return false;
  return Date.now() < Number(expiresStr);
}

export function checkPassword(password: string): boolean {
  if (!secret()) return false;
  return password === secret();
}

export const ADMIN_COOKIE_NAME = SESSION_COOKIE;
