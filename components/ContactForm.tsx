"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/tracking";

const fieldStyle = { padding: 10, borderRadius: 8, border: "1px solid #ece4cf" };

// Envoie le message à /api/contact (notification email via Resend) et
// déclenche un événement Lead à l'envoi réussi.
export function ContactForm() {
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nom, phone: tel, message }),
      });
      if (!res.ok) throw new Error("request failed");
      trackEvent("Lead", { content_name: "formulaire_contact" }, { phone: tel });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="modal-summary">Merci {nom} ! Ton message est bien reçu, on te répond au plus vite.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input name="nom" placeholder="Ton nom" required value={nom} onChange={(e) => setNom(e.target.value)} style={fieldStyle} />
      <input name="tel" type="tel" placeholder="Ton téléphone" required value={tel} onChange={(e) => setTel(e.target.value)} style={fieldStyle} />
      <textarea name="message" placeholder="Ton message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} style={fieldStyle} />
      {status === "error" && (
        <p className="modal-error">Le message n'a pas pu être envoyé. Réessaie dans un instant.</p>
      )}
      <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
