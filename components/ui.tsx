import Link from "next/link";

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
          <Link href="/produits">Nos packs</Link>
          <Link href="/le-siwak">Le siwak, c'est quoi ?</Link>
          <Link href="/livraison-paiement">Livraison & paiement</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a
          className="btn btn-whatsapp header-cta"
          href={waLink("Salam, je souhaite avoir plus d'infos sur les packs Siwakare.")}
          target="_blank"
        >
          WhatsApp
        </a>
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
          <Link href="/produits">Nos packs</Link>
          <Link href="/le-siwak">Le siwak, c'est quoi ?</Link>
          <Link href="/livraison-paiement">Livraison & paiement</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h4>Commander</h4>
          <a href={waLink("Salam, je veux commander un pack Siwakare.")} target="_blank">
            Commander sur WhatsApp
          </a>
          <p>Paiement : Wave, Orange Money, cash à la livraison</p>
        </div>
      </div>
      <div className="container copyright">© {new Date().getFullYear()} Siwakare — Dakar, Sénégal</div>
    </footer>
  );
}

export function WhatsAppFloating() {
  return (
    <a
      className="wa-float"
      href={waLink("Salam, j'ai une question sur Siwakare.")}
      target="_blank"
      aria-label="Contacter sur WhatsApp"
    >
      💬
    </a>
  );
}

export function PriceTag({ fcfa }: { fcfa: number }) {
  return <span className="price">{fcfa.toLocaleString("fr-FR")} FCFA</span>;
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
}: {
  name: string;
  tagline: string;
  fcfa: number;
  oldFcfa?: number;
  includes: string[];
  why: string[];
  faq: { q: string; a: string }[];
  image?: string;
}) {
  const orderMsg = `Salam, je souhaite commander le ${name} (${fcfa.toLocaleString("fr-FR")} FCFA).`;
  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/produits">Nos packs</Link> / {name}
          </p>
          <div className="two-col">
            <div>
              <h1>{name}</h1>
              <p style={{ fontSize: "1.1rem" }}>{tagline}</p>
              <div style={{ marginBottom: 20 }}>
                {oldFcfa && <span className="old-price">{oldFcfa.toLocaleString("fr-FR")} FCFA</span>}
                <PriceTag fcfa={fcfa} />
              </div>

              <h3>Ce que tu reçois</h3>
              <ul className="check">
                {includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3>Pourquoi choisir ce pack</h3>
              <ul className="check">
                {why.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="btn-row" style={{ marginTop: 24 }}>
                <a href={waLink(orderMsg)} target="_blank" className="btn btn-whatsapp">
                  Commander sur WhatsApp
                </a>
                <Link href="/livraison-paiement" className="btn btn-outline">
                  Livraison & paiement
                </Link>
              </div>
            </div>
            <div className="placeholder-img hero-visual">
              {image ? <img src={image} alt={name} /> : "🌿"}
            </div>
          </div>
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

      <section className="cta-band">
        <div className="container">
          <h2>Prêt à commander ton {name} ?</h2>
          <p>Paiement Wave, Orange Money ou cash à la livraison.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <a href={waLink(orderMsg)} target="_blank" className="btn btn-whatsapp">
              Commander maintenant
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
