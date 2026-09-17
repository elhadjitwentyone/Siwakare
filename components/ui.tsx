import Link from "next/link";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ProductOrder } from "@/components/ProductOrder";
import { PriceTag } from "@/components/PriceTag";
import type { Product, Variant } from "@/lib/content";

export const WHATSAPP_NUMBER = "221779978756"; // à remplacer par le numéro dédié Siwakare

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          Siwak<span className="accent">are</span>
        </Link>
        <nav className="nav">
          <Link href="/produits">Nos produits</Link>
          <Link href="/le-siwak">Le siwak, c'est quoi ?</Link>
          <Link href="/livraison-paiement">Livraison & paiement</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <WhatsAppCTA
          className="btn btn-whatsapp header-cta"
          message="Salam, je souhaite avoir plus d'infos sur les produits Siwakare."
        >
          WhatsApp
        </WhatsAppCTA>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="logo">
            Siwak<span className="accent">are</span>
          </div>
          <p>Le siwak, l'hygiène bucco-dentaire naturelle et prophétique — livré chez vous au Sénégal.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <Link href="/produits">Nos produits</Link>
          <Link href="/le-siwak">Le siwak, c'est quoi ?</Link>
          <Link href="/livraison-paiement">Livraison & paiement</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h4>Commander</h4>
          <WhatsAppCTA
            message="Salam, je veux commander un produit Siwakare."
            event="InitiateCheckout"
            pickProduct
          >
            Commander
          </WhatsAppCTA>
          <p>Paiement : Wave, Orange Money, cash à la livraison</p>
        </div>
      </div>
      <div className="container copyright">© {new Date().getFullYear()} Siwakare — Dakar, Sénégal</div>
    </footer>
  );
}

export function WhatsAppFloating() {
  return (
    <WhatsAppCTA
      className="wa-float"
      message="Salam, j'ai une question sur Siwakare."
    >
      <span aria-label="Contacter sur WhatsApp" role="img">💬</span>
    </WhatsAppCTA>
  );
}

export function ProductCard({ p, ctaLabel }: { p: Product; ctaLabel: string }) {
  return (
    <div className={`product-card ${p.featured ? "featured" : ""} ${p.outOfStock ? "out-of-stock" : ""}`}>
      {p.outOfStock && <span className="tag-outofstock">Rupture de stock</span>}
      {!p.outOfStock && p.featured && <span className="tag-best">Best-seller</span>}
      <div className="product-media">
        <img src={p.image} alt={p.name} />
      </div>
      <h3>{p.name}</h3>
      <p>{p.tagline}</p>
      {p.variants && p.variants.length > 0 ? (
        <ul className="card-variant-list">
          {p.variants.map((v) => (
            <li key={v.id}>
              <span>{v.label}</span>
              <span className="card-variant-price">
                {v.oldPrice ? <span className="old-price">{v.oldPrice.toLocaleString("fr-FR")} FCFA</span> : null}
                {v.price.toLocaleString("fr-FR")} FCFA
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {p.freeGift && <p className="free-gift">🎁 {p.freeGift}</p>}
          <PriceTag fcfa={p.price} />
        </>
      )}
      <Link href={`/produits/${p.slug}`} className="btn btn-outline">{ctaLabel}</Link>
    </div>
  );
}

export function ProductPage({
  name,
  tagline,
  fcfa,
  oldFcfa,
  includes,
  why,
  faq,
  image,
  outOfStock,
  freeGift,
  variants,
}: {
  name: string;
  tagline: string;
  fcfa: number;
  oldFcfa?: number;
  includes: string[];
  why: string[];
  faq: { q: string; a: string }[];
  image?: string;
  outOfStock?: boolean;
  freeGift?: string;
  variants?: Variant[];
}) {
  const startVariant = variants?.[0];
  const bandContentName = startVariant ? `${name} — ${startVariant.label}` : name;
  const bandPrice = startVariant?.price ?? fcfa;
  const bandMsg = startVariant
    ? `Salam, je souhaite commander : ${name} — ${startVariant.label} (${bandPrice.toLocaleString("fr-FR")} FCFA).`
    : `Salam, je souhaite commander le ${name} (${fcfa.toLocaleString("fr-FR")} FCFA).`;
  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/produits">Nos produits</Link> / {name}
          </p>
          <ProductOrder
            name={name}
            tagline={tagline}
            image={image}
            price={fcfa}
            oldPrice={oldFcfa}
            freeGift={freeGift}
            outOfStock={outOfStock}
            variants={variants}
          />

          <h3>Ce que tu reçois</h3>
          <ul className="check">
            {includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Pourquoi choisir ce produit</h3>
          <ul className="check">
            {why.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <h2>Mode d'emploi en 4 étapes</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <p>Coupe environ 1 cm à l'extrémité du bâton (si inclus) ou applique le dentifrice normalement.</p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <p>Mâche doucement l'extrémité jusqu'à obtenir des fibres souples.</p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <p>Brosse tes dents et gencives, matin et soir.</p>
            </div>
            <div className="step">
              <div className="num">4</div>
              <p>Rince, laisse sécher à l'air libre entre deux utilisations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Questions fréquentes</h2>
          </div>
          <div className="faq" style={{ maxWidth: 700, margin: "0 auto" }}>
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {!outOfStock && (
        <section className="cta-band">
          <div className="container">
            <h2>Prêt à commander ton {name} ?</h2>
            <p>Paiement Wave, Orange Money ou cash à la livraison.</p>
            <div className="btn-row" style={{ justifyContent: "center" }}>
              <WhatsAppCTA
                message={bandMsg}
                className="btn btn-whatsapp"
                event="InitiateCheckout"
                contentName={bandContentName}
                value={bandPrice}
              >
                Commander maintenant
              </WhatsAppCTA>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
