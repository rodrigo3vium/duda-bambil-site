/**
 * POST /api/chat — cérebro do agente conversacional do Direcionador.
 *
 * Edge runtime (streaming de LLM em Node/Vercel Hobby estoura o cap de 10s).
 * O cliente manda SÓ os turnos da conversa; o system prompt é montado AQUI, no
 * servidor, a partir do bio.config — o browser nunca segura o papel `system`.
 *
 * Tools de roteamento TERMINAIS: quando o modelo chama `recomendar_entrada` ou
 * `encaminhar_reuniao`, a conversa cumpriu o papel (sem tool_result, sem 2º round).
 *
 * Protocolo de resposta (SSE):
 *   event: text     data: {"delta":"..."}            (token a token)
 *   event: routing  data: {"tipo":"entrada"|"reuniao","produtoSlug"?,"motivo"}
 *   event: done     data: {}
 *   event: error    data: {"message":"..."}
 *
 * PENDÊNCIA: precisa de OPENAI_API_KEY (server-only, SEM prefixo NEXT_PUBLIC_).
 * Sem ela, responde `openai_not_configured` (o resto do plumbing funciona).
 */

import { buildSystemPrompt, entrySlugs } from "./systemPrompt";
import { checkRateLimit, getClientIp } from "./ratelimit";

export const runtime = "edge";

const MAX_MESSAGES = 24; // ~12 trocas por conversa
const MAX_CHARS_PER_MSG = 2000;
const MAX_OUTPUT_TOKENS = 1024;
const RATE_MAX = 30; // mensagens por IP por janela
const RATE_WINDOW_SECS = 600; // 10 min

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── CORS / origin ─────────────────────────────────────────────────────────

function allowedOrigins(): string[] {
  return (process.env.CHAT_ALLOWED_ORIGIN ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = allowedOrigins();
  const allow = origin && allowed.includes(origin) ? origin : (allowed[0] ?? "*");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function originAllowed(req: Request): boolean {
  const allowed = allowedOrigins();
  if (allowed.length === 0) return true; // sem allowlist (dev) → não bloqueia
  const origin = req.headers.get("origin");
  if (origin && allowed.includes(origin)) return true;
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      if (allowed.includes(new URL(referer).origin)) return true;
    } catch {
      /* referer inválido */
    }
  }
  return false;
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function jsonResponse(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export async function OPTIONS(req: Request): Promise<Response> {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");

  if (!originAllowed(req)) {
    return jsonResponse({ error: "forbidden_origin" }, 403, origin);
  }

  // Parse + validação dos turnos
  let body: { messages?: unknown };
  try {
    body = (await req.json()) as { messages?: unknown };
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400, origin);
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  // Só user/assistant; ignora qualquer `system` que o cliente tente injetar.
  const messages: ClientMessage[] = raw
    .filter(
      (m): m is ClientMessage =>
        !!m &&
        typeof (m as ClientMessage).content === "string" &&
        ((m as ClientMessage).role === "user" || (m as ClientMessage).role === "assistant"),
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MSG) }));

  if (messages.length === 0) {
    return jsonResponse({ error: "empty_messages" }, 400, origin);
  }

  // Rate-limit por IP (stub fail-open por enquanto — ver ratelimit.ts)
  const rate = await checkRateLimit(getClientIp(req), {
    max: RATE_MAX,
    windowSecs: RATE_WINDOW_SECS,
  });
  if (!rate.allowed) {
    return jsonResponse({ error: "rate_limited" }, 429, origin);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "openai_not_configured" }, 500, origin);
  }
  const model = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o";

  const tools = [
    {
      type: "function",
      function: {
        name: "recomendar_entrada",
        description:
          "Chame quando a visitante é PROFISSIONAL da estética e o caminho dela é um material/formação da Duda que fecha no chat (curso, guia, imersão ou o guia gratuito). Só chame depois de acolher e entender — nunca cedo demais.",
        parameters: {
          type: "object",
          properties: {
            produtoSlug: {
              type: "string",
              enum: entrySlugs(),
              description: "slug do produto/material recomendado",
            },
            motivo: {
              type: "string",
              description: "1-2 frases calorosas retomando o que ela contou, justificando a escolha",
            },
          },
          required: ["produtoSlug", "motivo"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "encaminhar_reuniao",
        description:
          "Chame quando a visitante é PACIENTE (quer cuidar da própria pele). O caminho é uma avaliação de pele com a Duda — não se vende nada no chat, encaminha pra avaliação. Só chame depois de acolher a queixa.",
        parameters: {
          type: "object",
          properties: {
            motivo: {
              type: "string",
              description: "1-2 frases calorosas retomando a queixa/objetivo de pele da pessoa",
            },
          },
          required: ["motivo"],
          additionalProperties: false,
        },
      },
    },
  ];

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: MAX_OUTPUT_TOKENS,
      tools,
      tool_choice: "auto",
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return jsonResponse({ error: "openai_error", detail: text.slice(0, 500) }, 502, origin);
  }

  // Stream: parseia o SSE da OpenAI, repassa texto e emite o evento `routing`.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(sse(event, data)));

      // acumuladores de tool_call por index
      const toolAcc: Record<number, { name: string; args: string }> = {};
      let buffer = "";

      const flushRouting = () => {
        const first = Object.values(toolAcc)[0];
        if (!first) return false;
        let parsed: { produtoSlug?: string; motivo?: string } = {};
        try {
          parsed = JSON.parse(first.args || "{}");
        } catch {
          /* args incompletos — segue com o que tem */
        }
        if (first.name === "recomendar_entrada") {
          emit("routing", {
            tipo: "entrada",
            produtoSlug: parsed.produtoSlug ?? entrySlugs()[0],
            motivo: parsed.motivo ?? "",
          });
        } else if (first.name === "encaminhar_reuniao") {
          emit("routing", { tipo: "reuniao", motivo: parsed.motivo ?? "" });
        }
        return true;
      };

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // guarda a linha parcial

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;

            let chunk: {
              choices?: Array<{
                delta?: {
                  content?: string;
                  tool_calls?: Array<{
                    index?: number;
                    function?: { name?: string; arguments?: string };
                  }>;
                };
                finish_reason?: string;
              }>;
            };
            try {
              chunk = JSON.parse(payload);
            } catch {
              continue;
            }

            const choice = chunk.choices?.[0];
            if (!choice) continue;

            const delta = choice.delta ?? {};
            if (typeof delta.content === "string" && delta.content.length > 0) {
              emit("text", { delta: delta.content });
            }
            if (Array.isArray(delta.tool_calls)) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0;
                const acc = (toolAcc[idx] ??= { name: "", args: "" });
                if (tc.function?.name) acc.name = tc.function.name;
                if (tc.function?.arguments) acc.args += tc.function.arguments;
              }
            }
            if (choice.finish_reason === "tool_calls") {
              flushRouting();
            }
          }
        }
        emit("done", {});
      } catch (err) {
        emit("error", { message: "stream_failed" });
        console.error("[chat] stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      ...corsHeaders(origin),
    },
  });
}
