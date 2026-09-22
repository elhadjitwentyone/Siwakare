import fallback from "@/data/orders.json";
import { fetchGithubFile } from "@/lib/github";

export type Order = {
  id: string;
  date: string; // ISO
  product: string;
  price: number;
  delivery?: string;
  name: string;
  address: string;
  phone: string;
};

export type OrdersData = { orders: Order[] };

// Même principe que lib/sales.ts : data/orders.json committé sur GitHub sert
// de base de données pour les commandes reçues via le formulaire du site.
export async function getOrders(): Promise<OrdersData> {
  const text = await fetchGithubFile("data/orders.json");
  if (!text) return fallback as OrdersData;
  try {
    return JSON.parse(text) as OrdersData;
  } catch {
    return fallback as OrdersData;
  }
}
