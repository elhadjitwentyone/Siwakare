import { Reveal } from "@/components/Reveal";

export const metadata = { title: "Le siwak, c'est quoi ? — Siwakare" };

export default function LeSiwak() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Le siwak, c'est quoi ?</h1>
          <p>Origine, bienfaits et dimension prophétique d'une tradition millénaire.</p>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Origine</h2>
            <p>
              Le siwak (ou miswak) est une racine issue de l'arbuste <em>Salvadora persica</em>, utilisée depuis des
              siècles comme brosse à dents naturelle, notamment dans les cultures musulmanes et à travers plusieurs
              régions d'Afrique et d'Asie.
            </p>
            <h2>Bienfaits</h2>
            <ul className="check">
              <li>Nettoyage efficace des dents et des espaces interdentaires</li>
              <li>Haleine fraîche</li>
              <li>Action bénéfique pour les gencives</li>
              <li>Propriétés antibactériennes naturelles</li>
              <li>Alternative 100% naturelle, biodégradable et sans plastique</li>
            </ul>
          </div>
          <Reveal className="hero-visual placeholder-img">
            <img src="/images/siwak-batons.jpg" alt="Bâtons de siwak Siwakare" />
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container two-col">
          <div>
            <h2>Dimension prophétique</h2>
            <p>
              Le siwak occupe une place particulière dans la tradition prophétique (sunna). Le Prophète Muhammad
              (paix et bénédictions sur lui) l'utilisait régulièrement : au réveil, avant les prières, avant de
              réciter le Coran, et en entrant chez lui.
            </p>
            <Reveal>
              <div className="quote">
                « Le siwak est une purification pour la bouche et une manière de chercher la satisfaction d'Allah. »
                <cite>Rapporté par Ahmad, An-Nassa'i, Al-Bukhari, Muslim</cite>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="quote">
                « Si je ne craignais pas de surcharger ma communauté, je leur aurais ordonné d'utiliser le siwak à
                chaque prière. »
                <cite>Al-Bukhari, Muslim, Ad-Darimi</cite>
              </div>
            </Reveal>
            <p>
              Utiliser le siwak, c'est donc allier une routine d'hygiène efficace et une pratique de la sunna, dans
              un geste simple, économique et écologique.
            </p>
          </div>
          <Reveal className="hero-visual placeholder-img">
            <img src="/images/brosse-siwakare.jpg" alt="Brosse à dents Siwakare en bois naturel" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
