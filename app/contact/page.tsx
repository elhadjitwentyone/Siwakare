import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact — Siwakare" };

export default async function Contact() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Contact</h1>
          <p>Écris-nous, on te répond rapidement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
