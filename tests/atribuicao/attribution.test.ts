/**
 * Regras de atribuição — o contrato que garante que nenhuma rota perde origem.
 *
 * Cada `visitar()` simula um CARREGAMENTO de página novo: reseta o store de
 * módulo (como se o JS tivesse recarregado) mas mantém o localStorage, que é
 * exatamente o que acontece quando a pessoa volta ao site.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ATTRIBUTION_KEY,
  FIRST_TOUCH_TTL_DAYS,
  LEGACY_LOCAL_KEY,
  LEGACY_SESSION_KEY,
  __resetAttributionStore,
  getAttribution,
  initAttribution,
  type Attribution,
} from "@/lib/attribution";

const HOJE = new Date("2026-08-27T12:00:00.000Z");

function definirReferrer(valor: string) {
  Object.defineProperty(document, "referrer", {
    value: valor,
    configurable: true,
  });
}

/** Simula uma visita: nova carga de página em `url`, vinda de `referrer`. */
function visitar(url: string, referrer = ""): Attribution {
  __resetAttributionStore();
  window.history.replaceState({}, "", url);
  definirReferrer(referrer);
  return initAttribution();
}

function lerStorage(): Attribution {
  return JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) ?? "null");
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(HOJE);
  localStorage.clear();
  sessionStorage.clear();
  __resetAttributionStore();
});

afterEach(() => {
  vi.useRealTimers();
  definirReferrer("");
});

describe("first touch", () => {
  it("não é sobrescrito por uma visita posterior com utm diferente", () => {
    visitar("/gerenciamento-de-pele?utm_source=instagram&utm_medium=bio&utm_campaign=organico");

    vi.setSystemTime(new Date("2026-08-29T09:00:00.000Z"));
    const depois = visitar("/limpeza-de-pele?utm_source=facebook&utm_medium=cpc&utm_campaign=black");

    expect(depois.first_touch).toMatchObject({
      utm_source: "instagram",
      utm_medium: "bio",
      utm_campaign: "organico",
      landing_path: "/gerenciamento-de-pele",
    });
    // e o que foi persistido também preserva o first touch
    expect(lerStorage().first_touch?.utm_source).toBe("instagram");
  });

  it("guarda os click ids e a página de entrada", () => {
    const attr = visitar("/comece?fbclid=ABC123&gclid=G-1&ttclid=T-9");

    expect(attr.first_touch).toMatchObject({
      fbclid: "ABC123",
      gclid: "G-1",
      ttclid: "T-9",
      landing_path: "/comece",
    });
    expect(attr.last_touch?.fbclid).toBe("ABC123");
  });

  it("é registrado quando só há click id, sem nenhum utm", () => {
    const attr = visitar("/?fbclid=SO-O-CLICK");
    expect(attr.first_touch?.fbclid).toBe("SO-O-CLICK");
    expect(attr.first_touch?.utm_source).toBeNull();
  });
});

describe("last touch", () => {
  it("é sobrescrito pela visita mais recente", () => {
    visitar("/?utm_source=instagram&utm_medium=bio");

    vi.setSystemTime(new Date("2026-08-29T09:00:00.000Z"));
    const depois = visitar("/limpeza-de-pele?utm_source=facebook&utm_medium=cpc&utm_campaign=black");

    expect(depois.last_touch).toMatchObject({
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "black",
      landing_path: "/limpeza-de-pele",
    });
    expect(depois.last_touch?.ts).toBe("2026-08-29T09:00:00.000Z");
  });

  it("visita direta sem parâmetro e sem referrer preserva o que já existe", () => {
    visitar("/?utm_source=instagram&utm_campaign=lancamento");

    const depois = visitar("/gerenciamento-de-pele");

    expect(depois.last_touch?.utm_source).toBe("instagram");
    expect(depois.first_touch?.utm_source).toBe("instagram");
  });
});

describe("TTL de 90 dias", () => {
  it("expira o first touch e deixa a próxima visita identificada reabrir", () => {
    visitar("/?utm_source=instagram&utm_campaign=antiga");

    // 91 dias depois
    const depois91 = new Date(HOJE.getTime() + (FIRST_TOUCH_TTL_DAYS + 1) * 86400_000);
    vi.setSystemTime(depois91);

    const attr = visitar("/?utm_source=google&utm_medium=cpc");

    expect(attr.first_touch?.utm_source).toBe("google");
    expect(attr.last_touch?.utm_source).toBe("google");
  });

  it("dentro da janela o first touch sobrevive", () => {
    visitar("/?utm_source=instagram&utm_campaign=antiga");

    const depois89 = new Date(HOJE.getTime() + (FIRST_TOUCH_TTL_DAYS - 1) * 86400_000);
    vi.setSystemTime(depois89);

    const attr = visitar("/?utm_source=google&utm_medium=cpc");

    expect(attr.first_touch?.utm_source).toBe("instagram");
    expect(attr.last_touch?.utm_source).toBe("google");
  });

  it("first touch expirado some mesmo sem sinal novo na visita", () => {
    visitar("/?utm_source=instagram");

    vi.setSystemTime(new Date(HOJE.getTime() + (FIRST_TOUCH_TTL_DAYS + 1) * 86400_000));
    const attr = visitar("/gerenciamento-de-pele");

    expect(attr.first_touch).toBeNull();
  });
});

