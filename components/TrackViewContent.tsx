"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

// Déclenche ViewContent (Meta) / view_item (GA4) quand un visiteur ouvre
// une fiche pack — nécessaire pour que Meta puisse construire une audience
// "a consulté un produit" et faire du retargeting dessus.
export function TrackViewContent({ name, price }: { name: string; price: number }) {
  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: name,
      content_type: "product",
      value: price,
      currency: "XOF",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return null;
}
