import type { Order } from "@/lib/orders";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";

// Crée une page dans la base "Commandes Siwakare" à chaque nouvelle commande,
// pour que le suivi (changement de statut) se fasse depuis l'app Notion.
// Best-effort : une commande est déjà sauvegardée sur GitHub et notifiée par
// email avant cet appel — un échec ici ne doit jamais faire échouer la
// commande elle-même.
export async function pushOrderToNotion(order: Order): Promise<{ ok: boolean; error?: string }> {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return { ok: false, error: "NOTION_TOKEN / NOTION_DATABASE_ID non configurés sur Vercel." };
  }

  const dateOnly = order.date.slice(0, 10);

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Client: { title: [{ text: { content: order.name } }] },
          "Téléphone": { phone_number: order.phone },
          Adresse: { rich_text: [{ text: { content: order.address } }] },
          Produit: { rich_text: [{ text: { content: order.product } }] },
          "Prix FCFA": { number: order.price },
          Livraison: { rich_text: [{ text: { content: order.delivery || "" } }] },
          "Date commande": { date: { start: dateOnly } },
          Statut: { select: { name: "Nouvelle" } },
          "ID commande": { rich_text: [{ text: { content: order.id } }] },
        },
      }),
    });
    if (!res.ok) return { ok: false, error: await res.text() };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
