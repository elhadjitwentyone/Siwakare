"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/components/ui";
import { getStoredUtm, trackEvent, utmSourceTag, TrackEventName } from "@/lib/tracking";

// Remplace les anciens <a href={waLink(...)}> écrits en dur partout dans le
// site. Fait trois choses de plus qu'un lien simple :
//  1. tague le message WhatsApp avec la source de la campagne (UTM/fbclid)
//     pour pouvoir attribuer une vente manuellement,
//  2. déclenche un événement Meta Pixel + GA4 au clic,
//  3. reste un vrai <a target="_blank"> : pas de JS bloquant, ça marche
//     même si le tracking échoue.
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

  useEffect(() => {
    setFinalMessage(message + utmSourceTag(getStoredUtm()));
  }, [message]);

  function handleClick() {
    trackEvent(event, {
      content_name: contentName,
      content_type: "product",
      value,
      currency: "XOF",
    });
  }

  return (
    <a href={waLink(finalMessage)} target="_blank" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
