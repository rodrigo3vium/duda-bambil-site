/**
 * Atribuição — fonte ÚNICA de origem de tráfego do site.
 *
 * Guarda dois blocos em localStorage (chave `attribution`):
 *   - first_touch: a primeira origem identificada. Escrito UMA vez e nunca
 *     sobrescrito enquanto não expirar (TTL de 90 dias).
 *   - last_touch: a origem mais recente. Sobrescrito sempre que a URL trouxer
 *     parâmetro novo (utm_* ou click id) e, na falta deles, pelo referrer
 *     externo.
 *
 * Regras que não se negociam:
 *   1. O fallback de `document.referrer` só entra quando NÃO há utm nem click
 *      id na URL, e só escreve no last_touch. Ele nunca contamina o first_touch
 *      — first_touch guarda origem identificada, não palpite.
 *   2. Sem nenhum sinal (sem parâmetro e sem referrer externo) nada é
 *      sobrescrito: visita direta não apaga a campanha que trouxe a pessoa.
 *   3. localStorage pode falhar (modo anônimo, storage cheio, cookie bloqueado).
 *      Toda leitura/escrita é try/catch: atribuição nunca derruba a página.
 *
 * Este módulo é um store de módulo (não React) de propósito: o
 * `buildCheckoutUrl` e os submits de formulário precisam ler a atribuição de
 * forma síncrona, fora de qualquer árvore de componente. O
 * AttributionProvider (contexts/AttributionProvider.tsx) só inicializa e
 * expõe o snapshot pra UI.
 */

export const ATTRIBUTION_KEY = "attribution";
export const ATTRIBUTION_VERSION = 1;

/** Janela do first_touch. Passou disso, a próxima visita identificada reabre. */
export const FIRST_TOUCH_TTL_DAYS = 90;
const TTL_MS = FIRST_TOUCH_TTL_DAYS * 24 * 60 * 60 * 1000;

/** Chaves legadas migradas uma única vez (ver `applyLegacyMigration`). */
export const LEGACY_LOCAL_KEY = "utm_params";
export const LEGACY_SESSION_KEY = "mentoria_utm";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export const CLICK_ID_KEYS = ["fbclid", "gclid", "ttclid"] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

/** Bag de utms — o formato que o /api/lead e o /api/mentoria já recebem. */
export type UtmBag = Record<UtmKey, string | null>;

export interface Touch {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  fbclid: string | null;
  gclid: string | null;
  ttclid: string | null;
  /** referrer da visita que gerou este touch ("" quando entrou direto) */
  referrer: string | null;
  /** pathname de entrada (sem query) — em que página a pessoa caiu */
  landing_path: string | null;
  /** ISO do momento da captura */
  ts: string;
}

export interface Attribution {
  version: number;
  first_touch: Touch | null;
  last_touch: Touch | null;
  /** marca que a migração das chaves legadas já rodou (idempotência) */
  legacy_migrated?: boolean;
}

export const EMPTY_ATTRIBUTION: Attribution = Object.freeze({
  version: ATTRIBUTION_VERSION,
  first_touch: null,
  last_touch: null,
});

/** Entrada bruta de uma visita — tudo que a captura precisa saber. */
export interface CaptureInput {
  /** query string da URL atual, com ou sem "?" */
  search: string;
  pathname: string;
  referrer: string;
  /** hostname atual, pra descartar referrer interno */
  hostname: string;
}

const emptyTouchFields = () => ({
  utm_source: null as string | null,
  utm_medium: null as string | null,
  utm_campaign: null as string | null,
  utm_term: null as string | null,
  utm_content: null as string | null,
  fbclid: null as string | null,
  gclid: null as string | null,
  ttclid: null as string | null,
  referrer: null as string | null,
  landing_path: null as string | null,
});

const limpar = (valor: string | null | undefined): string | null => {
  if (typeof valor !== "string") return null;
  const v = valor.trim();
  return v.length > 0 ? v : null;
};

