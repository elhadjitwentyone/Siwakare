import { WhatsAppCTA } from "@/components/WhatsAppCTA";

export const metadata = { title: "Livraison & paiement — Siwakare" };

export default function Livraison() {
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
              <li>Dakar et banlieue : livraison sous 24 à 48h</li>
              <li>Thiès, Saly, Ziguinchor et autres grandes villes : 2 à 4 jours</li>
              <li>Autres localités : sur demande, contacte-nous sur WhatsApp</li>
            </ul>
          </div>
          <div className="card">
            <span className="icon">📱</span>
            <h3>Modes de paiement</h3>
            <ul className="check">
              <li>Wave</li>
              <li>Orange Money</li>
              <li>Cash à la livraison</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Une question sur ta commande ?</h2>
          <p>Contacte-nous directement sur WhatsApp pour commander ou suivre ta livraison.</p>
          <WhatsAppCTA
            message="Salam, j'ai une question sur la livraison ou le paiement d'une commande Siwakare."
            className="btn btn-whatsapp"
          >
            Écrire sur WhatsApp
          </WhatsAppCTA>
        </div>
      </section>
    </main>
  );
}
