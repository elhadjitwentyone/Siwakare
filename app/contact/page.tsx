import { waLink } from "@/components/ui";

export const metadata = { title: "Contact — Siwakare" };

export default function Contact() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Contact</h1>
          <p>Écris-nous sur WhatsApp, on te répond rapidement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="card">
            <span className="icon">💬</span>
            <h3>WhatsApp</h3>
            <p>Le moyen le plus rapide de commander ou poser une question.</p>
            <a href={waLink("Salam, je vous contacte depuis le site Siwakare.")} target="_blank" className="btn btn-whatsapp">
              Discuter sur WhatsApp
            </a>
          </div>
          <div className="card">
            <span className="icon">✉️</span>
            <h3>Formulaire</h3>
            <p>Laisse-nous ton message, on te recontacte au plus vite.</p>
            <form
              action={waLink("Salam, voici mon message : ")}
              method="get"
              target="_blank"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <input name="nom" placeholder="Ton nom" style={{ padding: 10, borderRadius: 8, border: "1px solid #ece4cf" }} />
              <input name="tel" placeholder="Ton téléphone" style={{ padding: 10, borderRadius: 8, border: "1px solid #ece4cf" }} />
              <textarea placeholder="Ton message" rows={4} style={{ padding: 10, borderRadius: 8, border: "1px solid #ece4cf" }} />
              <button type="submit" className="btn btn-primary">Envoyer via WhatsApp</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
