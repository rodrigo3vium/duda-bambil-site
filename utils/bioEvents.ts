/**
 * Analytics leve do Direcionador — NO-OP por enquanto.
 *
 * O minisite da Giulia gravava esses eventos numa tabela `bio_events` do Supabase.
 * Aqui o Supabase foi removido (o backend de leads vai ser uma planilha simples,
 * ver utils/bioLead.ts). As chamadas `fireBioEvent(...)` continuam espalhadas pela
 * UI de propósito: quando houver um destino de analytics (um endpoint, um webhook,
 * a própria planilha), basta implementar `trackBioEvent` aqui — nenhum componente
 * muda. Em dev, loga no console pra dar visibilidade.
 */

export type BioEventType =
  | "step_view"
  | "option_click"
  | "lead_submit"
  | "produto_click"
  | "agendamento_click"
  | "chat_open"
  | "chat_routing"
  | "chat_error";

export interface BioEventPayload {
  event_type: BioEventType;
  step?: string | null;
  option?: string | null;
  produto_slug?: string | null;
  lead_id?: string | null;
  meta?: Record<string, unknown> | null;
}

/** Grava um evento. Hoje é no-op (só loga em dev). Nunca quebra o fluxo. */
export async function trackBioEvent(payload: BioEventPayload): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[bio-event]", payload.event_type, payload.step ?? "", payload);
  }
  // TODO(backend): enviar pro destino de analytics quando existir.
}

/** Dispara sem aguardar (use quando não precisa do resultado). */
export function fireBioEvent(payload: BioEventPayload): void {
  void trackBioEvent(payload);
}
