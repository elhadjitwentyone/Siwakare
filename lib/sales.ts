import fallback from "@/data/sales.json";
import { fetchGithubFile } from "@/lib/github";

export type Sale = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  product?: string;
  note?: string;
};

export type SalesData = { sales: Sale[] };

// Journal de ventes confirmées, saisi à la main dans /admin. Le site n'a
// aucun moyen de savoir si une commande a réellement été payée — ce fichier
// est la seule source de chiffre d'affaires réel, par opposition à la valeur
// des commandes reçues (déjà suivie dans data/orders.json et le Pixel/GA4).
export async function getSales(): Promise<SalesData> {
  const text = await fetchGithubFile("data/sales.json");
  if (!text) return fallback as SalesData;
  try {
    return JSON.parse(text) as SalesData;
  } catch {
    return fallback as SalesData;
  }
}
