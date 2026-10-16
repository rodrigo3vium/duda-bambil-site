/**
 * Submit do lead → endpoint interno do próprio site (/api/lead).
 *
 * O /api/lead (app/api/lead/route.ts) faz honeypot + valida e ENCAMINHA pro
 * destino real (uma planilha simples via webhook, quando configurado). Enquanto
 * o backend não existe, o endpoint aceita e loga o lead — o fluxo do front roda
 * inteiro. Aqui a gente só monta o payload e trata a resposta.
 */

import {
  flattenAttribution,
  utmBagFromAttribution,
  type Attribution,
} from "@/lib/attribution";

export interface BioLeadInput {
  nome: string;
  whatsapp: string;
  email: string;
  /** honeypot — campo oculto; se vier preenchido, é bot (o servidor descarta) */
  empresa?: string;
  /** respostas de um quiz (não usado no fluxo conversacional; fica {}) */
  respostas: Record<string, string>;
  /** slug do produto/caminho recomendado pela IA */
  produtoRecomendado: string;
  /** resumo/motivo legível vindo da IA (vai pras notas do lead) */
  resumo: string;
  /** atribuição vigente (lib/attribution.ts) — origem do lead */
  attribution: Attribution;
  /** fonte do lead (slug) */
  leadSourceSlug: string;
  /** intenção: 'quiz' (produto de entrada) ou 'agendar' (avaliação) */
  intencao?: "quiz" | "agendar";
}

export interface BioLeadResult {
  ok: boolean;
  /** id do lead, quando o backend retornar */
  leadId?: string;
  /** mensagem de erro pra log (não exibir cru pro usuário) */
  error?: string;
}

const LEAD_ENDPOINT = "/api/lead";

/**
 * Envia o lead pro /api/lead. Em sucesso devolve { ok: true, leadId? }.
 * Em falha de rede/HTTP devolve { ok: false, error }.
 */
export async function submitBioLead(input: BioLeadInput): Promise<BioLeadResult> {
  let res: Response;
  try {
    res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: input.nome.trim(),
        whatsapp: input.whatsapp.trim(),
        email: input.email.trim().toLowerCase(),
        // honeypot: humano deixa vazio
        empresa: input.empresa ?? "",
        respostas: input.respostas,
        produtoRecomendado: input.produtoRecomendado,
        resumo: input.resumo,
        intencao: input.intencao ?? "quiz",
        leadSourceSlug: input.leadSourceSlug,
        // `utm` (bag do last touch) fica pra compatibilidade com o que a rota
        // já aceitava; `atribuicao` é o schema achatado completo — mesmas
        // colunas que a planilha da mentoria recebe.
        utm: utmBagFromAttribution(input.attribution),
        atribuicao: flattenAttribution(input.attribution),
      }),
    });
  } catch (err) {
    return { ok: false, error: `network ${String(err)}` };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `HTTP ${res.status} ${text}`.trim() };
  }

  const data = (await res.json().catch(() => ({}))) as { leadId?: string };
  return { ok: true, leadId: data.leadId };
}
