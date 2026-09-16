"use client";

import { useEffect, useState } from "react";

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

  if (!timeLeft) return null;

  return (
    <div className="promo-bar">
      <span>🔥 Promos valables jusqu'au 30 septembre</span>
      <span className="promo-timer">
        {timeLeft.days}j {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
}
