import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ContactForm } from "@/components/ContactForm";

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
            <WhatsAppCTA message="Salam, je vous contacte depuis le site Siwakare." className="btn btn-whatsapp">
              Discuter sur WhatsApp
            </WhatsAppCTA>
          </div>
          <div className="card">
            <span className="icon">✉️</span>
            <h3>Formulaire</h3>
            <p>Laisse-nous ton message, on te recontacte au plus vite.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
