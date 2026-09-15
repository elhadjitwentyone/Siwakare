// Petite couche de tracking partagée par le site.
// Pas de dépendance externe : on parle directement à window.fbq (Meta Pixel)
// et window.gtag (GA4), posés par components/Analytics.tsx.

export type TrackEventName = "ViewContent" | "Lead" | "InitiateCheckout";

const GA4_EVENT_MAP: Record<TrackEventName, string> = {
  ViewContent: "view_item",
  Lead: "generate_lead",
  InitiateCheckout: "begin_checkout",
};

export function trackEvent(name: TrackEventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.fbq === "function") w.fbq("track", name, params);
  if (typeof w.gtag === "function") w.gtag("event", GA4_EVENT_MAP[name], params);
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;
type UtmKey = (typeof UTM_KEYS)[number];
export type UtmData = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "siwakare_utm";

// Capture les paramètres de campagne à l'arrivée sur le site et les garde
// pour toute la session, même si le visiteur navigue sur une page sans UTM
// dans l'URL (ex: il clique depuis la pub vers /, puis va sur /produits).
export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: UtmData = {};
  let hasAny = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      found[key] = value;
      hasAny = true;
    }
  }
  if (hasAny) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {
      // stockage indisponible (navigation privée stricte) : tant pis, pas bloquant
    }
  }
}

export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}

// Ajoute un court tag lisible à la fin du message WhatsApp, pour retracer
// manuellement quelle campagne a amené la commande (pas d'API de paiement
// à brancher, donc c'est la seule attribution possible côté vendeur).
export function utmSourceTag(utm: UtmData): string {
  const source = utm.utm_source || (utm.fbclid ? "facebook" : utm.gclid ? "google" : null);
  const campaign = utm.utm_campaign;
  if (!source && !campaign) return "";
  return ` [src:${[source, campaign].filter(Boolean).join("/")}]`;
}
