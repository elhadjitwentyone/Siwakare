"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/components/ui";
import { getStoredUtm, trackEvent, utmSourceTag, TrackEventName } from "@/lib/tracking";
import { OrderModal, LeadInfo, OrderedItem } from "@/components/OrderModal";

// Remplace les anciens <a href={waLink(...)}> écrits en dur partout dans le
// site. Fait deux choses de plus qu'un lien simple :
//  1. tague le message WhatsApp avec la source de la campagne (UTM/fbclid)
//     pour pouvoir attribuer une vente manuellement,
//  2. déclenche un événement Meta Pixel + GA4 au clic.
// Pour une commande (event="InitiateCheckout"), le bouton n'ouvre plus
// WhatsApp : il affiche le formulaire de commande (OrderModal), qui envoie
// directement la commande au serveur (sauvegarde + notification email),
// sans dépendre du client pour l'envoi d'un message WhatsApp. Les autres CTA
// (contact, question) restent des liens WhatsApp directs, sans ce détour.
// pickProduct=true (CTA génériques : hero, footer, bande du bas) laisse le
// client choisir son bundle dans le modal plutôt que de fixer un produit.
export function WhatsAppCTA({
  message,
  children,
  className,
  event = "Lead",
  contentName,
  value,
  pickProduct = false,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  event?: TrackEventName;
  contentName?: string;
  value?: number;
  pickProduct?: boolean;
}) {
  const [finalMessage, setFinalMessage] = useState(message);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFinalMessage(message + utmSourceTag(getStoredUtm()));
  }, [message]);

  function track(lead?: LeadInfo, order?: OrderedItem) {
    trackEvent(
      event,
      {
        content_name: order?.label ?? contentName,
        content_type: "product",
        value: order?.price ?? value,
        currency: "XOF",
      },
      { phone: lead?.phone }
    );
  }

  if (event === "InitiateCheckout") {
    return (
      <>
        <button type="button" className={className || "wa-cta-reset"} onClick={() => setShowModal(true)}>
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

  return (
    <a href={waLink(finalMessage)} target="_blank" className={className} onClick={() => track()}>
      {children}
    </a>
  );
}
