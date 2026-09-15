"use client";

import { useEffect, useState } from "react";

export type LeadInfo = { name: string; address: string; phone: string };

// S'affiche juste avant l'ouverture de WhatsApp sur tout bouton de commande.
// Sert à récupérer prénom/nom, adresse et téléphone du client avant qu'il
// ne parte sur WhatsApp — ces infos sont ensuite ajoutées au message envoyé.
export function OrderModal({
  productLabel,
  price,
  onClose,
  onSubmit,
}: {
  productLabel: string;
  price: number;
  onClose: () => void;
  onSubmit: (lead: LeadInfo) => void;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, address, phone });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <h3 id="order-modal-title">Finalise ta commande</h3>
        <p className="modal-summary">
          {productLabel} — <strong>{price.toLocaleString("fr-FR")} FCFA</strong>
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
          <button type="submit" className="btn btn-whatsapp" style={{ width: "100%", marginTop: 16 }}>
            Valider et continuer sur WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
