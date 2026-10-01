"use client";

import { useEffect, useState } from "react";
import { DELIVERY_FEE_DAKAR } from "@/lib/legal";

// Fin des promos : 30 septembre 23:59:59, heure de Dakar (UTC+0, pas d'heure d'été).
const PROMO_END = new Date("2026-09-30T23:59:59+00:00").getTime();

function getTimeLeft() {
  const diff = PROMO_END - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function PromoBar() {
  // null tant qu'on n'a pas confirmé côté client qu'il reste du temps,
  // pour éviter un mismatch d'hydratation avec le rendu serveur.
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Barre d'annonce fixe, visible sur tout le site : la livraison d'abord
  // (toujours affichée), le compte à rebours promo seulement tant qu'il reste du temps.
  return (
    <div className="promo-bar">
      <span>
        🚚 Livraison Dakar {DELIVERY_FEE_DAKAR.toLocaleString("fr-FR")} FCFA —{" "}
        <strong>offerte dès le Pack Essentiel</strong>
      </span>
      {timeLeft && (
        <span className="promo-countdown">
          🔥 Promos jusqu'au 30/09
          <span className="promo-timer">
            {timeLeft.days}j {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
          </span>
        </span>
      )}
    </div>
  );
}
