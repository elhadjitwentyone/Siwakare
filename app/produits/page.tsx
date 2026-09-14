import Link from "next/link";
import { PriceTag } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nos packs siwak — Siwakare" };

export default async function Produits() {
  const { products } = await getContent();
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Nos packs</h1>
          <p>Découverte, famille ou complet — un pack pour chaque besoin.</p>
        </div>
      </section>
      <section className="section">
        <div className="container products">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <div className={`product-card ${p.featured ? "featured" : ""}`}>
                {p.featured && <span className="tag-best">Best-seller</span>}
                <div className="product-media">
                  <img src={p.image} alt={p.name} />
                </div>
                <h3>{p.name}</h3>
                <p>{p.tagline}</p>
                <PriceTag fcfa={p.price} />
                <Link href={`/produits/${p.slug}`} className="btn btn-outline">Voir le détail</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
