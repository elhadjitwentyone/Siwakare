export function PriceTag({ fcfa }: { fcfa: number }) {
  return <span className="price">{fcfa.toLocaleString("fr-FR")} FCFA</span>;
}
