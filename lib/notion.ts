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

export type DeliveredOrder = {
  pageId: string;
  orderId: string;
  name: string;
  phone: string;
  product: string;
  price: number;
};

const notionHeaders = () => ({
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
});

const plainText = (items: any): string => (Array.isArray(items) ? items.map((t: any) => t?.plain_text || "").join("") : "");

// Commandes livrées (État = "Terminé") pas encore transmises à Meta.
export async function getDeliveredOrdersToSend(): Promise<{ ok: true; orders: DeliveredOrder[] } | { ok: false; error: string }> {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return { ok: false, error: "NOTION_TOKEN / NOTION_DATABASE_ID non configurés sur Vercel." };
  }
  const orders: DeliveredOrder[] = [];
  let cursor: string | undefined;
  try {
    do {
      const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: "POST",
        headers: notionHeaders(),
        cache: "no-store",
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
          filter: {
            and: [
              { property: "État", status: { equals: "Terminé" } },
              { property: "Envoyé à Meta", checkbox: { equals: false } },
            ],
          },
        }),
      });
      if (!res.ok) return { ok: false, error: await res.text() };
      const data = await res.json();
      for (const page of data.results || []) {
        const props = page.properties || {};
        orders.push({
          pageId: page.id,
          orderId: plainText(props["ID commande"]?.rich_text),
          name: plainText(props["Client"]?.title),
          phone: props["Téléphone"]?.phone_number || "",
          product: plainText(props["Produit"]?.rich_text),
          price: props["Prix FCFA"]?.number || 0,
        });
      }
      cursor = data.has_more ? data.next_cursor : undefined;
    } while (cursor);
    return { ok: true, orders };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// "ID commande" des fiches Notion datées de `sinceDate` (YYYY-MM-DD) ou après.
// Sert au rattrapage : comparer avec data/orders.json pour retrouver les
// commandes dont l'envoi vers Notion a échoué au moment de la commande.
export async function getNotionOrderIdsSince(sinceDate: string): Promise<{ ok: true; ids: Set<string> } | { ok: false; error: string }> {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return { ok: false, error: "NOTION_TOKEN / NOTION_DATABASE_ID non configurés sur Vercel." };
  }
  const ids = new Set<string>();
  let cursor: string | undefined;
  try {
    do {
      const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: "POST",
        headers: notionHeaders(),
        cache: "no-store",
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
          filter: { property: "Date commande", date: { on_or_after: sinceDate } },
        }),
      });
      if (!res.ok) return { ok: false, error: await res.text() };
      const data = await res.json();
      for (const page of data.results || []) {
        const id = plainText(page.properties?.["ID commande"]?.rich_text);
        if (id) ids.add(id);
      }
      cursor = data.has_more ? data.next_cursor : undefined;
    } while (cursor);
    return { ok: true, ids };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function markOrderSentToMeta(pageId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: notionHeaders(),
      body: JSON.stringify({ properties: { "Envoyé à Meta": { checkbox: true } } }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
