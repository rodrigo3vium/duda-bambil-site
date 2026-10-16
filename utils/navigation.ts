/**
 * Navegação de saída (checkout). Isolada num módulo só pra poder ser mockada
 * em teste — jsdom não implementa navegação de verdade.
 */

/** Navega na mesma aba. */
export function navigateTo(url: string): void {
  if (typeof window === "undefined") return;
  window.location.href = url;
}

/** Abre em nova aba (fluxo do /comece, que mantém o Direcionador aberto). */
export function openInNewTab(url: string): void {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
}
