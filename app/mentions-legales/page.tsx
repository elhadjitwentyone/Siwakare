import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Mentions légales — Siwakare" };

export default function MentionsLegales() {
  const rows: [string, string][] = [
    ["Site", `${LEGAL.site} — ${LEGAL.url}`],
    ["Exploitant", LEGAL.exploitant],
    ["Forme juridique", LEGAL.formeJuridique],
    ["NINEA", LEGAL.ninea],
    ["RCCM", LEGAL.rccm],
    ["Adresse", LEGAL.adresse],
    ["Email", LEGAL.email],
    ["Téléphone", LEGAL.telephone],
    ["Directeur de la publication", LEGAL.directeurPublication],
  ];
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Mentions légales</h1>
        </div>
      </section>
      <section className="section">
        <div className="container legal" style={{ maxWidth: 800 }}>
          <h2>Éditeur du site</h2>
          <ul className="check">
            {rows.filter(([, v]) => v).map(([k, v]) => (
              <li key={k}><strong>{k} :</strong> {v}</li>
            ))}
          </ul>
          <p>Pour nous joindre : <a href="/contact">page Contact</a>.</p>

          <h2>Hébergement</h2>
          <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com.</p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, images, logos et éléments graphiques du site sont la propriété de {LEGAL.site} ou utilisés avec
            autorisation. Toute reproduction sans accord préalable est interdite.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Les produits Siwakare sont des produits d'hygiène bucco-dentaire naturels. Ils ne remplacent pas l'avis d'un
            dentiste ou d'un médecin. Les informations du site sont données à titre indicatif et peuvent être modifiées
            à tout moment.
          </p>

          <h2>Données personnelles</h2>
          <p>Voir notre <a href="/politique-de-confidentialite">politique de confidentialité</a>.</p>

          <h2>Droit applicable</h2>
          <p>
            Le site est soumis au droit sénégalais. En cas de litige, les tribunaux de Dakar sont compétents, sous
            réserve des règles impératives applicables aux consommateurs.
          </p>
        </div>
      </section>
    </main>
  );
}
