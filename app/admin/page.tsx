"use client";

import { useEffect, useState } from "react";
import type { Content, Product } from "@/lib/content";

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
      setMessage("✅ Enregistré. Les changements sont visibles immédiatement sur le site (aucun redéploiement Vercel nécessaire).");
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(`❌ ${data.error || "Échec de la sauvegarde."}`);
    }
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    if (!content) return;
    const products = [...content.products];
    products[index] = { ...products[index], ...patch };
    setContent({ ...content, products });
  }

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

  if (!content) return <main style={{ padding: 40 }}>Chargement…</main>;

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px" }}>
      <h1>Admin Siwakare</h1>
      <p style={{ color: "#666" }}>
        Modifie les textes, prix et images des produits. Enregistrer met le site à jour immédiatement, sans
        redéploiement Vercel.
      </p>

      <section style={{ marginTop: 30 }}>
        <h2>Accueil</h2>
        <label>Titre principal</label>
        <textarea
          value={content.hero.title}
          onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
          rows={2}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <label>Sous-titre</label>
        <textarea
          value={content.hero.subtitle}
          onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
          rows={3}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <label>Numéro WhatsApp (format international sans +, ex: 221xxxxxxxxx)</label>
        <input
          value={content.whatsapp}
          onChange={(e) => setContent({ ...content, whatsapp: e.target.value })}
          style={{ width: "100%", padding: 10 }}
        />
      </section>

      {content.products.map((p, i) => (
        <section key={p.slug} style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
          <h2>{p.name}</h2>
          <label>Nom</label>
          <input
            value={p.name}
            onChange={(e) => updateProduct(i, { name: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <label>Accroche</label>
          <textarea
            value={p.tagline}
            onChange={(e) => updateProduct(i, { tagline: e.target.value })}
            rows={2}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Prix (FCFA)</label>
              <input
                type="number"
                value={p.price}
                onChange={(e) => updateProduct(i, { price: Number(e.target.value) })}
                style={{ width: "100%", padding: 10, marginBottom: 10 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Ancien prix (optionnel)</label>
              <input
                type="number"
                value={p.oldPrice ?? ""}
                onChange={(e) => updateProduct(i, { oldPrice: e.target.value ? Number(e.target.value) : null })}
                style={{ width: "100%", padding: 10, marginBottom: 10 }}
              />
            </div>
          </div>
          <label>Image (URL — /images/... existante ou lien externe)</label>
          <input
            value={p.image}
            onChange={(e) => updateProduct(i, { image: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          {p.image && <img src={p.image} alt={p.name} style={{ maxWidth: 160, borderRadius: 8, marginBottom: 10 }} />}
          <label>Contenu du produit (une ligne par élément)</label>
          <textarea
            value={p.includes.join("\n")}
            onChange={(e) => updateProduct(i, { includes: e.target.value.split("\n").filter(Boolean) })}
            rows={3}
            style={{ width: "100%", padding: 10 }}
          />
        </section>
      ))}

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
