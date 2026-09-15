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

// Anti-brute-force sur /api/admin/login : pas de base de données, donc le
// compteur de tentatives vit dans un cookie signé (même logique que le
// jeton de session) plutôt que dans un store externe. Limite : c'est
// par navigateur, pas par IP — un attaquant qui vide ses cookies repart
// à zéro. Ça reste un frein réel contre un script naïf qui rejoue le
// même cookie/session.
export const ADMIN_ATTEMPTS_COOKIE = "siwakare_admin_attempts";
export const ADMIN_MAX_ATTEMPTS = 5;
export const ADMIN_ATTEMPTS_WINDOW_MS = 15 * 60 * 1000;

export type AttemptState = { count: number; firstAt: number };

export function readAttempts(token: string | undefined): AttemptState {
  if (!token) return { count: 0, firstAt: 0 };
  const [countStr, firstAtStr, sig] = token.split(".");
  if (!countStr || !firstAtStr || !sig) return { count: 0, firstAt: 0 };
  const expected = crypto.createHmac("sha256", secret()).update(`${countStr}.${firstAtStr}`).digest("hex");
  if (sig !== expected) return { count: 0, firstAt: 0 };
  const state = { count: Number(countStr), firstAt: Number(firstAtStr) };
  if (!Number.isFinite(state.count) || !Number.isFinite(state.firstAt)) return { count: 0, firstAt: 0 };
  if (Date.now() - state.firstAt > ADMIN_ATTEMPTS_WINDOW_MS) return { count: 0, firstAt: 0 };
  return state;
}

export function makeAttemptsToken(state: AttemptState): string {
  const payload = `${state.count}.${state.firstAt}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isLockedOut(state: AttemptState): boolean {
  return state.count >= ADMIN_MAX_ATTEMPTS;
}
