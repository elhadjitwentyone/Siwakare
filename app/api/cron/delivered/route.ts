import { NextRequest, NextResponse } from "next/server";
import { getDeliveredOrdersToSend, markOrderSentToMeta } from "@/lib/notion";
import { isMetaCapiConfigured, normalizePhone, sendMetaEvents, sha256 } from "@/lib/meta";

export const dynamic = "force-dynamic";

// Nom de l'événement personnalisé reçu par Meta pour une commande livrée.
// Le Purchase du site part à la commande (paiement à la livraison) : celui-ci
// dit à Meta quelles commandes ont réellement été livrées et encaissées.
const EVENT_NAME = "CommandeLivree";

// Appelée une fois par jour par le cron Vercel (voir vercel.json) : envoie à
// Meta chaque commande passée à "Terminé" dans Notion et pas encore
// transmise, puis coche "Envoyé à Meta" pour ne jamais l'envoyer deux fois.
// ?dry=1 liste ce qui serait envoyé, sans rien envoyer ni cocher.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET non configuré." }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isMetaCapiConfigured()) {
    return NextResponse.json({ error: "Pixel / token Conversions API non configurés." }, { status: 503 });
  }

  const pending = await getDeliveredOrdersToSend();
  if ("error" in pending) return NextResponse.json({ error: pending.error }, { status: 502 });

  const dry = req.nextUrl.searchParams.get("dry") === "1";
  if (dry) {
    return NextResponse.json({ dry: true, toSend: pending.orders.length, total: pending.orders.reduce((s, o) => s + o.price, 0) });
  }

  let sent = 0;
  const skipped: string[] = [];
  const failed: string[] = [];
  for (const order of pending.orders) {
    const phone = normalizePhone(order.phone);
    if (!phone) {
      // Sans téléphone, Meta ne peut pas relier la commande à une personne.
      skipped.push(order.orderId || order.pageId);
      continue;
    }
    const userData: Record<string, unknown> = { ph: [sha256(phone)], country: [sha256("sn")] };
    const firstName = order.name.trim().split(/\s+/)[0];
    if (firstName) userData.fn = [sha256(firstName)];

    const result = await sendMetaEvents([
      {
        event_name: EVENT_NAME,
        event_time: Math.floor(Date.now() / 1000),
        event_id: `livree-${order.orderId || order.pageId}`,
        action_source: "system_generated",
        user_data: userData,
        custom_data: {
          value: order.price,
          currency: "XOF",
          content_name: order.product,
          content_type: "product",
          order_id: order.orderId || order.pageId,
        },
      },
    ]);
    if (!result.ok) {
      failed.push(order.orderId || order.pageId);
      continue;
    }
    // Si la coche échoue, la commande sera renvoyée au prochain passage avec
    // le même event_id : Meta la déduplique.
    await markOrderSentToMeta(order.pageId);
    sent++;
  }

  return NextResponse.json({ sent, skipped: skipped.length, failed: failed.length, failedIds: failed });
}
