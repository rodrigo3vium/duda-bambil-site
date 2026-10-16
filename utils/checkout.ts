/**
 * Checkout — única forma sancionada de mandar alguém pra Kiwify.
 *
 * `buildCheckoutUrl` lê a atribuição do store (lib/attribution.ts) e carimba a
 * URL do checkout com os parâmetros que a Kiwify aceita nativamente:
 *
 *   utm_source, utm_medium, utm_campaign, utm_term, utm_content
 *                → LAST touch, um valor por parâmetro (não concatenado)
 *   src          → utm_source do last touch
 *   sck          → FIRST touch concatenado por "|", na ordem
 *                  source|medium|campaign|term|content
 *   s1           → fbclid
 *   s2           → event_id do InitiateCheckout (dedup com o CAPI depois)
 *   s3           → landing_path do first touch
 *
 * Parâmetro vazio é OMITIDO — a Kiwify não recebe string vazia.
 *
 * Regra do repo: nenhum link de checkout sai cru. Use <CheckoutLink> (âncora)
 * ou `openCheckout` (clique programático). Ver docs/atribuicao.md.
 */

import {
  ensureAttributionInitialized,
  type Attribution,
} from "@/lib/attribution";
import { trackInitiateCheckout } from "@/utils/pixel";
import { navigateTo, openInNewTab } from "@/utils/navigation";

/** Limite defensivo por parâmetro — checkout não é lugar de payload gigante. */
const MAX_PARAM = 500;

export interface CheckoutUrlOptions {
  /** event_id do InitiateCheckout disparado no mesmo clique (vai no `s2`). */
  eventId?: string;
  /** Atribuição explícita (testes). Sem isto, lê o store. */
  attribution?: Attribution;
}

/** Tira o separador do valor pra não bagunçar o parsing do `sck`. */
function sanitizar(valor: string | null | undefined): string {
  if (typeof valor !== "string") return "";
  return valor.replace(/\|/g, "-").trim().slice(0, MAX_PARAM);
}

/**
 * first_touch em uma string posicional: source|medium|campaign|term|content.
 * Posição vazia continua vazia (a ordem é o que dá sentido ao valor); só as
 * vazias do FIM são cortadas. Tudo vazio → string vazia (parâmetro omitido).
 */
export function buildSck(attr: Attribution): string {
  const first = attr.first_touch;
  if (!first) return "";

  const partes = [
    sanitizar(first.utm_source),
    sanitizar(first.utm_medium),
    sanitizar(first.utm_campaign),
    sanitizar(first.utm_term),
    sanitizar(first.utm_content),
  ];

  while (partes.length > 0 && partes[partes.length - 1] === "") partes.pop();

  return partes.join("|");
}

/**
 * Monta a URL do checkout com a atribuição carimbada.
 * URL relativa ou inválida (ex.: "/guia-primeiros-passos") volta como veio.
 */
export function buildCheckoutUrl(
  baseUrl: string,
  options: CheckoutUrlOptions = {},
): string {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return baseUrl;
  }

  const attr = options.attribution ?? ensureAttributionInitialized();
  const last = attr.last_touch;
  const first = attr.first_touch;

  const definir = (chave: string, valor: string | null | undefined) => {
    const v = sanitizar(valor);
    if (v) url.searchParams.set(chave, v);
  };

  // utm_* — um por parâmetro, do last touch
  definir("utm_source", last?.utm_source);
  definir("utm_medium", last?.utm_medium);
  definir("utm_campaign", last?.utm_campaign);
  definir("utm_term", last?.utm_term);
  definir("utm_content", last?.utm_content);

  // src — origem do last touch
  definir("src", last?.utm_source);

  // sck — first touch posicional. NÃO passa por `definir`: o "|" é o
  // separador do formato, e `sanitizar` o removeria.
  const sck = buildSck(attr).slice(0, MAX_PARAM);
  if (sck) url.searchParams.set("sck", sck);

  // s1/s2/s3 — click id, event_id e página de entrada
  definir("s1", last?.fbclid ?? first?.fbclid ?? null);
  definir("s2", options.eventId ?? null);
  definir("s3", first?.landing_path ?? null);

  return url.toString();
}

export interface OpenCheckoutOptions {
  /** slug/nome do produto — vai como content_name no InitiateCheckout */
  produto?: string;
  /** onde o clique aconteceu (lp-gerenciamento, comece-chat, ...) */
  origem?: string;
  /** true abre em nova aba (fluxo do /comece) */
  novaAba?: boolean;
}

/**
 * Clique programático pro checkout: dispara InitiateCheckout, carimba a URL
 * com o mesmo event_id e navega. Devolve a URL final (útil em teste).
 */
export function openCheckout(
  baseUrl: string,
  options: OpenCheckoutOptions = {},
): string {
  const eventId = trackInitiateCheckout({
    content_name: options.produto ?? null,
    content_category: options.origem ?? null,
  });

  const url = buildCheckoutUrl(baseUrl, { eventId });

  if (options.novaAba) openInNewTab(url);
  else navigateTo(url);

  return url;
}
