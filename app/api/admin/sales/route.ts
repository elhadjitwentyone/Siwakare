import { NextRequest, NextResponse } from "next/server";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getSales } from "@/lib/sales";

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "data/sales.json";

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

async function commitSales(data: { sales: unknown[] }, message: string) {
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

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  return NextResponse.json(await getSales());
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_REPO / GITHUB_TOKEN non configurés sur Vercel." }, { status: 500 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.amount || !body?.date) {
    return NextResponse.json({ error: "Date et montant requis." }, { status: 400 });
  }

  const current = await getSales();
  const sale = {
    id: `${Date.now()}`,
    date: String(body.date),
    amount: Number(body.amount),
    product: body.product ? String(body.product) : "",
    note: body.note ? String(body.note) : "",
  };
  const updated = { sales: [sale, ...current.sales] };

  const result = await commitSales(updated, `Ajoute une vente (${sale.amount} FCFA) via /admin Siwakare`);
  if (!result.ok) return NextResponse.json({ error: `Échec de la sauvegarde GitHub : ${result.error}` }, { status: 500 });
  return NextResponse.json({ ok: true, sale });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_REPO / GITHUB_TOKEN non configurés sur Vercel." }, { status: 500 });
  }
  const { id } = await req.json().catch(() => ({ id: null }));
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const current = await getSales();
  const updated = { sales: current.sales.filter((s) => s.id !== id) };

  const result = await commitSales(updated, "Supprime une vente via /admin Siwakare");
  if (!result.ok) return NextResponse.json({ error: `Échec de la sauvegarde GitHub : ${result.error}` }, { status: 500 });
  return NextResponse.json({ ok: true });
}
