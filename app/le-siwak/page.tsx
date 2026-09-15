import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Le siwak, c'est quoi ? — Siwakare" };

export default async function LeSiwak() {
  const { leSiwak } = await getContent();
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
            <p>{leSiwak.origin}</p>
            <h2>Bienfaits</h2>
            <ul className="check">
              {leSiwak.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <Reveal className="hero-visual placeholder-img">
            <img src={leSiwak.image1} alt="Bâtons de siwak Siwakare" />
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container two-col">
          <div>
            <h2>Dimension prophétique</h2>
            <p>{leSiwak.propheticIntro}</p>
            {leSiwak.quotes.map((q, i) => (
              <Reveal key={q.text} delay={i * 100}>
                <div className="quote">
                  « {q.text} »
                  <cite>{q.source}</cite>
                </div>
              </Reveal>
            ))}
            <p>{leSiwak.propheticOutro}</p>
          </div>
          <Reveal className="hero-visual placeholder-img">
            <img src={leSiwak.image2} alt="Brosse à dents Siwakare en bois naturel" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
