import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

// Catalogue public minimal (nom, prix, variantes) consommé par le
// sélecteur de bundle du formulaire de commande générique (OrderModal),
// qui n'a pas accès aux données serveur de getContent(). force-dynamic
// évite que Next.js ne fige cette route au build : le catalogue doit
// refléter les changements faits depuis /admin sans redéploiement.
export const dynamic = "force-dynamic";

export async function GET() {
  const { products } = await getContent();
  const list = products
    .filter((p) => !p.outOfStock)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      variants: (p.variants ?? []).map((v) => ({ id: v.id, label: v.label, price: v.price })),
    }));
  return NextResponse.json({ products: list });
}
