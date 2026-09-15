import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DEPLOY_HOOK_URL = process.env.DEPLOY_HOOK_URL;

// Contrairement à data/content.json (relu en direct à chaque visite), les
// fichiers sous public/ sont figés dans le build Next.js — une image
// ajoutée ici n'apparaît sur le site qu'après un redéploiement Vercel.
// D'où l'appel au Deploy Hook en fin de route.
const MAX_BASE64_LENGTH = 12_000_000; // ~8.5 Mo en entrée, avant compression
const MAX_WIDTH = 1600; // largeur suffisante pour toute utilisation sur le site

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

function safeBaseName(name: string): string {
  const dot = name.lastIndexOf(".");
  const rawBase = dot >= 0 ? name.slice(0, dot) : name;
  return (
    rawBase
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "")
      .slice(0, 40) || "image"
  );
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_REPO / GITHUB_TOKEN non configurés sur Vercel." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.filename || !body?.dataBase64) {
    return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
  }
  if (typeof body.dataBase64 !== "string" || body.dataBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "Image trop lourde (8 Mo max)." }, { status: 400 });
  }

  // Décoder et recompresser avec sharp sert deux buts à la fois : réduire le
  // poids servi sur le site, et vérifier que le contenu envoyé est vraiment
  // une image exploitable (pas juste un nom de fichier qui y ressemble) —
  // un fichier non décodable est rejeté ici, avant d'atteindre GitHub.
  let outputBuffer: Buffer;
  try {
    const inputBuffer = Buffer.from(body.dataBase64, "base64");
    outputBuffer = await sharp(inputBuffer)
      .rotate() // respecte l'orientation EXIF (photo prise au téléphone)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Fichier illisible comme image (formats acceptés : JPG, PNG, WebP, GIF, AVIF)." },
      { status: 400 }
    );
  }

  const filename = `${Date.now()}-${safeBaseName(body.filename)}.webp`;
  const filePath = `public/images/${filename}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  const put = await fetch(apiUrl, {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify({
      message: `Ajoute l'image ${filename} via /admin Siwakare`,
      content: outputBuffer.toString("base64"),
      branch: GITHUB_BRANCH,
    }),
  });

  if (!put.ok) {
    const err = await put.text();
    return NextResponse.json({ error: `Échec de l'envoi sur GitHub : ${err}` }, { status: 500 });
  }

  let redeployTriggered = false;
  if (DEPLOY_HOOK_URL) {
    try {
      await fetch(DEPLOY_HOOK_URL, { method: "POST" });
      redeployTriggered = true;
    } catch {
      // best-effort : l'image est en sécurité sur GitHub même si l'appel échoue
    }
  }

  return NextResponse.json({ path: `/images/${filename}`, redeployTriggered });
}
