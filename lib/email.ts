const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL;

// Notification instantanée par email à chaque commande reçue, via l'API
// Resend (pas de SDK, un simple fetch). "onboarding@resend.dev" est
// l'expéditeur de test fourni par Resend : il marche sans vérifier de
// domaine tant que le destinataire est l'adresse du compte Resend.
export async function sendOrderEmail(subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY || !ORDER_NOTIFICATION_EMAIL) {
    return { ok: false, error: "RESEND_API_KEY / ORDER_NOTIFICATION_EMAIL non configurés sur Vercel." };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Siwakare <onboarding@resend.dev>",
        to: [ORDER_NOTIFICATION_EMAIL],
        subject,
        html,
      }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
