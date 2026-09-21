import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/ui";
import { PromoBar } from "@/components/PromoBar";
import { Analytics } from "@/components/Analytics";
import { UtmCapture } from "@/components/UtmCapture";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Siwakare — Le siwak naturel, sunna et écologique | Sénégal",
  description:
    "Siwakare vend le siwak (miswak) au Sénégal, en bâton traditionnel et en pâte dentifrice avec brosse à dents offerte : hygiène bucco-dentaire naturelle, économique et traditionnelle (sunna). Livraison Dakar & grandes villes, paiement Wave, Orange Money, cash à la livraison.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Analytics />
        <UtmCapture />
        <div className="top-sticky">
          <PromoBar />
          <Header />
        </div>
        {children}
        <Footer />
                <VercelAnalytics />
      </body>
    </html>
  );
}
