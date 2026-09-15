// Petite couche de tracking partagée par le site.
// Pas de dépendance externe : on parle directement à window.fbq (Meta Pixel)
// et window.gtag (GA4), posés par components/Analytics.tsx.

export type TrackEventName = "ViewContent" | "Lead" | "InitiateCheckout";

const GA4_EVENT_MAP: Record<TrackEventName, string> = {
  ViewContent: "view_item",
  Lead: "generate_lead",
  InitiateCheckout: "begin_checkout",
};

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function newEventId(): string {
  const c = (globalThis as any).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Envoie le même événement côté serveur (Meta Conversions API), avec le
// même event_id que le Pixel navigateur pour que Meta déduplique les deux
// au lieu de compter l'événement deux fois. Best-effort : si /api/track
// échoue ou que le Pixel n'est pas configuré, ça ne bloque jamais l'achat.
function sendServerEvent(
  name: TrackEventName,
  eventId: string,
  customData: Record<string, unknown>,
  userData: { phone?: string }
) {
  try {
    const payload = JSON.stringify({
      event_name: name,
      event_id: eventId,
      custom_data: customData,
      phone: userData.phone,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      event_source_url: window.location.href,
    });
    const sent = navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }));
    if (!sent) {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(
        () => {}
      );
    }
  } catch {
    // best-effort
  }
}

export function trackEvent(
  name: TrackEventName,
  customData: Record<string, unknown> = {},
  userData: { phone?: string } = {}
) {
  if (typeof window === "undefined") return;
  const w = window as any;
  const eventId = newEventId();
  if (typeof w.fbq === "function") w.fbq("track", name, customData, { eventID: eventId });
  if (typeof w.gtag === "function") w.gtag("event", GA4_EVENT_MAP[name], customData);
  sendServerEvent(name, eventId, customData, userData);
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
