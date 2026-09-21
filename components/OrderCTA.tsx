"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/tracking";
import { OrderModal, LeadInfo, OrderedItem } from "@/components/OrderModal";

// Bouton "Commander" : ouvre le formulaire de commande (OrderModal), qui
// envoie la commande à /api/order (sauvegarde + notification email Resend).
// Déclenche l'événement InitiateCheckout (Meta Pixel + GA4) à la validation.
// pickProduct=true (CTA génériques : en-tête, hero, bandeau du bas) laisse le
// client choisir son bundle dans le modal plutôt que de fixer un produit.
export function OrderCTA({
  children,
  className,
  contentName,
  value,
  pickProduct = false,
}: {
  children: React.ReactNode;
  className?: string;
  contentName?: string;
  value?: number;
  pickProduct?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  function track(lead?: LeadInfo, order?: OrderedItem) {
    trackEvent(
      "InitiateCheckout",
      {
        content_name: order?.label ?? contentName,
        content_type: "product",
        value: order?.price ?? value,
        currency: "XOF",
      },
      { phone: lead?.phone }
    );
  }

  return (
    <>
      <button type="button" className={className || "btn btn-primary"} onClick={() => setShowModal(true)}>
        {children}
      </button>
      {showModal && (
        <OrderModal
          productLabel={contentName || "ta commande"}
          price={value ?? 0}
          pickProduct={pickProduct}
          onClose={() => setShowModal(false)}
          onSuccess={(lead, order) => track(lead, order)}
        />
      )}
    </>
  );
}
