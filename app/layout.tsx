import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, WhatsAppFloating } from "@/components/ui";
import { Analytics } from "@/components/Analytics";
import { UtmCapture } from "@/components/UtmCapture";

export const metadata: Metadata = {
  title: "Siwakare — Le siwak naturel, sunna et écologique | Sénégal",
  description:
    "Siwakare vend des packs de siwak (miswak) et dentifrice au siwak au Sénégal : hygiène bucco-dentaire naturelle, économique et traditionnelle (sunna). Livraison Dakar & grandes villes, paiement Wave, Orange Money, cash à la livraison.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Analytics />
        <UtmCapture />
        <Header />
        {children}
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
