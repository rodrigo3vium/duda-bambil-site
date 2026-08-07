// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/mentoria/route";

const WEBHOOK = "https://webhook.teste/mentoria";

/** Corpo que o form manda: nove campos + metadados anti-spam + UTM. */
function corpo(over: Record<string, unknown> = {}) {
  return {
    nome: "  Duda   Bambil ",
    whatsapp: "(67) 99856-8757",
    instagram: "https://www.instagram.com/dudabambil/?igshid=abc",
    atuacao: "espaco_proprio",
    faturamento: "8k_15k",
    travamento: "preco_baixo",
    investimento_previo: "ate_500",
    prontidao: "agora",
    motivo: "Quero organizar a operação e subir o preço com critério.",
    empresa: "",
    tempoPreenchimentoMs: 45000,
    utm: {
      utm_source: "instagram",
      utm_medium: "bio",
      utm_campaign: "mentoria-set",
      utm_content: null,
      utm_term: null,
    },
    referrer: "https://l.instagram.com/",
    ...over,
  };
}

function req(body: unknown): Request {
  return new Request("http://localhost/api/mentoria", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Último corpo postado no webhook, já desserializado. */
function payloadEnviado(fetchMock: ReturnType<typeof vi.fn>) {
  const init = fetchMock.mock.calls[0][1] as RequestInit;
  return JSON.parse(init.body as string);
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv("MENTORIA_WEBHOOK_URL", WEBHOOK);
  vi.stubEnv("MENTORIA_WEBHOOK_TOKEN", "tok-123");
  fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/mentoria — payload válido", () => {
  it("monta o corpo correto do webhook", async () => {
    const res = await POST(req(corpo()));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(WEBHOOK);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-lead-token": "tok-123",
    });

    const enviado = payloadEnviado(fetchMock);

    // Nove campos, já normalizados.
    expect(enviado).toMatchObject({
      nome: "Duda Bambil",
      whatsapp: "67998568757",
      instagram: "@dudabambil",
      atuacao: "espaco_proprio",
      faturamento: "8k_15k",
      travamento: "preco_baixo",
      investimento_previo: "ate_500",
      prontidao: "agora",
      motivo: "Quero organizar a operação e subir o preço com critério.",
    });

    // Metadados.
    expect(enviado.origem).toBe("mentoria-aplicacao");
    expect(enviado.utm_source).toBe("instagram");
    expect(enviado.utm_medium).toBe("bio");
    expect(enviado.utm_campaign).toBe("mentoria-set");
    expect(enviado.utm_content).toBeNull();
    expect(enviado.utm_term).toBeNull();
    expect(enviado.referrer).toBe("https://l.instagram.com/");
    expect(new Date(enviado.submitted_at).toISOString()).toBe(enviado.submitted_at);

    // Nada de honeypot nem cronômetro vazando pra planilha.
    expect(enviado).not.toHaveProperty("empresa");
    expect(enviado).not.toHaveProperty("tempoPreenchimentoMs");
  });

  it("não classifica: nada de score/classificacao no webhook nem na resposta", async () => {
    const res = await POST(req(corpo()));
    const json = await res.json();
    expect(json).not.toHaveProperty("score");
    expect(json).not.toHaveProperty("classificacao");
    expect(json).not.toHaveProperty("aprovado");

    const enviado = payloadEnviado(fetchMock);
    expect(enviado).not.toHaveProperty("score");
    expect(enviado).not.toHaveProperty("classificacao");
  });

  it("ignora score/classificacao injetados pelo cliente — não repassa pro webhook", async () => {
    await POST(req(corpo({ score: 99, classificacao: "quente" })));
    const enviado = payloadEnviado(fetchMock);
    expect(enviado).not.toHaveProperty("score");
    expect(enviado).not.toHaveProperty("classificacao");
  });

  it("toda aplicação válida é encaminhada igual, seja qual for a resposta", async () => {
    // Perfil que a régua antiga descartaria: sem faturamento, sem investimento,
    // sem pressa. Agora vai pro webhook igual, porque a triagem é da equipe.
    const res = await POST(
      req(corpo({ faturamento: "ate_3k", investimento_previo: "nunca", prontidao: "depois" })),
    );
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(payloadEnviado(fetchMock)).toMatchObject({
      faturamento: "ate_3k",
      investimento_previo: "nunca",
      prontidao: "depois",
      origem: "mentoria-aplicacao",
    });
  });

  it("cai no LEAD_WEBHOOK_URL quando MENTORIA_WEBHOOK_URL não está setado", async () => {
    vi.stubEnv("MENTORIA_WEBHOOK_URL", "");
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://webhook.teste/fallback");
    await POST(req(corpo()));
    expect(fetchMock.mock.calls[0][0]).toBe("https://webhook.teste/fallback");
  });
});

describe("POST /api/mentoria — payload adulterado", () => {
  it.each<[string, Record<string, unknown>]>([
    ["opção de rádio fora da lista", { faturamento: "acima_1_bilhao" }],
    ["campo obrigatório removido", { prontidao: "" }],
    ["whatsapp inválido", { whatsapp: "123" }],
    ["motivo curto demais", { motivo: "quero" }],
    ["instagram inválido", { instagram: "não é handle" }],
  ])("rejeita %s com 422 e não chama o webhook", async (_caso, over) => {
    const res = await POST(req(corpo(over)));
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid_fields" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejeita JSON quebrado", async () => {
    const res = await POST(
      new Request("http://localhost/api/mentoria", { method: "POST", body: "{{{" }),
    );
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("aponta quais campos falharam", async () => {
    const res = await POST(req(corpo({ whatsapp: "123", motivo: "curto" })));
    const json = (await res.json()) as { fields: string[] };
    expect(json.fields.sort()).toEqual(["motivo", "whatsapp"]);
  });
});

describe("POST /api/mentoria — anti-spam", () => {
  it("descarta silenciosamente quando o honeypot vem preenchido", async () => {
    const res = await POST(req(corpo({ empresa: "Bot Ltda" })));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, descartado: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("descarta preenchimento rápido demais", async () => {
    const res = await POST(req(corpo({ tempoPreenchimentoMs: 900 })));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, descartado: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/mentoria — falha do webhook", () => {
  it("faz retry e devolve sucesso mesmo se o webhook cair de vez", async () => {
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error("ECONNRESET"));

    const res = await POST(req(corpo()));

    expect(fetchMock).toHaveBeenCalledTimes(3); // 3 tentativas
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    // O lead não se perde: payload completo vai pro log.
    const logado = erro.mock.calls.at(-1)?.join(" ") ?? "";
    expect(logado).toContain("67998568757");
    expect(logado).toContain("mentoria-aplicacao");
  }, 15000);

  it("faz retry em 5xx e para no primeiro sucesso", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("boom", { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const res = await POST(req(corpo()));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(await res.json()).toEqual({ ok: true });
  }, 15000);

  it("não insiste em 4xx — loga e segue", async () => {
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response("nope", { status: 404 }));

    const res = await POST(req(corpo()));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await res.json()).toEqual({ ok: true });
    expect(erro).toHaveBeenCalled();
  });

  it("sem webhook configurado, registra no log e devolve sucesso", async () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("MENTORIA_WEBHOOK_URL", "");
    vi.stubEnv("LEAD_WEBHOOK_URL", "");

    const res = await POST(req(corpo()));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(await res.json()).toEqual({ ok: true });
    expect(aviso.mock.calls.at(-1)?.join(" ")).toContain("67998568757");
  });
});
