"use client";

import { useState } from "react";
import Link from "next/link";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { PriceTag } from "@/components/PriceTag";
import { TrackViewContent } from "@/components/TrackViewContent";
import type { Variant } from "@/lib/content";

// Regroupe image, prix, sélecteur de variantes et bouton de commande dans un
// seul bloc client : choisir une variante doit changer le prix ET l'image
// affichés, donc les trois doivent partager le même état.
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
  const contentName = selected ? `${name} — ${selected.label}` : name;
  const orderMsg = selected
    ? `Salam, je souhaite commander : ${name} — ${selected.label} (${activePrice.toLocaleString("fr-FR")} FCFA).`
    : `Salam, je souhaite commander le ${name} (${activePrice.toLocaleString("fr-FR")} FCFA).`;

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
            ) : (
              <WhatsAppCTA
                message={orderMsg}
                className="btn btn-whatsapp"
                event="InitiateCheckout"
                contentName={contentName}
                value={activePrice}
              >
                Commander
              </WhatsAppCTA>
            )}
            <Link href="/livraison-paiement" className="btn btn-outline">
              Livraison & paiement
            </Link>
          </div>
          {outOfStock ? (
            <p className="reassurance">📦 En rupture de stock — le réassort est en cours, écris-nous sur WhatsApp pour être prévenu(e).</p>
          ) : (
            <p className="reassurance">🔒 Satisfait ou remboursé sous 7 à 15 jours pour ta première commande • Paiement à la livraison, Wave ou Orange Money</p>
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
          <WhatsAppCTA
            message={orderMsg}
            className="btn btn-whatsapp"
            event="InitiateCheckout"
            contentName={contentName}
            value={activePrice}
          >
            Commander
          </WhatsAppCTA>
        </div>
      )}
    </>
  );
}