describe("fallback de referrer", () => {
  it("alimenta só o last touch — nunca o first touch", () => {
    const attr = visitar("/gerenciamento-de-pele", "https://www.google.com/search?q=duda");

    expect(attr.first_touch).toBeNull();
    expect(attr.last_touch).toMatchObject({
      utm_source: "www.google.com",
      utm_medium: "Referencia",
      referrer: "https://www.google.com/search?q=duda",
    });
    expect(lerStorage().first_touch).toBeNull();
  });

  it("não entra quando a URL já traz utm", () => {
    const attr = visitar("/?utm_source=instagram&utm_medium=bio", "https://www.google.com/");

    expect(attr.last_touch?.utm_source).toBe("instagram");
    expect(attr.last_touch?.utm_medium).toBe("bio");
    // o referrer vira metadado do touch, não a origem
    expect(attr.last_touch?.referrer).toBe("https://www.google.com/");
  });

  it("não entra quando a URL traz só click id", () => {
    const attr = visitar("/?fbclid=XYZ", "https://www.google.com/");

    expect(attr.last_touch?.fbclid).toBe("XYZ");
    expect(attr.last_touch?.utm_source).toBeNull();
  });

  it("ignora referrer do próprio domínio (navegação interna)", () => {
    const attr = visitar("/limpeza-de-pele", "http://localhost:3000/gerenciamento-de-pele");

    expect(attr.last_touch).toBeNull();
    expect(attr.first_touch).toBeNull();
  });

  it("não apaga um last touch de campanha em navegação interna", () => {
    visitar("/?utm_source=instagram&utm_campaign=lancamento");
    const attr = visitar("/limpeza-de-pele", "http://localhost:3000/");

    expect(attr.last_touch?.utm_source).toBe("instagram");
  });
});

describe("migração das chaves legadas", () => {
  it("traz utm_params e mentoria_utm pro formato novo", () => {
    localStorage.setItem(
      LEGACY_LOCAL_KEY,
      JSON.stringify({ utm_source: "instagram", utm_medium: "bio", utm_campaign: "guia" }),
    );
    sessionStorage.setItem(
      LEGACY_SESSION_KEY,
      JSON.stringify({ utm_source: "facebook", utm_campaign: "mentoria-set" }),
    );

    const attr = visitar("/mentoria");

    // localStorage (mais antigo) vira first touch; sessionStorage (da sessão
    // corrente, mais recente) vira last touch
    expect(attr.first_touch?.utm_source).toBe("instagram");
    expect(attr.first_touch?.utm_campaign).toBe("guia");
    expect(attr.last_touch?.utm_source).toBe("facebook");
    expect(attr.last_touch?.utm_campaign).toBe("mentoria-set");
  });

  it("não descarta as chaves antigas", () => {
    localStorage.setItem(LEGACY_LOCAL_KEY, JSON.stringify({ utm_source: "instagram" }));
    visitar("/");

    expect(localStorage.getItem(LEGACY_LOCAL_KEY)).toBe(
      JSON.stringify({ utm_source: "instagram" }),
    );
  });

  it("roda uma vez só e é idempotente", () => {
    localStorage.setItem(LEGACY_LOCAL_KEY, JSON.stringify({ utm_source: "instagram" }));

    visitar("/");

    // Uma captura real depois da migração troca o last touch...
    vi.setSystemTime(new Date("2026-08-28T10:00:00.000Z"));
    visitar("/?utm_source=google&utm_medium=cpc");
    const antes = lerStorage();
    expect(antes.last_touch?.utm_source).toBe("google");

    // ...e uma terceira carga NÃO pode re-migrar o legado por cima.
    vi.setSystemTime(new Date("2026-08-28T11:00:00.000Z"));
    const depois = visitar("/mentoria");

    expect(depois.last_touch?.utm_source).toBe("google");
    expect(depois.first_touch?.utm_source).toBe("instagram");
    expect(JSON.stringify(depois)).toBe(JSON.stringify(antes));
  });

  it("captura da URL ganha do legado na mesma carga", () => {
    localStorage.setItem(LEGACY_LOCAL_KEY, JSON.stringify({ utm_source: "instagram" }));

    const attr = visitar("/?utm_source=google&utm_medium=cpc");

    expect(attr.last_touch?.utm_source).toBe("google");
    // sem first touch anterior, o legado ocupa o slot antes da captura
    expect(attr.first_touch?.utm_source).toBe("instagram");
  });
});

describe("robustez", () => {
  it("storage corrompido não quebra a captura", () => {
    localStorage.setItem(ATTRIBUTION_KEY, "{isso não é json");

    const attr = visitar("/?utm_source=instagram");

    expect(attr.last_touch?.utm_source).toBe("instagram");
  });

  it("initAttribution é idempotente dentro da mesma carga de página", () => {
    visitar("/?utm_source=instagram");
    const primeiro = getAttribution();

    window.history.replaceState({}, "", "/outra?utm_source=facebook");
    const segundo = initAttribution();

    // sem reset (= sem nova carga), a captura não roda de novo
    expect(segundo).toBe(primeiro);
    expect(segundo.last_touch?.utm_source).toBe("instagram");
  });
});
