import { notFound } from "next/navigation";
import { ProductPage } from "@/components/ui";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { products } = await getContent();
  const p = products.find((x) => x.slug === params.slug);
  return { title: p ? `${p.name} — Siwakare` : "Pack — Siwakare" };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { products } = await getContent();
  const p = products.find((x) => x.slug === params.slug);
  if (!p) notFound();

  return (
    <ProductPage
      name={p.name}
      tagline={p.tagline}
      fcfa={p.price}
      oldFcfa={p.oldPrice ?? undefined}
      includes={p.includes}
      why={p.why}
      faq={p.faq}
      image={p.image}
      outOfStock={p.outOfStock}
      freeGift={p.freeGift}
      bundles={p.bundles}
    />
  );
}
