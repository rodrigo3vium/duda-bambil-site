/**
 * Microsoft Clarity — eventos e tags customizados.
 *
 * O snippet do Clarity é injetado em app/layout.tsx (id "ms-clarity" — ver o
 * aviso lá sobre o id). Sozinho ele já grava sessão e mapa de calor; daqui
 * saem só os marcadores que deixam filtrar o painel por ação:
 *
 *   clarity("event", nome)        → aparece em "Eventos personalizados"
 *   clarity("set", chave, valor)  → vira tag filtrável da sessão
 *   clarity("upgrade", motivo)    → pede pro Clarity guardar a gravação
 *                                    dessa sessão mesmo com amostragem
 *
 * Nunca lança: Clarity bloqueado por adblock não pode quebrar o clique.
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

function chamar(...args: unknown[]): void {
  try {
    if (typeof window === "undefined" || typeof window.clarity !== "function") return;
    window.clarity(...args);
  } catch {
    // Clarity indisponível — segue o fluxo
  }
}

export function clarityEvent(nome: string): void {
  chamar("event", nome);
}

export function claritySet(chave: string, valor: string): void {
  chamar("set", chave, valor);
}

export function clarityUpgrade(motivo: string): void {
  chamar("upgrade", motivo);
}
