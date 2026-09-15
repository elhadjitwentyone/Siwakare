import fallback from "@/data/sales.json";

export type Sale = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  product?: string;
  note?: string;
};

export type SalesData = { sales: Sale[] };

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// Journal de ventes confirmées, saisi à la main dans /admin. Le site n'a
// aucun moyen de savoir si une commande WhatsApp a réellement été payée —
// ce fichier est la seule source de chiffre d'affaires réel, par opposition
// à la valeur des simples clics "Commander" (déjà suivie par le Pixel/GA4).
export async function getSales(): Promise<SalesData> {
  if (!GITHUB_REPO) return fallback as SalesData;
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/data/sales.json`, {
      cache: "no-store",
    });
    if (!res.ok) return fallback as SalesData;
    return (await res.json()) as SalesData;
  } catch {
    return fallback as SalesData;
  }
}
