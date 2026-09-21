import Link from "next/link";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Livraison & paiement — Siwakare" };

export default async function Livraison() {
  const { livraison } = await getContent();
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Livraison & paiement</h1>
          <p>Zones desservies, délais et modes de paiement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="card">
            <span className="icon">🚚</span>
            <h3>Zones desservies</h3>
            <ul className="check">
              {livraison.zones.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <span className="icon">📱</span>
            <h3>Modes de paiement</h3>
            <ul className="check">
              {livraison.paymentMethods.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Une question sur ta commande ?</h2>
          <p>Écris-nous via le formulaire de contact pour suivre ta livraison ou poser une question.</p>
          <Link href="/contact" className="btn btn-primary">Nous contacter</Link>
        </div>
      </section>
    </main>
  );
}
