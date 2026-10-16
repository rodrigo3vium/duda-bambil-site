/**
 * buildCheckoutUrl — o carimbo de origem na URL da Kiwify.
 *
 * Mapa dos parâmetros (todos nativos da Kiwify):
 *   utm_* (5) → last touch, um por parâmetro
 *   src       → utm_source do last touch
 *   sck       → first touch posicional: source|medium|campaign|term|content
 *   s1        → fbclid   s2 → event_id   s3 → landing_path do first touch
 */

import { beforeEach, describe, expect, it } from "vitest";
import { buildCheckoutUrl, buildSck } from "@/utils/checkout";
import {
  EMPTY_ATTRIBUTION,
  __resetAttributionStore,
  initAttribution,
  type Attribution,
  type Touch,
} from "@/lib/attribution";

const BASE = "https://pay.kiwify.com.br/IKV1kqf";

function touch(campos: Partial<Touch>): Touch {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    fbclid: null,
    gclid: null,
    ttclid: null,
    referrer: null,
    landing_path: null,
    ts: "2026-08-27T12:00:00.000Z",
    ...campos,
  };
}

function attr(first: Touch | null, last: Touch | null): Attribution {
  return { version: 1, first_touch: first, last_touch: last };
}

/** Params da URL montada, como objeto simples. */
function params(url: string): Record<string, string> {
  return Object.fromEntries(new URL(url).searchParams.entries());
}

beforeEach(() => {
  __resetAttributionStore();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("storage vazio", () => {
  it("devolve a URL como veio", () => {
    expect(buildCheckoutUrl(BASE, { attribution: EMPTY_ATTRIBUTION })).toBe(BASE);
  });

  it("carimba só o event_id quando ele é o único dado", () => {
    const url = buildCheckoutUrl(BASE, {
      attribution: EMPTY_ATTRIBUTION,
      eventId: "evt-1",
    });
    expect(params(url)).toEqual({ s2: "evt-1" });
  });

  it("URL relativa volta intacta (produto sem checkout externo)", () => {
    expect(buildCheckoutUrl("/guia-primeiros-passos", { attribution: EMPTY_ATTRIBUTION })).toBe(
      "/guia-primeiros-passos",
    );
  });
});

describe("só first touch", () => {
  it("manda sck e s3, e nenhum utm_ (que é do last touch)", () => {
    const a = attr(
      touch({
        utm_source: "instagram",
        utm_medium: "bio",
        utm_campaign: "lancamento",
        landing_path: "/comece",
        fbclid: "FB-1",
      }),
      null,
    );

    expect(params(buildCheckoutUrl(BASE, { attribution: a }))).toEqual({
      sck: "instagram|bio|lancamento",
      s1: "FB-1",
      s3: "/comece",
    });
  });
});

describe("só last touch", () => {
  it("manda os 5 utm_, src, s1 — e nenhum sck", () => {
    const a = attr(
      null,
      touch({
        utm_source: "facebook",
        utm_medium: "cpc",
        utm_campaign: "black",
        utm_term: "estetica",
        utm_content: "video-1",
        fbclid: "FB-9",
      }),
    );

    expect(params(buildCheckoutUrl(BASE, { attribution: a }))).toEqual({
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "black",
      utm_term: "estetica",
      utm_content: "video-1",
      src: "facebook",
      s1: "FB-9",
    });
  });
});

describe("first + last touch", () => {
  it("separa os dois: utm_/src do last, sck/s3 do first", () => {
    const a = attr(
      touch({
        utm_source: "instagram",
        utm_medium: "bio",
        utm_campaign: "organico",
        landing_path: "/guia-skin-care",
      }),
      touch({
        utm_source: "facebook",
        utm_medium: "cpc",
        utm_campaign: "black",
        fbclid: "FB-9",
      }),
    );

    expect(params(buildCheckoutUrl(BASE, { attribution: a, eventId: "evt-42" }))).toEqual({
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "black",
      src: "facebook",
      sck: "instagram|bio|organico",
      s1: "FB-9",
      s2: "evt-42",
      s3: "/guia-skin-care",
    });
  });

  it("não deixa parâmetro vazio na URL", () => {
    const a = attr(touch({ utm_source: "instagram" }), touch({ utm_source: "google" }));
    const url = buildCheckoutUrl(BASE, { attribution: a });

    expect(url).not.toContain("utm_medium=");
    expect(url).not.toContain("utm_term=");
    expect(url).not.toContain("s1=");
    expect(url).not.toContain("s2=");
  });

  it("preserva query que já existia na URL do checkout", () => {
    const a = attr(null, touch({ utm_source: "google" }));
    const url = buildCheckoutUrl(`${BASE}?afiliado=duda`, { attribution: a });

    expect(params(url)).toMatchObject({ afiliado: "duda", utm_source: "google" });
  });
});

describe("sck posicional", () => {
  it("mantém a posição das vazias no meio", () => {
    const a = attr(
      touch({ utm_source: "instagram", utm_campaign: "lancamento", utm_content: "story-3" }),
      null,
    );
    expect(buildSck(a)).toBe("instagram||lancamento||story-3");
  });

  it("corta só as vazias do fim", () => {
    const a = attr(touch({ utm_source: "instagram", utm_medium: "bio" }), null);
    expect(buildSck(a)).toBe("instagram|bio");
  });

  it("sem first touch, não existe sck", () => {
    expect(buildSck(EMPTY_ATTRIBUTION)).toBe("");
    expect(buildCheckoutUrl(BASE, { attribution: EMPTY_ATTRIBUTION })).not.toContain("sck");
  });

  it("valor com '|' não quebra o parsing", () => {
    const a = attr(touch({ utm_source: "insta|gram", utm_medium: "bio" }), null);
    expect(buildSck(a)).toBe("insta-gram|bio");
  });
});

describe("integração com o store", () => {
  it("sem atribuição explícita, lê o que a visita capturou", () => {
    window.history.replaceState({}, "", "/limpeza-de-pele?utm_source=instagram&utm_medium=bio&fbclid=FB-7");
    initAttribution();

    expect(params(buildCheckoutUrl(BASE))).toMatchObject({
      utm_source: "instagram",
      utm_medium: "bio",
      src: "instagram",
      sck: "instagram|bio",
      s1: "FB-7",
      s3: "/limpeza-de-pele",
    });
  });
});
