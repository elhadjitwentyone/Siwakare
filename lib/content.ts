import fallback from "@/data/content.json";

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
  whatsapp: string;
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

const GITHUB_REPO = process.env.GITHUB_REPO; // ex: "owner/siwakare"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// Le contenu (textes, prix, images des packs) est stocké dans data/content.json
// sur GitHub. L'admin (/admin) le modifie directement via l'API GitHub — ça
// n'a AUCUN impact sur les déploiements Vercel (aucun rebuild déclenché).
// On lit ce fichier à chaque requête pour que les modifications soient
// visibles immédiatement, sans redéploiement.
export async function getContent(): Promise<Content> {
  if (!GITHUB_REPO) return fallback as Content;
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/data/content.json`,
      { cache: "no-store" }
    );
    if (!res.ok) return fallback as Content;
    return (await res.json()) as Content;
  } catch {
    return fallback as Content;
  }
}
