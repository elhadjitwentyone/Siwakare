"use client";

import { useEffect, useState } from "react";
import type { Content, Product, Variant, Testimonial, Quote } from "@/lib/content";
import { ImageField } from "@/components/admin/ImageField";

const inputStyle: React.CSSProperties = { width: "100%", padding: 10, marginBottom: 10 };
const cardStyle: React.CSSProperties = { border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 12 };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function tryLoadContent() {
    const res = await fetch("/api/admin/content");
    if (res.ok) {
      setContent(await res.json());
      setAuthed(true);
    }
  }

  useEffect(() => {
    tryLoadContent();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      await tryLoadContent();
    } else {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "Erreur de connexion.");
    }
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("✅ Enregistré. Les changements de texte/prix sont visibles immédiatement (aucun redéploiement nécessaire) ; une image ajoutée par upload devient visible après le redéploiement déclenché automatiquement.");
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(`❌ ${data.error || "Échec de la sauvegarde."}`);
    }
  }

  if (!content) {
    if (!authed) {
      return (
        <main style={{ maxWidth: 380, margin: "80px auto", padding: 24 }}>
          <h1 style={{ fontSize: "1.5rem" }}>Admin Siwakare</h1>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button type="submit" className="btn btn-primary">Se connecter</button>
            {loginError && <p style={{ color: "crimson" }}>{loginError}</p>}
          </form>
        </main>
      );
    }
    return <main style={{ padding: 40 }}>Chargement…</main>;
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    if (!content) return;
    const products = [...content.products];
    products[index] = { ...products[index], ...patch };
    setContent({ ...content, products });
  }

  function updateVariant(productIndex: number, variantIndex: number, patch: Partial<Variant>) {
    if (!content) return;
    const products = [...content.products];
    const variants = [...(products[productIndex].variants || [])];
    variants[variantIndex] = { ...variants[variantIndex], ...patch };
    products[productIndex] = { ...products[productIndex], variants };
    setContent({ ...content, products });
  }

  function addVariant(productIndex: number) {
    if (!content) return;
    const products = [...content.products];
    const variants = [...(products[productIndex].variants || []), { id: `variante-${Date.now()}`, label: "", price: 0 }];
    products[productIndex] = { ...products[productIndex], variants };
    setContent({ ...content, products });
  }

  function removeVariant(productIndex: number, variantIndex: number) {
    if (!content) return;
    const products = [...content.products];
    products[productIndex] = {
      ...products[productIndex],
      variants: (products[productIndex].variants || []).filter((_, idx) => idx !== variantIndex),
    };
    setContent({ ...content, products });
  }

  function updateTestimonial(i: number, patch: Partial<Testimonial>) {
    if (!content) return;
    const testimonials = [...content.testimonials];
    testimonials[i] = { ...testimonials[i], ...patch };
    setContent({ ...content, testimonials });
  }
  function addTestimonial() {
    if (!content) return;
    setContent({ ...content, testimonials: [...content.testimonials, { stars: 5, text: "", author: "" }] });
  }
  function removeTestimonial(i: number) {
    if (!content) return;
    setContent({ ...content, testimonials: content.testimonials.filter((_, idx) => idx !== i) });
  }

  function updateLeSiwak(patch: Partial<Content["leSiwak"]>) {
    if (!content) return;
    setContent({ ...content, leSiwak: { ...content.leSiwak, ...patch } });
  }
  function updateQuote(i: number, patch: Partial<Quote>) {
    if (!content) return;
    const quotes = [...content.leSiwak.quotes];
    quotes[i] = { ...quotes[i], ...patch };
    updateLeSiwak({ quotes });
  }
  function addQuote() {
    if (!content) return;
    updateLeSiwak({ quotes: [...content.leSiwak.quotes, { text: "", source: "" }] });
  }
  function removeQuote(i: number) {
    if (!content) return;
    updateLeSiwak({ quotes: content.leSiwak.quotes.filter((_, idx) => idx !== i) });
  }

  function updateLivraison(patch: Partial<Content["livraison"]>) {
    if (!content) return;
    setContent({ ...content, livraison: { ...content.livraison, ...patch } });
  }
  function updateContact(patch: Partial<Content["contact"]>) {
    if (!content) return;
    setContent({ ...content, contact: { ...content.contact, ...patch } });
  }

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px" }}>
      <h1>Admin Siwakare</h1>
      <p style={{ color: "#666" }}>
        Modifie tout le contenu du site : accueil, produits, formules, témoignages, pages "Le siwak", "Livraison
        & paiement" et "Contact". Les images peuvent être téléversées directement.
      </p>
      <p><a href="/admin/dashboard">📊 Voir le tableau de bord (ventes, visites)</a></p>

      <section style={{ marginTop: 30 }}>
        <h2>Accueil</h2>
        <label>Titre principal</label>
        <textarea
          value={content.hero.title}
          onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
          rows={2}
          style={inputStyle}
        />
        <label>Sous-titre</label>
        <textarea
          value={content.hero.subtitle}
          onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
          rows={3}
          style={inputStyle}
        />
        <ImageField
          label="Image d'accueil"
          value={content.hero.image}
          onChange={(path) => setContent({ ...content, hero: { ...content.hero, image: path } })}
        />
      </section>

      <section style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h2>Témoignages (accueil)</h2>
        {content.testimonials.map((t, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 90 }}>
                <label>Étoiles</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={t.stars}
                  onChange={(e) => updateTestimonial(i, { stars: Number(e.target.value) })}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Auteur</label>
                <input
                  value={t.author}
                  onChange={(e) => updateTestimonial(i, { author: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            <label>Avis</label>
            <textarea
              value={t.text}
              onChange={(e) => updateTestimonial(i, { text: e.target.value })}
              rows={2}
              style={inputStyle}
            />
            <button type="button" className="btn btn-outline" onClick={() => removeTestimonial(i)}>
              Supprimer ce témoignage
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={addTestimonial}>
          + Ajouter un témoignage
        </button>
      </section>

      {content.products.map((p, i) => (
        <section key={p.slug} style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
          <h2>{p.name || `Produit ${i + 1}`}</h2>
          <label>Nom</label>
          <input value={p.name} onChange={(e) => updateProduct(i, { name: e.target.value })} style={inputStyle} />
          <label>Accroche</label>
          <textarea
            value={p.tagline}
            onChange={(e) => updateProduct(i, { tagline: e.target.value })}
            rows={2}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Prix (FCFA)</label>
              <input
                type="number"
                value={p.price}
                onChange={(e) => updateProduct(i, { price: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Ancien prix (optionnel)</label>
              <input
                type="number"
                value={p.oldPrice ?? ""}
                onChange={(e) => updateProduct(i, { oldPrice: e.target.value ? Number(e.target.value) : null })}
                style={inputStyle}
              />
            </div>
          </div>
          <ImageField label="Image" value={p.image} onChange={(path) => updateProduct(i, { image: path })} />
          <label>Cadeau offert (optionnel, ex: "1 brosse à dents offerte")</label>
          <input
            value={p.freeGift || ""}
            onChange={(e) => updateProduct(i, { freeGift: e.target.value })}
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={Boolean(p.outOfStock)}
              onChange={(e) => updateProduct(i, { outOfStock: e.target.checked })}
            />
            En rupture de stock
          </label>
          <label>Ce que le client reçoit (une ligne par élément)</label>
          <textarea
            value={p.includes.join("\n")}
            onChange={(e) => updateProduct(i, { includes: e.target.value.split("\n").filter(Boolean) })}
            rows={3}
            style={inputStyle}
          />
          <label>Pourquoi choisir ce produit (une ligne par élément)</label>
          <textarea
            value={p.why.join("\n")}
            onChange={(e) => updateProduct(i, { why: e.target.value.split("\n").filter(Boolean) })}
            rows={3}
            style={inputStyle}
          />

          <h3 style={{ marginTop: 20 }}>Formules / offres groupées</h3>
          {(p.variants || []).map((v, vi) => (
            <div key={v.id} style={cardStyle}>
              <label>Libellé (ex: "2 achetées = 50 % de réduction sur la 3ème (3 pâtes + 3 brosses)")</label>
              <input
                value={v.label}
                onChange={(e) => updateVariant(i, vi, { label: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label>Prix (FCFA)</label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(i, vi, { price: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Prix barré (optionnel)</label>
                  <input
                    type="number"
                    value={v.oldPrice ?? ""}
                    onChange={(e) =>
                      updateVariant(i, vi, { oldPrice: e.target.value ? Number(e.target.value) : null })
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
              <ImageField
                label="Image de cette formule"
                value={v.image || ""}
                onChange={(path) => updateVariant(i, vi, { image: path })}
              />
              <button type="button" className="btn btn-outline" onClick={() => removeVariant(i, vi)}>
                Supprimer cette formule
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={() => addVariant(i)}>
            + Ajouter une formule
          </button>
        </section>
      ))}

      <section style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h2>Page "Le siwak, c'est quoi ?"</h2>
        <label>Origine</label>
        <textarea
          value={content.leSiwak.origin}
          onChange={(e) => updateLeSiwak({ origin: e.target.value })}
          rows={3}
          style={inputStyle}
        />
        <label>Bienfaits (une ligne par élément)</label>
        <textarea
          value={content.leSiwak.benefits.join("\n")}
          onChange={(e) => updateLeSiwak({ benefits: e.target.value.split("\n").filter(Boolean) })}
          rows={4}
          style={inputStyle}
        />
        <ImageField
          label="Image — section Origine"
          value={content.leSiwak.image1}
          onChange={(path) => updateLeSiwak({ image1: path })}
        />
        <label>Introduction — dimension prophétique</label>
        <textarea
          value={content.leSiwak.propheticIntro}
          onChange={(e) => updateLeSiwak({ propheticIntro: e.target.value })}
          rows={3}
          style={inputStyle}
        />
        <h3>Citations (hadiths)</h3>
        {content.leSiwak.quotes.map((q, i) => (
          <div key={i} style={cardStyle}>
            <label>Texte</label>
            <textarea
              value={q.text}
              onChange={(e) => updateQuote(i, { text: e.target.value })}
              rows={2}
              style={inputStyle}
            />
            <label>Source</label>
            <input value={q.source} onChange={(e) => updateQuote(i, { source: e.target.value })} style={inputStyle} />
            <button type="button" className="btn btn-outline" onClick={() => removeQuote(i)}>
              Supprimer cette citation
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={addQuote} style={{ marginBottom: 16 }}>
          + Ajouter une citation
        </button>
        <label>Conclusion — dimension prophétique</label>
        <textarea
          value={content.leSiwak.propheticOutro}
          onChange={(e) => updateLeSiwak({ propheticOutro: e.target.value })}
          rows={3}
          style={inputStyle}
        />
        <ImageField
          label="Image — section prophétique"
          value={content.leSiwak.image2}
          onChange={(path) => updateLeSiwak({ image2: path })}
        />
      </section>

      <section style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h2>Page "Livraison & paiement"</h2>
        <label>Zones desservies (une ligne par élément)</label>
        <textarea
          value={content.livraison.zones.join("\n")}
          onChange={(e) => updateLivraison({ zones: e.target.value.split("\n").filter(Boolean) })}
          rows={3}
          style={inputStyle}
        />
        <label>Modes de paiement (une ligne par élément)</label>
        <textarea
          value={content.livraison.paymentMethods.join("\n")}
          onChange={(e) => updateLivraison({ paymentMethods: e.target.value.split("\n").filter(Boolean) })}
          rows={3}
          style={inputStyle}
        />
      </section>

      <section style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h2>Page "Contact"</h2>
        <label>Texte d'introduction (Contact)</label>
        <textarea
          value={content.contact.intro}
          onChange={(e) => updateContact({ intro: e.target.value })}
          rows={2}
          style={inputStyle}
        />
      </section>

      <div style={{ marginTop: 30, display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {message && <span>{message}</span>}
      </div>
      <p style={{ marginTop: 10, fontSize: ".85rem", color: "#999" }}>
        Note : changer le code ou la structure du site nécessite un déploiement Vercel, déclenché uniquement sur
        ton autorisation.
      </p>
    </main>
  );
}
