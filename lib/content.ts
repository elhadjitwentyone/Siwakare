import fallback from "@/data/content.json";
import { fetchGithubFile } from "@/lib/github";

// Une variante = une formule d'achat pour le même produit (unité seule,
// offre groupée...). Le client choisit une variante ; prix et image
// s'ajustent en conséquence.
export type Variant = {
  id: string;
  label: string;
  price: number;
  oldPrice?: number | null;
  image?: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice: number | null;
  featured: boolean;
  outOfStock?: boolean;
  freeGift?: string;
  variants?: Variant[];
  image: string;
  includes: string[];
  why: string[];
  faq: { q: string; a: string }[];
};

export type Testimonial = { stars: number; text: string; author: string };
export type Quote = { text: string; source: string };

export type Content = {
  hero: { title: string; subtitle: string; image: string };
  products: Product[];
  testimonials: Testimonial[];
  leSiwak: {
    origin: string;
    benefits: string[];
    image1: string;
    propheticIntro: string;
    quotes: Quote[];
    propheticOutro: string;
    image2: string;
  };
  livraison: {
    zones: string[];
    paymentMethods: string[];
  };
  contact: {
    intro: string;
  };
};

// Le contenu (textes, prix, images des packs) est stocké dans data/content.json
// sur GitHub. L'admin (/admin) le modifie directement via l'API GitHub — ça
// n'a AUCUN impact sur les déploiements Vercel (aucun rebuild déclenché).
// On lit ce fichier à chaque requête pour que les modifications soient
// visibles immédiatement, sans redéploiement.
export async function getContent(): Promise<Content> {
  const text = await fetchGithubFile("data/content.json");
  if (!text) return fallback as Content;
  try {
    return JSON.parse(text) as Content;
  } catch {
    return fallback as Content;
  }
}