// ---------------------------------------------------------------------------
// Núcleo puro — testável sem DOM
// ---------------------------------------------------------------------------

/** Um touch está expirado quando passou do TTL. `ts` inválido conta como expirado. */
export function touchExpirado(touch: Touch | null, now: number): boolean {
  if (!touch) return true;
  const t = Date.parse(touch.ts);
  if (Number.isNaN(t)) return true;
  return now - t > TTL_MS;
}

/**
 * Normaliza o que veio do storage. Formato desconhecido/corrompido vira vazio
 * (nunca lança), e o first_touch expirado é podado já na leitura.
 */
export function parseAttribution(raw: string | null, now: number): Attribution {
  if (!raw) return { ...EMPTY_ATTRIBUTION };

  let bruto: unknown;
  try {
    bruto = JSON.parse(raw);
  } catch {
    return { ...EMPTY_ATTRIBUTION };
  }

  if (!bruto || typeof bruto !== "object") return { ...EMPTY_ATTRIBUTION };
  const obj = bruto as Partial<Attribution>;

  const first = normalizarTouch(obj.first_touch);
  const last = normalizarTouch(obj.last_touch);

  return {
    version: ATTRIBUTION_VERSION,
    // TTL: first_touch velho demais some — a próxima visita identificada reabre.
    first_touch: touchExpirado(first, now) ? null : first,
    last_touch: last,
    ...(obj.legacy_migrated ? { legacy_migrated: true } : {}),
  };
}

function normalizarTouch(valor: unknown): Touch | null {
  if (!valor || typeof valor !== "object") return null;
  const t = valor as Partial<Touch>;
  if (typeof t.ts !== "string") return null;
  return {
    ...emptyTouchFields(),
    utm_source: limpar(t.utm_source),
    utm_medium: limpar(t.utm_medium),
    utm_campaign: limpar(t.utm_campaign),
    utm_term: limpar(t.utm_term),
    utm_content: limpar(t.utm_content),
    fbclid: limpar(t.fbclid),
    gclid: limpar(t.gclid),
    ttclid: limpar(t.ttclid),
    referrer: limpar(t.referrer),
    landing_path: limpar(t.landing_path),
    ts: t.ts,
  };
}

/** Monta o touch da visita atual a partir dos parâmetros da URL. */
function touchDaUrl(input: CaptureInput, now: number): Touch | null {
  const params = new URLSearchParams(
    input.search.startsWith("?") ? input.search.slice(1) : input.search,
  );

  const touch: Touch = {
    ...emptyTouchFields(),
    referrer: limpar(input.referrer),
    landing_path: limpar(input.pathname),
    ts: new Date(now).toISOString(),
  };

  let temSinal = false;
  for (const key of UTM_KEYS) {
    const v = limpar(params.get(key));
    if (v) {
      touch[key] = v;
      temSinal = true;
    }
  }
  for (const key of CLICK_ID_KEYS) {
    const v = limpar(params.get(key));
    if (v) {
      touch[key] = v;
      temSinal = true;
    }
  }

  return temSinal ? touch : null;
}

/**
 * Fallback: sem utm e sem click id, o referrer externo vira a origem.
 * Referrer do próprio domínio (navegação interna) não conta.
 */
function touchDoReferrer(input: CaptureInput, now: number): Touch | null {
  const referrer = limpar(input.referrer);
  if (!referrer) return null;

  let host: string;
  try {
    host = new URL(referrer).hostname;
  } catch {
    return null;
  }
  if (!host || host === input.hostname) return null;

  return {
    ...emptyTouchFields(),
    utm_source: host,
    // Mesmo rótulo que o checkout já usava antes desta refatoração.
    utm_medium: "Referencia",
    referrer,
    landing_path: limpar(input.pathname),
    ts: new Date(now).toISOString(),
  };
}

