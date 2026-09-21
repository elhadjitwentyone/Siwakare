import { DELIVERY_FEE_DAKAR, LAST_UPDATE, LEGAL, RETURN_DAYS } from "@/lib/legal";

export const metadata = { title: "Conditions générales de vente — Siwakare" };

export default function CGV() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Conditions générales de vente</h1>
          <p>Dernière mise à jour : {LAST_UPDATE}</p>
        </div>
      </section>
      <section className="section">
        <div className="container legal" style={{ maxWidth: 800 }}>
          <h2>1. Objet</h2>
          <p>
            Les présentes conditions régissent les ventes de produits {LEGAL.site} (pâte dentifrice au siwak, bâtons de
            siwak, brosses à dents) réalisées sur le site {LEGAL.url} à destination de clients situés au Sénégal.
            Passer commande implique l'acceptation de ces conditions.
          </p>

          <h2>2. Produits et prix</h2>
          <p>
            Les prix sont indiqués en francs CFA (FCFA), hors frais de livraison. Les offres groupées (« 2 achetées = 50 % de
            réduction sur la 3ème », etc.) et les promotions sont valables dans la limite des stocks et de la période indiquée
            sur le site. Le prix applicable est celui affiché au moment de la commande.
          </p>

          <h2>3. Commande</h2>
          <p>
            La commande se fait via le bouton « Commander » : le client indique son nom, son adresse de livraison et son
            numéro de téléphone. La commande est confirmée par notre équipe par téléphone avant l'expédition. Nous
            pouvons refuser ou annuler une commande en cas de rupture de stock, d'adresse inexploitable ou de demande
            anormale ; le client en est alors informé.
          </p>

          <h2>4. Paiement</h2>
          <p>
            Le paiement s'effectue par Wave, Orange Money ou en espèces à la livraison. Aucun paiement n'est prélevé en
            ligne sur le site.
          </p>

          <h2>5. Livraison</h2>
          <p>
            Dakar et banlieue : livraison sous 24 à 48 h, frais de {DELIVERY_FEE_DAKAR.toLocaleString("fr-FR")} FCFA, offerts pour l'achat du Pack Essentiel (5 pâtes + 5 brosses). Ces frais sont indiqués sur le site avant la commande et rappelés lors de la confirmation.
            Thiès, Saly, Ziguinchor et autres grandes villes : 2 à 4 jours. Autres localités : sur demande. Les délais
            sont indicatifs. Le client doit être joignable au numéro indiqué ; en cas d'absence répétée, la commande
            peut être annulée.
          </p>

          <h2>6. Satisfait ou remboursé</h2>
          <p>
            Si le produit ne vous convient pas, vous pouvez demander son remboursement dans un délai de {RETURN_DAYS}{" "}
            jours après la livraison, en nous écrivant via la <a href="/contact">page Contact</a>. Le remboursement est
            effectué par Wave, Orange Money ou en espèces, au choix du client. Les frais de livraison ne sont pas
            remboursés, sauf en cas d'erreur de notre part.
          </p>

          <h2>7. Produit non conforme ou endommagé</h2>
          <p>
            En cas d'erreur de produit ou de produit endommagé à la livraison, contactez-nous dans les {RETURN_DAYS}{" "}
            jours : nous procédons à l'échange ou au remboursement sans frais.
          </p>

          <h2>8. Précautions d'usage</h2>
          <p>
            Les produits sont des produits d'hygiène bucco-dentaire naturels, non des médicaments. En cas d'allergie
            connue, de doute ou de problème dentaire, demandez l'avis d'un professionnel de santé. Les enfants doivent
            utiliser les produits sous la surveillance d'un adulte.
          </p>

          <h2>9. Données personnelles</h2>
          <p>
            Le traitement de vos données est décrit dans notre{" "}
            <a href="/politique-de-confidentialite">politique de confidentialité</a>.
          </p>

          <h2>10. Litiges</h2>
          <p>
            En cas de difficulté, contactez-nous d'abord pour trouver une solution amiable. À défaut, le droit
            sénégalais s'applique et les tribunaux de Dakar sont compétents, sous réserve des règles impératives de
            protection des consommateurs.
          </p>
        </div>
      </section>
    </main>
  );
}
