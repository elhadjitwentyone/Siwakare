import fallback from "@/data/orders.json";

export type Order = {
  id: string;
  date: string; // ISO
  product: string;
  price: number;
  name: string;
  address: string;
  phone: string;
};

export type OrdersData = { orders: Order[] };

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// Même principe que lib/sales.ts : data/orders.json committé sur GitHub sert
// de base de données pour les commandes reçues via le formulaire du site.
export async function getOrders(): Promise<OrdersData> {
  if (!GITHUB_REPO) return fallback as OrdersData;
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/data/orders.json`, {
      cache: "no-store",
    });
    if (!res.ok) return fallback as OrdersData;
    return (await res.json()) as OrdersData;
  } catch {
    return fallback as OrdersData;
  }
}