/**
 * Aplica a captura da visita atual sobre o que já estava guardado.
 * Devolve SEMPRE um objeto novo (não muta a entrada).
 */
export function applyCapture(
  atual: Attribution,
  input: CaptureInput,
  now: number,
): Attribution {
  const proximo: Attribution = {
    ...atual,
    version: ATTRIBUTION_VERSION,
    first_touch: touchExpirado(atual.first_touch, now) ? null : atual.first_touch,
  };

  const identificado = touchDaUrl(input, now);

  if (identificado) {
    // first_touch só é escrito se estiver vazio (ou tiver expirado acima).
    if (!proximo.first_touch) proximo.first_touch = identificado;
    proximo.last_touch = identificado;
    return proximo;
  }

  // Sem parâmetro: o referrer externo alimenta APENAS o last_touch.
  const referido = touchDoReferrer(input, now);
  if (referido) {
    proximo.last_touch = referido;
    return proximo;
  }

  // Visita direta sem sinal nenhum: preserva o que já existe.
  return proximo;
}

export interface LegacyStorage {
  /** conteúdo cru do localStorage `utm_params` (Direcionador /comece) */
  utmParams: string | null;
  /** conteúdo cru do sessionStorage `mentoria_utm` (form da mentoria) */
  mentoriaUtm: string | null;
}

function parseLegacyBag(raw: string | null): Partial<UtmBag> | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    if (!obj || typeof obj !== "object") return null;
    const bag: Partial<UtmBag> = {};
    let algum = false;
    for (const key of UTM_KEYS) {
      const v = limpar(obj[key] as string | null | undefined);
      if (v) {
        bag[key] = v;
        algum = true;
      }
    }
    return algum ? bag : null;
  } catch {
    return null;
  }
}

function touchDoLegado(bag: Partial<UtmBag>, now: number): Touch {
  return {
    ...emptyTouchFields(),
    ...bag,
    ts: new Date(now).toISOString(),
  } as Touch;
}

/**
 * Migra (sem descartar) o que já existia antes do formato único:
 *   - localStorage `utm_params`  → first_touch, se estiver vazio
 *   - sessionStorage `mentoria_utm` → last_touch, se estiver vazio
 *
 * `mentoria_utm` é de sessão, logo mais recente que o `utm_params` de
 * localStorage — por isso ele alimenta o last_touch e o outro o first_touch.
 * Slot já preenchido NUNCA é sobrescrito: captura real ganha de dado migrado.
 * Roda uma vez só (flag `legacy_migrated`) e é idempotente.
 * As chaves antigas ficam onde estão — migrar não é apagar.
 */
export function applyLegacyMigration(
  atual: Attribution,
  legacy: LegacyStorage,
  now: number,
): Attribution {
  if (atual.legacy_migrated) return atual;

  const proximo: Attribution = { ...atual, legacy_migrated: true };

  const doLocal = parseLegacyBag(legacy.utmParams);
  const daSessao = parseLegacyBag(legacy.mentoriaUtm);

  if (!proximo.first_touch && doLocal) {
    proximo.first_touch = touchDoLegado(doLocal, now);
  }
  if (!proximo.last_touch) {
    const bag = daSessao ?? doLocal;
    if (bag) proximo.last_touch = touchDoLegado(bag, now);
  }

  return proximo;
}

/**
 * Achata a atribuição no formato que a planilha já consome
 * (app/api/mentoria/route.ts): utm_* no topo = last_touch, e o first_touch em
 * colunas prefixadas. Um schema só pra todos os formulários do site.
 */
