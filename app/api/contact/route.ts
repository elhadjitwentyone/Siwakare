import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// Reçoit le formulaire de la page Contact et le transmet par email (Resend).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Nom, téléphone et message requis." }, { status: 400 });
  }

  const html =
    `<h2>✉️ Nouveau message Siwakare</h2>` +
    `<p><b>Nom :</b> ${escapeHtml(name)}<br/><b>Téléphone :</b> ${escapeHtml(phone)}</p>` +
    `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`;
  const sent = await sendOrderEmail(`Message de ${name}`, html);
  if (!sent.ok) return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });

  return NextResponse.json({ ok: true });
}
