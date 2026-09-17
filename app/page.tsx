import Link from "next/link";
import { ProductCard } from "@/components/ui";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const { hero, products } = content;

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.subtitle}</p>
            <div className="btn-row">
              <Link href="/produits" className="btn btn-primary">Voir nos produits</Link>
              <WhatsAppCTA
                message="Salam, je souhaite commander un produit Siwakare."
                className="btn btn-whatsapp"
                event="InitiateCheckout"
                pickProduct
              >
                Commander
              </WhatsAppCTA>
            </div>
            <div className="badges">
              <span className="badge">🌿 100% naturel</span>
              <span className="badge">🕌 Sunna prophétique</span>
              <span className="badge">💰 Économique</span>
              <span className="badge">🚚 Livraison Dakar & grandes villes</span>
            </div>
          </div>
          <div className="hero-visual">
            <img src={hero.image} alt="Siwakare" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-title">
              <h2>Pourquoi choisir le siwak ?</h2>
              <p>Une brosse à dents se change tous les 3 mois. Beaucoup la gardent bien plus longtemps — après 3 mois, ta brosse est plus un nid à bactéries qu'un outil d'hygiène.</p>
            </div>
          </Reveal>
          <div className="grid-3">
            <Reveal delay={0}><div className="card">
              <span className="icon">🌱</span>
              <h3>Naturel & écologique</h3>
              <p>100% naturel, biodégradable, sans plastique. Fibres antibactériennes qui se « rafraîchissent » quand on coupe l'extrémité utilisée.</p>
            </div></Reveal>
            <Reveal delay={100}><div className="card">
              <span className="icon">🕌</span>
              <h3>Tradition & sunna</h3>
              <p>Le Prophète (paix et bénédictions sur lui) utilisait le siwak au réveil, avant les prières et avant de réciter le Coran.</p>
            </div></Reveal>
            <Reveal delay={200}><div className="card">
              <span className="icon">💵</span>
              <h3>Économique</h3>
              <p>Un bâton dure plusieurs semaines. Moins de dépenses en brosses en plastique — les offres groupées sur la pâte dentifrice couvrent toute la maison.</p>
            </div></Reveal>
          </div>
          <Reveal>
            <div className="quote">
              « Le siwak est une purification pour la bouche et une manière de chercher la satisfaction d'Allah. »
              <cite>Rapporté par Ahmad, An-Nassa'i, Al-Bukhari, Muslim</cite>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <div className="section-title">
              <h2>Comment utiliser le siwak ?</h2>
              <p>Une routine simple, en 4 étapes.</p>
            </div>
          </Reveal>
          <div className="steps">
            {[
              "Coupe environ 1 cm à l'extrémité du bâton.",
              "Mâche doucement l'extrémité jusqu'à obtenir des fibres souples.",
              "Brosse tes dents et tes gencives comme avec une brosse classique.",
              "Rince, laisse sécher à l'air libre. Recoupe l'extrémité pour renouveler les fibres.",
            ].map((txt, i) => (
              <Reveal key={txt} delay={i * 100}>
                <div className="step">
                  <div className="num">{i + 1}</div>
                  <p>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="produits">
        <div className="container">
          <Reveal>
            <div className="section-title">
              <h2>Nos produits</h2>
              <p>Le siwak sous toutes ses formes, pour ton quotidien ou toute ta famille.</p>
            </div>
          </Reveal>
          <div className="products">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProductCard p={p} ctaLabel="Voir le produit" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <div className="section-title">
              <h2>Ce qu'en disent nos clients</h2>
            </div>
          </Reveal>
          <div className="testimonials">
            <Reveal delay={0}><div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>« Haleine fraîche toute la journée et je sais que je suis dans la sunna. L'offre 3 pâtes achetées, 2 offertes couvre toute la maison. »</p>
              <strong>Aïssatou, Dakar</strong>
            </div></Reveal>
            <Reveal delay={100}><div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>« Livraison rapide, paiement à la livraison, ça m'a rassuré pour ma première commande. »</p>
              <strong>Modou, Thiès</strong>
            </div></Reveal>
            <Reveal delay={200}><div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>« On m'avait parlé du siwak depuis longtemps, Siwakare m'a permis de m'y mettre facilement. »</p>
              <strong>Fatou, Saly</strong>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-title">
              <h2>Livraison & paiement</h2>
            </div>
          </Reveal>
          <div className="grid-3">
            <div className="card">
              <span className="icon">🚚</span>
              <h3>Livraison rapide</h3>
              <p>Dakar et grandes villes : Thiès, Saly, Ziguinchor, etc.</p>
            </div>
            <div className="card">
              <span className="icon">📱</span>
              <h3>Paiement simple</h3>
              <p>Wave, Orange Money ou cash à la livraison.</p>
            </div>
            <div className="card">
              <span className="icon">🔄</span>
              <h3>Satisfait ou remboursé</h3>
              <p>Garantie 7 à 15 jours pour ta première commande.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/livraison-paiement" className="btn btn-outline">En savoir plus</Link>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Envie de tester le siwak ?</h2>
          <p>Commande ton produit en quelques minutes directement sur le site.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Link href="/produits" className="btn btn-primary" style={{ background: "#fff", color: "var(--green-dark)" }}>
              Voir les produits
            </Link>
            <WhatsAppCTA
              message="Salam, je souhaite commander un produit Siwakare."
              className="btn btn-whatsapp"
              event="InitiateCheckout"
              pickProduct
            >
              Commander
            </WhatsAppCTA>
          </div>
        </div>
      </section>
    </main>
  );
}
