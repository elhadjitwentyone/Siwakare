import { ProductCard } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nos produits siwak — Siwakare" };

export default async function Produits() {
  const { products } = await getContent();
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Nos produits</h1>
          <p>Le siwak sous toutes ses formes, pour tous les usages.</p>
        </div>
      </section>
      <section className="section">
        <div className="container products">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <ProductCard p={p} ctaLabel="Voir le détail" />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
