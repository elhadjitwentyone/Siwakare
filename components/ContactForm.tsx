"use client";

import { useState } from "react";
import { waLink } from "@/components/ui";
import { getStoredUtm, trackEvent, utmSourceTag } from "@/lib/tracking";

// Avant : un <form method="get" action={waLink(...)}> — le navigateur
// écrasait le paramètre "text" avec les champs du formulaire (nom, tel),
// donc le message WhatsApp arrivait toujours vide de ces infos.
// Ici on construit le message nous-mêmes, avec tout dedans, et on
// déclenche un événement Lead avant l'ouverture de WhatsApp.
export function ContactForm() {
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parts = [
      "Salam, voici mon message :",
      message && `"${message}"`,
      nom && `Nom : ${nom}`,
      tel && `Téléphone : ${tel}`,
    ].filter(Boolean);

    const finalMessage = parts.join("\n") + utmSourceTag(getStoredUtm());

    trackEvent("Lead", { content_name: "formulaire_contact" });

    window.open(waLink(finalMessage), "_blank");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input
        name="nom"
        placeholder="Ton nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ece4cf" }}
      />
      <input
        name="tel"
        placeholder="Ton téléphone"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ece4cf" }}
      />
      <textarea
        name="message"
        placeholder="Ton message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ece4cf" }}
      />
      <button type="submit" className="btn btn-primary">Envoyer via WhatsApp</button>
    </form>
  );
}
