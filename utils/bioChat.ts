/**
 * Cliente do endpoint de chat (/api/chat). Faz POST com os turnos da conversa e
 * consome o stream SSE: deltas de texto + o evento de roteamento final.
 *
 * Protocolo (espelho de app/api/chat/route.ts):
 *   event: text     data: {"delta":"..."}
 *   event: routing  data: {"tipo":"entrada"|"reuniao","produtoSlug"?,"motivo"}
 *   event: done     data: {}
 *   event: error    data: {"message":"..."}
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RoutingEvent {
  tipo: "entrada" | "reuniao";
  produtoSlug?: string;
  motivo: string;
}

export interface ChatStreamHandlers {
  onText: (delta: string) => void;
  onRouting: (routing: RoutingEvent) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

const FRIENDLY_BY_STATUS: Record<number, string> = {
  429: "Calma, muita gente chegando 💛 espera só um minutinho e tenta de novo.",
  403: "Não consegui te atender por aqui agora. Tenta abrir pelo link da bio, tá?",
  500: "Tive um probleminha técnico. Tenta de novo em instantes, por favor.",
  502: "A conexão com a assistente oscilou. Tenta de novo em instantes 💛",
};

/** Faz a chamada e dispara os handlers conforme o stream chega. */
export async function streamChat(
  messages: ChatMessage[],
  handlers: ChatStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch {
    handlers.onError("Não consegui falar com a assistente. Confere sua conexão 💛");
    return;
  }

  if (!res.ok || !res.body) {
    handlers.onError(
      FRIENDLY_BY_STATUS[res.status] ?? "Tive um probleminha. Tenta de novo, por favor.",
    );
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // eventos SSE são separados por linha em branco
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const evMatch = block.match(/^event:\s*(.+)$/m);
        const dataMatch = block.match(/^data:\s*(.+)$/m);
        if (!evMatch || !dataMatch) continue;

        const event = evMatch[1].trim();
        let data: unknown;
        try {
          data = JSON.parse(dataMatch[1].trim());
        } catch {
          continue;
        }

        if (event === "text") {
          handlers.onText((data as { delta: string }).delta);
        } else if (event === "routing") {
          handlers.onRouting(data as RoutingEvent);
        } else if (event === "done") {
          handlers.onDone();
        } else if (event === "error") {
          handlers.onError(
            (data as { message?: string }).message ?? "Tive um probleminha. Tenta de novo.",
          );
        }
      }
    }
  } catch {
    if (!signal?.aborted) {
      handlers.onError("A conexão caiu no meio. Tenta de novo, por favor 💛");
    }
  }
}