export function flattenAttribution(
  attr: Attribution,
): Record<string, string | null> {
  const last = attr.last_touch;
  const first = attr.first_touch;

  return {
    utm_source: last?.utm_source ?? null,
    utm_medium: last?.utm_medium ?? null,
    utm_campaign: last?.utm_campaign ?? null,
    utm_term: last?.utm_term ?? null,
    utm_content: last?.utm_content ?? null,
    fbclid: last?.fbclid ?? null,
    gclid: last?.gclid ?? null,
    ttclid: last?.ttclid ?? null,
    referrer: last?.referrer ?? null,
    landing_path: last?.landing_path ?? null,
    last_touch_at: last?.ts ?? null,
    first_utm_source: first?.utm_source ?? null,
    first_utm_medium: first?.utm_medium ?? null,
    first_utm_campaign: first?.utm_campaign ?? null,
    first_utm_term: first?.utm_term ?? null,
    first_utm_content: first?.utm_content ?? null,
    first_fbclid: first?.fbclid ?? null,
    first_referrer: first?.referrer ?? null,
    first_landing_path: first?.landing_path ?? null,
    first_touch_at: first?.ts ?? null,
  };
}

/** Bag de utms do last_touch — compatível com o payload que as rotas já aceitam. */
export function utmBagFromAttribution(attr: Attribution): UtmBag {
  const last = attr.last_touch;
  return {
    utm_source: last?.utm_source ?? null,
    utm_medium: last?.utm_medium ?? null,
    utm_campaign: last?.utm_campaign ?? null,
    utm_term: last?.utm_term ?? null,
    utm_content: last?.utm_content ?? null,
  };
}

// ---------------------------------------------------------------------------
// Store de módulo (client)
// ---------------------------------------------------------------------------

let snapshot: Attribution = EMPTY_ATTRIBUTION;
let inicializado = false;
const ouvintes = new Set<() => void>();

/** Snapshot atual. Estável por referência — seguro em useSyncExternalStore. */
export function getAttribution(): Attribution {
  return snapshot;
}

/** No server não existe storage: a atribuição é sempre vazia. */
export function getServerAttribution(): Attribution {
  return EMPTY_ATTRIBUTION;
}

export function subscribeAttribution(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

function lerStorage(kind: "local" | "session", key: string): string | null {
  try {
    const store = kind === "session" ? window.sessionStorage : window.localStorage;
    return store.getItem(key);
  } catch {
    return null;
  }
}

function gravarStorage(key: string, valor: string): void {
  try {
    window.localStorage.setItem(key, valor);
  } catch {
    // storage indisponível (anônimo, cota) — segue sem persistir
  }
}

/**
 * Lê storage → migra legado → captura a visita atual → persiste.
 * Roda UMA vez por carregamento de página (o provider chama no mount).
 */
export function initAttribution(): Attribution {
  if (inicializado) return snapshot;
  inicializado = true;

  if (typeof window === "undefined") return snapshot;

  const now = Date.now();
  const anterior = lerStorage("local", ATTRIBUTION_KEY);

  let attr = parseAttribution(anterior, now);
  attr = applyLegacyMigration(
    attr,
    {
      utmParams: lerStorage("local", LEGACY_LOCAL_KEY),
      mentoriaUtm: lerStorage("session", LEGACY_SESSION_KEY),
    },
    now,
  );
  attr = applyCapture(
    attr,
    {
      search: window.location.search,
      pathname: window.location.pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      hostname: window.location.hostname,
    },
    now,
  );

  const serializado = JSON.stringify(attr);
  if (serializado !== anterior) gravarStorage(ATTRIBUTION_KEY, serializado);

  snapshot = attr;
  for (const ouvinte of ouvintes) ouvinte();
  return snapshot;
}

/**
 * Garante que a atribuição foi lida antes de um uso síncrono fora do React
 * (buildCheckoutUrl, submit de formulário). No fluxo normal o provider já
 * inicializou e isto é no-op.
 */
export function ensureAttributionInitialized(): Attribution {
  return inicializado ? snapshot : initAttribution();
}

/** Só para testes: zera o store de módulo entre casos. */
export function __resetAttributionStore(): void {
  snapshot = EMPTY_ATTRIBUTION;
  inicializado = false;
  ouvintes.clear();
}
