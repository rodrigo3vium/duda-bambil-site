/**
 * Meta Pixel — eventos de conversão do site.
 *
 * O snippet do pixel é injetado em app/layout.tsx e só dispara PageView. Os
 * eventos de conversão (Lead, InitiateCheckout, Contact) saem daqui.
 *
 * Todo evento leva um `event_id` (uuid). Ele existe para DEDUPLICAÇÃO: quando a
 * API de Conversões (CAPI) entrar, o mesmo evento vai chegar por dois caminhos
 * (browser + servidor) e o Meta descarta a duplicata quando os dois trazem o
 * mesmo event_id. Por isso o event_id do InitiateCheckout viaja junto pro
 * checkout da Kiwify (parâmetro `s2`) — é o fio que liga o clique à compra.
 *
 * CAPI não está implementada; nada aqui chama servidor.
 */

export type PixelEvent = "Lead" | "InitiateCheckout" | "Contact";

type FbqParams = Record<string, string | number | null | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** uuid v4. `crypto.randomUUID` quando existe; senão, fallback suficiente pra dedup. */
export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // segue pro fallback
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Dispara um evento no pixel. Devolve o event_id usado (gera um se não vier).
 * Nunca lança: pixel bloqueado por adblock não pode quebrar o fluxo.
 */
export function trackPixel(
  event: PixelEvent,
  params: FbqParams = {},
  eventId?: string,
): string {
  const id = eventId ?? newEventId();

  try {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return id;

    const limpos: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined && v !== "") limpos[k] = v;
    }

    window.fbq("track", event, limpos, { eventID: id });
  } catch {
    // pixel indisponível — segue o fluxo
  }

  return id;
}

/** Lead: submit de formulário bem-sucedido (qualquer formulário do site). */
export function trackLead(params: FbqParams = {}, eventId?: string): string {
  return trackPixel("Lead", params, eventId);
}

/** InitiateCheckout: clique que leva pro checkout. */
export function trackInitiateCheckout(
  params: FbqParams = {},
  eventId?: string,
): string {
  return trackPixel("InitiateCheckout", params, eventId);
}

/** Contact: clique que leva pro WhatsApp da Duda (ver utils/whatsappBotoes.ts). */
export function trackContact(params: FbqParams = {}, eventId?: string): string {
  return trackPixel("Contact", params, eventId);
}
