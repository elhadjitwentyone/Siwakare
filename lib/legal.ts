// Informations légales de l'exploitant, affichées sur /mentions-legales.
// Un champ laissé vide n'est pas affiché : à compléter avec les vraies
// informations de l'entreprise (nom / raison sociale, NINEA, RCCM, adresse,
// email, téléphone) — ne rien inventer.
export const LEGAL = {
  site: "Siwakare",
  url: "https://siwakare-complete1.vercel.app",
  exploitant: "",
  formeJuridique: "",
  ninea: "",
  rccm: "",
  adresse: "Dakar, Sénégal",
  email: "",
  telephone: "",
  directeurPublication: "",
};

export const RETURN_DAYS = 7;
export const DELIVERY_FEE_DAKAR = 1000;
// Livraison offerte à Dakar à partir de ce montant (= Pack Découverte, le moins cher des packs).
export const FREE_DELIVERY_MIN_PRICE = 5000;
export const isFreeDelivery = (price: number) => price >= FREE_DELIVERY_MIN_PRICE;
export const LAST_UPDATE = "1er octobre 2026";
