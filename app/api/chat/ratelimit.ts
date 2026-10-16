/**
 * Rate-limit por IP pro endpoint de chat.
 *
 * STUB por enquanto (fail-open): sempre libera. O minisite da Giulia usava um RPC
 * atômico no Supabase pra travar custo/abuso — aqui o Supabase foi removido e o
 * backend será definido depois (planilha/webhook). Como a OPENAI_API_KEY ainda é
 * pendência, não há endpoint de LLM vivo pra proteger.
 *
 * ⚠️ Antes de ligar tráfego pago apontando pro /comece com a chave da OpenAI
 * configurada, implemente aqui uma trava real (KV/Upstash, Vercel KV, etc.) —
 * endpoint de LLM exposto é alvo de cost-DoS. `getClientIp` já está pronto.
 */

export interface RateLimitResult {
  allowed: boolean;
  count: number;
}

/** Extrai o IP do cliente (1º hop do x-forwarded-for na Vercel). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkRateLimit(
  _ip: string,
  _opts: { max: number; windowSecs: number },
): Promise<RateLimitResult> {
  // TODO(backend): trava real de rate-limit antes do lançamento pago.
  return { allowed: true, count: 0 };
}
