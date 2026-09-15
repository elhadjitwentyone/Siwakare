"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/components/ui";
import { getStoredUtm, trackEvent, utmSourceTag, TrackEventName } from "@/lib/tracking";
import { OrderModal, LeadInfo } from "@/components/OrderModal";

function appendLead(message: string, lead: LeadInfo) {
  return `${message}\n\nPrénom et nom : ${lead.name}\nAdresse : ${lead.address}\nTéléphone : ${lead.phone}`;
}

// Remplace les anciens <a href={waLink(...)}> écrits en dur partout dans le
// site. Fait trois choses de plus qu'un lien simple :
//  1. tague le message WhatsApp avec la source de la campagne (UTM/fbclid)
//     pour pouvoir attribuer une vente manuellement,
//  2. déclenche un événement Meta Pixel + GA4 au clic,
//  3. pour une commande (event="InitiateCheckout"), ouvre d'abord un
//     formulaire (nom, adresse, téléphone) avant de partir sur WhatsApp —
//     ces infos sont ajoutées au message. Les autres CTA (contact, question)
//     restent des liens directs, sans ce détour.
export function WhatsAppCTA({
  message,
  children,
  className,
  event = "Lead",
  contentName,
  value,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  event?: TrackEventName;
  contentName?: string;
  value?: number;
}) {
  const [finalMessage, setFinalMessage] = useState(message);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFinalMessage(message + utmSourceTag(getStoredUtm()));
  }, [message]);

  function track(lead?: LeadInfo) {
    trackEvent(
      event,
      {
        content_name: contentName,
        content_type: "product",
        value,
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
            onClose={() => setShowModal(false)}
            onSubmit={(lead) => {
              track(lead);
              window.open(waLink(appendLead(finalMessage, lead)), "_blank");
              setShowModal(false);
            }}
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
