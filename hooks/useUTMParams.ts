import { useEffect, useState } from "react";

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const UTM_STORAGE_KEY = "utm_params";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const EMPTY: UTMParams = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
};

export interface UTMOptions {
  /** Onde persistir. `local` (default) = comportamento original do /comece. */
  storage?: "local" | "session";
  /** Chave de storage. Default: `utm_params`. */
  key?: string;
}

const getStorage = (kind: "local" | "session"): Storage =>
  kind === "session" ? window.sessionStorage : window.localStorage;

/**
 * Captura UTMs da URL na primeira visita e persiste (localStorage por padrão,
 * sessionStorage via `{ storage: "session" }`). Lê `window.location` num effect
 * — sem depender de router, roda só no client. Retorna os UTMs vigentes.
 */
export const useUTMParams = (options: UTMOptions = {}): UTMParams => {
  const { storage = "local", key = UTM_STORAGE_KEY } = options;
  const [utmParams, setUtmParams] = useState<UTMParams>(EMPTY);

  useEffect(() => {
    // Hidrata do storage escolhido
    let stored: UTMParams = EMPTY;
    try {
      const raw = getStorage(storage).getItem(key);
      if (raw) stored = { ...EMPTY, ...JSON.parse(raw) };
    } catch {
      // ignora erro de storage
    }

    // Lê os UTMs da URL atual
    const params = new URLSearchParams(window.location.search);
    const urlUtms: Partial<UTMParams> = {};
    let hasUrlUtms = false;
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        urlUtms[key] = value;
        hasUrlUtms = true;
      }
    });

    if (hasUrlUtms) {
      const merged: UTMParams = {
        utm_source: urlUtms.utm_source || stored.utm_source,
        utm_medium: urlUtms.utm_medium || stored.utm_medium,
        utm_campaign: urlUtms.utm_campaign || stored.utm_campaign,
        utm_term: urlUtms.utm_term || stored.utm_term,
        utm_content: urlUtms.utm_content || stored.utm_content,
      };
      setUtmParams(merged);
      try {
        getStorage(storage).setItem(key, JSON.stringify(merged));
      } catch {
        // ignora erro de storage
      }
    } else {
      setUtmParams(stored);
    }
  }, [storage, key]);

  return utmParams;
};

/** Limpa os UTMs guardados (opcional, após submit bem-sucedido). */
export const clearStoredUTMs = (): void => {
  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
  } catch {
    // ignora erro de localStorage
  }
};
