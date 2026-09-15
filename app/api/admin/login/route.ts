import { NextRequest, NextResponse } from "next/server";
import {
  checkPassword,
  makeSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_ATTEMPTS_COOKIE,
  ADMIN_ATTEMPTS_WINDOW_MS,
  readAttempts,
  makeAttemptsToken,
  isLockedOut,
} from "@/lib/adminAuth";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  // Ralentit toute tentative, humaine ou automatisée — négligeable pour
  // une vraie connexion, dissuasif pour un script qui enchaîne les essais.
  await delay(500);

  const attempts = readAttempts(req.cookies.get(ADMIN_ATTEMPTS_COOKIE)?.value);
  if (isLockedOut(attempts)) {
    const waitMin = Math.max(1, Math.ceil((ADMIN_ATTEMPTS_WINDOW_MS - (Date.now() - attempts.firstAt)) / 60000));
    return NextResponse.json({ error: `Trop de tentatives. Réessaie dans ${waitMin} min.` }, { status: 429 });
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(password || "")) {
    const next = { count: attempts.count + 1, firstAt: attempts.firstAt || Date.now() };
    const res = NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    res.cookies.set(ADMIN_ATTEMPTS_COOKIE, makeAttemptsToken(next), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    return res;
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, makeSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  res.cookies.delete(ADMIN_ATTEMPTS_COOKIE);
  return res;
}
