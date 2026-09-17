import { NextRequest, NextResponse } from "next/server";
import { getOrders, Order } from "@/lib/orders";
import { sendOrderEmail } from "@/lib/email";

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "data/orders.json";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

async function commitOrders(data: { orders: Order[] }, message: string) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  let sha: string | undefined;
  try {
    const cur = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders, cache: "no-store" });
    if (cur.ok) sha = (await cur.json()).sha;
  } catch {
    // fichier peut-être inexistant encore
  }
  const put = await fetch(apiUrl, {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify({
      message,
      content: Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) return { ok: false as const, error: await put.text() };
  return { ok: true as const };
}

// Reçoit une commande depuis le bouton "Commander" du site (remplace l'ancien
// flux WhatsApp) : sauvegarde dans data/orders.json via GitHub ET notifie
// immédiatement par email, pour ne plus dépendre du client qui clique
// "envoyer" sur WhatsApp.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const product = typeof body?.product === "string" && body.product.trim() ? body.product.trim() : "Commande générale Siwakare";
  const price = Number(body?.price) || 0;

  if (!name || !address || !phone) {
    return NextResponse.json({ error: "Nom, adresse et téléphone requis." }, { status: 400 });
  }

  const order: Order = {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    product,
    price,
    name,
    address,
    phone,
  };

  let saved = false;
  if (GITHUB_REPO && GITHUB_TOKEN) {
    const current = await getOrders();
    const result = await commitOrders({ orders: [order, ...current.orders] }, `Nouvelle commande : ${product} (${name})`);
    saved = result.ok;
  }

  const html =
    `<h2>🛒 Nouvelle commande Siwakare</h2>` +
    `<p><b>Produit :</b> ${escapeHtml(product)}<br/>` +
    (price ? `<b>Prix :</b> ${price.toLocaleString("fr-FR")} FCFA<br/>` : "") +
    `<b>Client :</b> ${escapeHtml(name)}<br/>` +
    `<b>Téléphone :</b> ${escapeHtml(phone)}<br/>` +
    `<b>Adresse :</b> ${escapeHtml(address)}</p>`;
  const notif = await sendOrderEmail(`Nouvelle commande : ${product}`, html);

  return NextResponse.json({ ok: true, saved, notified: notif.ok });
}
