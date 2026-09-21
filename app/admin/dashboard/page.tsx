"use client";

import { useEffect, useState } from "react";
import type { Sale } from "@/lib/sales";

const inputStyle: React.CSSProperties = { width: "100%", padding: 10, marginBottom: 10 };

function startOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [note, setNote] = useState("");

  async function tryLoad() {
    const res = await fetch("/api/admin/sales");
    if (res.ok) {
      const data = await res.json();
      setSales(data.sales);
      setAuthed(true);
    }
  }

  useEffect(() => {
    tryLoad();
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
      await tryLoad();
    } else {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "Erreur de connexion.");
    }
  }

  async function addSale(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !date) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, amount: Number(amount), product, note }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setSales((prev) => (prev ? [data.sale, ...prev] : [data.sale]));
      setAmount("");
      setProduct("");
      setNote("");
      setMessage("✅ Vente enregistrée.");
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(`❌ ${data.error || "Échec de l'enregistrement."}`);
    }
  }

  async function removeSale(id: string) {
    if (!sales) return;
    const res = await fetch("/api/admin/sales", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSales(sales.filter((s) => s.id !== id));
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 380, margin: "80px auto", padding: 24 }}>
        <h1 style={{ fontSize: "1.5rem" }}>Tableau de bord Siwakare</h1>
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

  if (!sales) return <main style={{ padding: 40 }}>Chargement…</main>;

  const monthStart = startOfMonth();
  const totalAll = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalMonth = sales.filter((s) => s.date >= monthStart).reduce((sum, s) => sum + s.amount, 0);

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px" }}>
      <h1>Tableau de bord Siwakare</h1>
      <p style={{ color: "#666" }}>
        <a href="/admin">← Retour à l'édition du contenu</a>
      </p>

      <section style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: ".8rem", color: "#999", textTransform: "uppercase" }}>Chiffre d'affaires total</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{totalAll.toLocaleString("fr-FR")} FCFA</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: ".8rem", color: "#999", textTransform: "uppercase" }}>Ce mois-ci</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{totalMonth.toLocaleString("fr-FR")} FCFA</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: ".8rem", color: "#999", textTransform: "uppercase" }}>Nombre de ventes</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{sales.length}</div>
        </div>
      </section>

      <section style={{ marginTop: 30, background: "#fbf7ee", border: "1px dashed #d8c9a3", borderRadius: 10, padding: 18 }}>
        <strong>Visites en direct, sources, insights</strong>
        <p style={{ margin: "6px 0 0", fontSize: ".9rem", color: "#666" }}>
          À venir — nécessite un accès à l'API Google Analytics (compte de service Google Cloud), en cours de mise en place.
        </p>
      </section>

      <section style={{ marginTop: 36, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h2>Enregistrer une vente confirmée</h2>
        <form onSubmit={addSale}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Montant (FCFA)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="9000"
                style={inputStyle}
              />
            </div>
          </div>
          <label>Produit (optionnel)</label>
          <input value={product} onChange={(e) => setProduct(e.target.value)} style={inputStyle} placeholder="Pâte Dentifrice Siwakare — Pack Essentiel (5 pâtes)" />
          <label>Note (optionnel)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} style={inputStyle} placeholder="Client fidèle, Dakar..." />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Enregistrement…" : "Ajouter la vente"}
          </button>
          {message && <span style={{ marginLeft: 12 }}>{message}</span>}
        </form>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Historique</h2>
        {sales.length === 0 && <p style={{ color: "#999" }}>Aucune vente enregistrée pour l'instant.</p>}
        {sales.map((s) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{s.amount.toLocaleString("fr-FR")} FCFA</strong>
              <span style={{ color: "#999", marginLeft: 10 }}>{s.date}</span>
              {s.product && <div style={{ fontSize: ".9rem", color: "#666" }}>{s.product}</div>}
              {s.note && <div style={{ fontSize: ".85rem", color: "#999" }}>{s.note}</div>}
            </div>
            <button type="button" className="btn btn-outline" onClick={() => removeSale(s.id)}>
              Supprimer
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
