"use client";

import { useState } from "react";
import Link from "next/link";
import { PriceTag } from "@/components/PriceTag";
import { OrderCTA } from "@/components/OrderCTA";
import { TrackViewContent } from "@/components/TrackViewContent";
import type { Variant } from "@/lib/content";
import { DELIVERY_FEE_DAKAR, isFreeDelivery } from "@/lib/legal";

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
  // Le pack à livraison offerte (Pack Essentiel) est présélectionné : c'est
  // celui qui rapporte le plus par commande.
  const startVariant = variants?.find((v) => isFreeDelivery(v.price)) ?? variants?.[0];
  const [selectedId, setSelectedId] = useState(startVariant?.id);
  const selected = variants?.find((v) => v.id === selectedId) ?? startVariant;

  const activePrice = selected?.price ?? price;
  const activeOldPrice = selected?.oldPrice ?? oldPrice;
  const activeImage = selected?.image ?? image;
  const contentName = selected ? `${name} — ${selected.label}` : name;

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
                  <span className="variant-label">
                    {v.label}
                    {isFreeDelivery(v.price) && <span className="variant-badge">🚚 Livraison offerte</span>}
                  </span>
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

          <p className="delivery-note">
            🚚{" "}
            {isFreeDelivery(activePrice)
              ? "Livraison offerte à Dakar"
              : `Livraison Dakar : ${DELIVERY_FEE_DAKAR.toLocaleString("fr-FR")} FCFA — offerte dès le Pack Essentiel`}
          </p>

          <div className="btn-row" style={{ marginTop: 24 }}>
            {outOfStock ? (
              <span className="btn btn-disabled" aria-disabled="true">Rupture de stock</span>
            ) : (
              <OrderCTA className="btn btn-primary" contentName={contentName} value={activePrice}>
                Commander
              </OrderCTA>
            )}
            <Link href="/livraison-paiement" className="btn btn-outline">
              Livraison & paiement
            </Link>
          </div>
          {outOfStock ? (
            <p className="reassurance">📦 En rupture de stock — le réassort est en cours.</p>
          ) : (
            <p className="reassurance">🔒 Satisfait ou remboursé sous 7 jours • Paiement à la livraison, Wave ou Orange Money</p>
          )}
        </div>
        <div className="placeholder-img hero-visual">
          {activeImage ? <img src={activeImage} alt={name} /> : "🌿"}
        </div>
      </div>

      {!outOfStock && (
        <div className="sticky-cta">
          <div className="sticky-cta-info">
            <strong>{contentName}</strong>
            <PriceTag fcfa={activePrice} />
          </div>
          <OrderCTA className="btn btn-primary" contentName={contentName} value={activePrice}>
            Commander
          </OrderCTA>
        </div>
      )}
    </>
  );
}
