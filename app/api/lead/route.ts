/**
 * POST /api/lead — captura de lead do Direcionador (/comece).
 *
 * Função: receber { nome, whatsapp, email, ... }, aplicar honeypot e ENCAMINHAR
 * pro destino real. O destino é uma "planilha simples" via webhook (ex.: Google
 * Apps Script / Sheets, Make, Zapier, n8n) — basta setar LEAD_WEBHOOK_URL.
 *
 * PENDÊNCIA (backend depois): enquanto LEAD_WEBHOOK_URL não estiver setado, o
 * endpoint ACEITA o lead e loga no server (visível em `vercel logs`), pra o fluxo
 * do front rodar inteiro. Nenhum lead é perdido silenciosamente sem aviso: o log
 * deixa o dado registrado até a planilha entrar.
 *
 * Env:
 *   LEAD_WEBHOOK_URL   (server-only) URL que recebe o POST do lead (a planilha).
 *   LEAD_WEBHOOK_TOKEN (server-only, opcional) enviado como header x-lead-token.
 */

interface LeadBody {
  nome?: string;
  whatsapp?: string;
  email?: string;
  empresa?: string; // honeypot
  respostas?: Record<string, string>;
  produtoRecomendado?: string;
  resumo?: string;
  intencao?: string;
  leadSourceSlug?: string;
  utm?: Record<string, string | null>;
  /** atribuição achatada (lib/attribution.ts:flattenAttribution) */
  atribuicao?: Record<string, string | null>;
}

/** Só strings/null entram na planilha: objeto aninhado viraria "[object Object]". */
function apenasEscalares(
  bruto: Record<string, unknown> | undefined,
): Record<string, string | null> {
  const saida: Record<string, string | null> = {};
  if (!bruto || typeof bruto !== "object") return saida;
  for (const [chave, valor] of Object.entries(bruto)) {
    if (typeof valor === "string") saida[chave] = valor;
    else if (valor === null || valor === undefined) saida[chave] = null;
  }
  return saida;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request): Promise<Response> {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bot preenche `empresa`. Responde ok (não dá pista) mas descarta.
  if (body.empresa && body.empresa.trim().length > 0) {
    return Response.json({ ok: true, leadId: "ignored" });
  }

  const nome = (body.nome ?? "").trim();
  const whatsapp = (body.whatsapp ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();

  if (!nome || !whatsapp || !email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }

  const lead = {
    nome,
    whatsapp,
    email,
    produtoRecomendado: body.produtoRecomendado ?? "",
    resumo: body.resumo ?? "",
    intencao: body.intencao ?? "quiz",
    leadSourceSlug: body.leadSourceSlug ?? "comece-bio",
    utm: body.utm ?? {},
    // Mesmas colunas que a planilha da mentoria recebe (um schema só).
    ...apenasEscalares(body.atribuicao),
    origem: "comece",
    recebidoEm: new Date().toISOString(),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (!webhook) {
    // Backend ainda não configurado — registra o lead no log e segue.
    console.warn("[lead] LEAD_WEBHOOK_URL não configurado — lead registrado só no log:", lead);
    return Response.json({ ok: true, leadId: "logged" });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { "x-lead-token": process.env.LEAD_WEBHOOK_TOKEN }
          : {}),
      },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[lead] webhook falhou:", res.status, text.slice(0, 300));
      // Não perde o lead: loga o payload completo pra recuperação manual.
      console.error("[lead] payload:", lead);
      return Response.json({ ok: false, error: `webhook_${res.status}` }, { status: 502 });
    }
  } catch (err) {
    console.error("[lead] erro ao chamar webhook:", err, lead);
    return Response.json({ ok: false, error: "webhook_error" }, { status: 502 });
  }

  return Response.json({ ok: true, leadId: "sent" });
}
