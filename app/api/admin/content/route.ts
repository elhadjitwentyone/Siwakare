import { NextRequest, NextResponse } from "next/server";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getContent } from "@/lib/content";

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DEPLOY_HOOK_URL = process.env.DEPLOY_HOOK_URL;
const FILE_PATH = "data/content.json";

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_REPO / GITHUB_TOKEN non configurés sur Vercel." },
      { status: 500 }
    );
  }
  const updated = await req.json().catch(() => null);
  if (!updated) return NextResponse.json({ error: "Contenu invalide." }, { status: 400 });

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  // 1. Récupérer le sha actuel du fichier (requis par l'API GitHub pour un update).
  let sha: string | undefined;
  try {
    const cur = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders, cache: "no-store" });
    if (cur.ok) {
      const data = await cur.json();
      sha = data.sha;
    }
  } catch {
    // fichier peut-être inexistant encore — on continue sans sha (création)
  }

  // 2. Committer le nouveau contenu sur GitHub.
  const body = {
    message: "Mise à jour du contenu via /admin Siwakare",
    content: Buffer.from(JSON.stringify(updated, null, 2), "utf-8").toString("base64"),
    branch: GITHUB_BRANCH,
    ...(sha ? { sha } : {}),
  };

  const put = await fetch(apiUrl, { method: "PUT", headers: ghHeaders, body: JSON.stringify(body) });
  if (!put.ok) {
    const err = await put.text();
    return NextResponse.json({ error: `Échec de la sauvegarde GitHub: ${err}` }, { status: 500 });
  }

  // 3. Déclencher un redéploiement Vercel (best-effort, ne bloque jamais la sauvegarde :
  // le contenu est déjà en sécurité sur GitHub même si cet appel échoue).
  if (DEPLOY_HOOK_URL) {
    fetch(DEPLOY_HOOK_URL, { method: "POST" }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
