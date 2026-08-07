/**
 * POST /api/mentoria — aplicação da mentoria (LP /mentoria).
 *
 * A rota NÃO classifica e NÃO pontua: toda aplicação válida é encaminhada igual,
 * e a triagem é feita pela equipe olhando as respostas na planilha. O client
 * posta os nove campos crus; esta rota:
 *   1. descarta bot (honeypot `empresa` + tempo mínimo de preenchimento);
 *   2. revalida TUDO com o mesmo módulo do form (app/mentoria/aplicacao.ts) —
 *      payload adulterado no devtools é rejeitado com 422;
 *   3. encaminha pro webhook com retry/backoff.
 *
 * Lead nunca se perde: se o webhook cair nas 3 tentativas, o payload completo
 * vai pro log (`vercel logs`) e o usuário ainda recebe sucesso — ele já
 * preencheu, não vai preencher de novo por causa de falha nossa.
 *
 * Env (server-only, sem NEXT_PUBLIC_):
 *   MENTORIA_WEBHOOK_URL    destino do lead. Fallback: LEAD_WEBHOOK_URL.
 *   MENTORIA_WEBHOOK_TOKEN  opcional, vai no header x-lead-token.
 *                           Fallback: LEAD_WEBHOOK_TOKEN.
 */

import {
  CAMPOS,
  normalizarAplicacao,
  validarAplicacao,
  type Aplicacao,
} from "@/app/mentoria/aplicacao";

/** Tempo mínimo plausível pra preencher 3 telas e 9 campos. Abaixo disso, é bot. */
const TEMPO_MINIMO_MS = 5000;

const TENTATIVAS = 3;
const BACKOFF_BASE_MS = 400;
const TIMEOUT_MS = 8000;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

interface CorpoRequisicao extends Partial<Aplicacao> {
  empresa?: string; // honeypot — humano nunca preenche (campo invisível)
  tempoPreenchimentoMs?: number;
  utm?: Record<string, string | null>;
  referrer?: string;
}

export async function POST(req: Request): Promise<Response> {
  let corpo: CorpoRequisicao;
  try {
    corpo = (await req.json()) as CorpoRequisicao;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: responde ok (não dá pista pro bot) mas descarta.
  if (typeof corpo.empresa === "string" && corpo.empresa.trim().length > 0) {
    return Response.json({ ok: true, descartado: true });
  }

  if (
    typeof corpo.tempoPreenchimentoMs !== "number" ||
    corpo.tempoPreenchimentoMs < TEMPO_MINIMO_MS
  ) {
    return Response.json({ ok: true, descartado: true });
  }

  const brutos = {} as Aplicacao;
  for (const campo of CAMPOS) {
    const valor = corpo[campo];
    brutos[campo] = typeof valor === "string" ? valor : "";
  }

  const valores = normalizarAplicacao(brutos);
  const erros = validarAplicacao(valores);
  if (Object.keys(erros).length > 0) {
    return Response.json(
      { ok: false, error: "invalid_fields", fields: Object.keys(erros) },
      { status: 422 },
    );
  }

  const utm = corpo.utm ?? {};
  const payload = {
    ...valores,
    origem: "mentoria-aplicacao",
    submitted_at: new Date().toISOString(),
    ...Object.fromEntries(UTM_KEYS.map((k) => [k, utm[k] ?? null])),
    referrer: typeof corpo.referrer === "string" ? corpo.referrer : "",
  };

  await encaminhar(payload);

  return Response.json({ ok: true });
}

/** Encaminha pro webhook com retry/backoff. Nunca lança: falha vira log. */
async function encaminhar(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.MENTORIA_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
  const token =
    process.env.MENTORIA_WEBHOOK_TOKEN || process.env.LEAD_WEBHOOK_TOKEN;

  if (!url) {
    console.warn(
      "[mentoria] MENTORIA_WEBHOOK_URL não configurado — lead só no log:",
      JSON.stringify(payload),
    );
    return;
  }

  let ultimoErro = "";

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-lead-token": token } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (res.ok) return;

      ultimoErro = `HTTP ${res.status}`;
      // 4xx (fora 408/429) não melhora tentando de novo.
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        break;
      }
    } catch (err) {
      ultimoErro = err instanceof Error ? err.message : String(err);
    }

    if (tentativa < TENTATIVAS) {
      await esperar(BACKOFF_BASE_MS * 2 ** (tentativa - 1));
    }
  }

  // Falha definitiva: o lead fica no log, recuperável na mão.
  console.error(
    `[mentoria] webhook falhou após ${TENTATIVAS} tentativas (${ultimoErro}). PAYLOAD:`,
    JSON.stringify(payload),
  );
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
