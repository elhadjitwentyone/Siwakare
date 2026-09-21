import { LAST_UPDATE, LEGAL } from "@/lib/legal";

export const metadata = { title: "Politique de confidentialité — Siwakare" };

export default function Confidentialite() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Politique de confidentialité</h1>
          <p>Dernière mise à jour : {LAST_UPDATE}</p>
        </div>
      </section>
      <section className="section">
        <div className="container legal" style={{ maxWidth: 800 }}>
          <h2>Responsable du traitement</h2>
          <p>
            {LEGAL.exploitant || LEGAL.site}, {LEGAL.adresse}. Contact : <a href="/contact">page Contact</a>.
          </p>

          <h2>Données collectées</h2>
          <ul className="check">
            <li>Commande : nom, adresse de livraison, numéro de téléphone, produit commandé.</li>
            <li>Formulaire de contact : nom, numéro de téléphone, message.</li>
            <li>
              Mesure d'audience et publicité : pages visitées, appareil, provenance (campagne publicitaire), via Vercel
              Analytics, Google Analytics et le pixel Meta (Facebook/Instagram).
            </li>
          </ul>

          <h2>Finalités</h2>
          <p>
            Traiter et livrer vos commandes, vous contacter au sujet de votre commande ou de votre message, gérer les
            demandes de remboursement, mesurer la fréquentation du site et l'efficacité de nos publicités.
          </p>

          <h2>Destinataires et sous-traitants</h2>
          <p>
            Vos données ne sont pas vendues. Elles sont traitées par notre équipe et par nos prestataires techniques :
            Vercel (hébergement et statistiques), GitHub (enregistrement des commandes), Resend (envoi des notifications
            par email), Google et Meta (mesure d'audience et publicité). Certains de ces prestataires sont situés hors
            du Sénégal, notamment aux États-Unis.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les données de commande sont conservées le temps nécessaire à la livraison, au service après-vente et à nos
            obligations comptables. Les messages de contact sont conservés le temps du traitement de votre demande.
          </p>

          <h2>Vos droits</h2>
          <p>
            Conformément à la loi sénégalaise n° 2008-12 sur la protection des données à caractère personnel, vous
            disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données. Pour
            l'exercer, écrivez-nous via la <a href="/contact">page Contact</a>. Vous pouvez aussi saisir la Commission
            de Protection des Données Personnelles (CDP) du Sénégal.
          </p>

          <h2>Cookies et traceurs</h2>
          <p>
            Le site utilise des traceurs de mesure d'audience et de publicité (Google Analytics, pixel Meta, Vercel
            Analytics). Vous pouvez les bloquer depuis les réglages de votre navigateur ou une extension dédiée.
          </p>
        </div>
      </section>
    </main>
  );
}
