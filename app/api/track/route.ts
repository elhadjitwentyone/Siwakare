import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Conversions API Meta : double du Pixel navigateur pour les événements qui
// se perdent (bloqueurs de pub, Safari/iOS 14+). Même event_id que le Pixel
// (voir lib/tracking.ts) pour que Meta déduplique au lieu de compter deux
// fois. Si le token n'est pas configuré, la route ne fait rien — le Pixel
// navigateur continue de fonctionner seul.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// Numéro sénégalais local (9 chiffres, ex: 77 000 00 00) -> indicatif 221
// ajouté, requis par Meta pour le hachage. Un numéro déjà international
// est laissé tel quel (chiffres seuls).
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("221")) return digits;
  if (digits.length === 9) return `221${digits}`;
  return digits;
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    return NextResponse.json({ skipped: true });
  }

  const body = await req.json().catch(() => null);
  if (!body?.event_name || !body?.event_id) {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const userData: Record<string, unknown> = {
    client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    client_user_agent: req.headers.get("user-agent") || undefined,
  };
  if (body.fbp) userData.fbp = body.fbp;
  if (body.fbc) userData.fbc = body.fbc;
  if (body.phone) {
    const normalized = normalizePhone(String(body.phone));
    if (normalized) userData.ph = [sha256(normalized)];
  }

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        action_source: "website",
        event_source_url: body.event_source_url || undefined,
        user_data: userData,
        custom_data: body.custom_data || {},
      },
    ],
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Meta Conversions API injoignable." }, { status: 502 });
  }
}
