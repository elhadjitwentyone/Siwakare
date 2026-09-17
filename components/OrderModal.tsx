"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "@/components/ui";

export type LeadInfo = { name: string; address: string; phone: string };

// S'affiche sur tout bouton de commande. Récupère prénom/nom, adresse et
// téléphone, puis envoie la commande directement à /api/order (sauvegarde +
// notification Telegram côté serveur) — le client n'a plus besoin de passer
// par WhatsApp pour que la commande soit reçue.
export function OrderModal({
  productLabel,
  price,
  onClose,
  onSuccess,
}: {
  productLabel: string;
  price: number;
  onClose: () => void;
  onSuccess?: (lead: LeadInfo) => void;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const lead: LeadInfo = { name, address, phone };
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productLabel, price, ...lead }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      onSuccess?.(lead);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
          <h3>Commande reçue ✅</h3>
          <p className="modal-summary">
            Merci {name} ! On te contacte très vite au {phone} pour confirmer la livraison à {address}.
          </p>
          <button type="button" className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <h3 id="order-modal-title">Finalise ta commande</h3>
        <p className="modal-summary">
          {productLabel}
          {price > 0 && (
            <>
              {" "}— <strong>{price.toLocaleString("fr-FR")} FCFA</strong>
            </>
          )}
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="order-name">Prénom et nom</label>
          <input
            id="order-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Awa Diop"
          />
          <label htmlFor="order-address">Adresse de livraison</label>
          <input
            id="order-address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quartier, ville"
          />
          <label htmlFor="order-phone">Numéro de téléphone</label>
          <input
            id="order-phone"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 000 00 00"
          />
          {status === "error" && (
            <p className="modal-error">
              La commande n'a pas pu être envoyée. Réessaie, ou écris-nous directement sur{" "}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank">WhatsApp</a>.
            </p>
          )}
          <button type="submit" className="btn btn-whatsapp" style={{ width: "100%", marginTop: 16 }} disabled={status === "submitting"}>
            {status === "submitting" ? "Envoi..." : "Valider ma commande"}
          </button>
        </form>
      </div>
    </div>
  );
}
