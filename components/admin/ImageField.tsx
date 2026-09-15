"use client";

import { useState } from "react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      // "data:image/jpeg;base64,AAAA..." -> on ne garde que la partie base64
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Champ image réutilisable dans l'admin : URL modifiable à la main, ou
// upload direct d'un fichier (committé sur GitHub sous public/images/ —
// voir /api/admin/upload). Un upload nécessite un redéploiement Vercel
// pour apparaître sur le site (déclenché automatiquement si le Deploy
// Hook est configuré).
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Image trop lourde (4 Mo max).");
      return;
    }
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi.");
      onChange(data.path);
      setNotice(
        data.redeployTriggered
          ? "✅ Envoyée — redéploiement lancé, visible sur le site dans 1 à 2 minutes."
          : "✅ Envoyée sur GitHub — redéploie le site sur Vercel pour qu'elle apparaisse."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <label>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... ou URL externe"
          style={{ flex: 1, padding: 10 }}
        />
        {value && <img src={value} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />}
      </div>
      <div style={{ marginTop: 6 }}>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        {uploading && <span style={{ marginLeft: 8, fontSize: ".85rem", color: "#666" }}>Envoi en cours…</span>}
      </div>
      {notice && <p style={{ fontSize: ".85rem", color: "green", margin: "4px 0 0" }}>{notice}</p>}
      {error && <p style={{ fontSize: ".85rem", color: "crimson", margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}
