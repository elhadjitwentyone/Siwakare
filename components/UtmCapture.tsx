"use client";

import { useEffect } from "react";
import { captureUtmFromUrl } from "@/lib/tracking";

// Composant invisible, monté une fois dans le layout, qui capture les
// paramètres utm_* / fbclid / gclid de l'URL d'arrivée pour toute la session.
export function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);
  return null;
}
