"use client";

import { useState } from "react";
import Link from "next/link";
import { PriceTag } from "@/components/PriceTag";
import { TrackViewContent } from "@/components/TrackViewContent";
import type { Variant } from "@/lib/content";

export function ProductOrder({
  name,
  tagline,
  image,
  price,
  oldPrice,
  freeGift,
  outOfStock,
  variants,
}: {
  name: string;
  tagline: string;
  image?: string;
  price: number;
  oldPrice?: number | null;
  freeGift?: string;
  outOfStock?: boolean;
  variants?: Variant[];
}) {
  const [selectedId, setSelectedId] = useState(variants?.[0]?.id);
  const selected = variants?.find((v) => v.id === selectedId) ?? variants?.[0];

  const activePrice = selected?.price ?? price;
  const activeOldPrice = selected?.oldPrice ?? oldPrice;
  const activeImage = selected?.image ?? image;

  return (
    <>
      <TrackViewContent name={name} price={price} />
      <div className="two-col">
        <div>
          <h1>{name}</h1>
          <p style={{ fontSize: "1.1rem" }}>{tagline}</p>

          {variants && variants.length > 0 ? (
            <div className="variant-picker">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`variant-option ${v.id === selected?.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(v.id)}
                  aria-pressed={v.id === selected?.id}
                >
                  <span className="variant-label">{v.label}</span>
                  <span className="variant-price">
                    {v.oldPrice ? (
                      <span className="old-price">{v.oldPrice.toLocaleString("fr-FR")} FCFA</span>
                    ) : null}
                    {v.price.toLocaleString("fr-FR")} FCFA
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              {activeOldPrice ? <span className="old-price">{activeOldPrice.toLocaleString("fr-FR")} FCFA</span> : null}
              <PriceTag fcfa={activePrice} />
            </div>
          )}

          {freeGift && !variants && <p className="free-gift">🎁 {freeGift}</p>}

          <div className="btn-row" style={{ marginTop: 24 }}>
            {outOfStock ? (
              <span className="btn btn-disabled" aria-disabled="true">Rupture de stock</span>
            ) : null}
            <Link href="/livraison-paiement" className="btn btn-outline">
              Livraison & paiement
            </Link>
          </div>
          {outOfStock ? (
            <p className="reassurance">📦 En rupture de stock — le réassort est en cours.</p>
          ) : (
            <p className="reassurance">🔒 Satisfait ou remboursé sous 7 à 15 jours pour ta première commande • Paiement à la livraison, Wave ou Orange Money</p>
          )}
        </div>
        <div className="placeholder-img hero-visual">
          {activeImage ? <img src={activeImage} alt={name} /> : "🌿"}
        </div>
      </div>
    </>
  );
}
