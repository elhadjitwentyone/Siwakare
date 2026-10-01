import crypto from "crypto";

// Helpers partagés pour la Conversions API Meta (côté serveur uniquement).
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

export const isMetaCapiConfigured = () => Boolean(PIXEL_ID && CAPI_TOKEN);

export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// Numéro sénégalais local (9 chiffres, ex: 77 000 00 00) -> indicatif 221
// ajouté, requis par Meta pour le hachage. Un numéro déjà international
// est laissé tel quel (chiffres seuls).
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("221")) return digits;
  if (digits.length === 9) return `221${digits}`;
  return digits;
}

export async function sendMetaEvents(events: Record<string, unknown>[]): Promise<{ ok: boolean; error?: string }> {
  if (!PIXEL_ID || !CAPI_TOKEN) return { ok: false, error: "Pixel / token Conversions API non configurés." };
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: events }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch {
    return { ok: false, error: "Meta Conversions API injoignable." };
  }
}
