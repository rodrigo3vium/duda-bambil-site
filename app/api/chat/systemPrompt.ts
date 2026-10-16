/**
 * Montagem do system prompt — roda SÓ no servidor (route handler edge).
 * O cliente nunca monta nem vê o system prompt; só manda os turnos da conversa.
 * Preenche os placeholders do template (config/bio.config.ts) com o catálogo real.
 */

import { bioConfig, type BioConfig, type Produto } from "@/config/bio.config";

/** Texto legível do catálogo, pro placeholder {{CATALOGO_DE_PRODUTOS}}. */
function buildCatalogText(produtos: Produto[], entrySlugs: string[], meetingSlug: string): string {
  return produtos
    .map((p) => {
      const tipo =
        p.slug === meetingSlug
          ? "paciente → avaliação"
          : entrySlugs.includes(p.slug)
            ? "profissional → fecha no chat"
            : "—";
      const preco = p.preco ? ` · ${p.preco}` : "";
      return `- **${p.nome}** (slug: ${p.slug}, ${tipo})${preco} — ${p.promessa}`;
    })
    .join("\n");
}

/** Monta o system prompt final a partir do config. */
export function buildSystemPrompt(config: BioConfig = bioConfig): string {
  const { agente, produtos } = config;

  const entry = produtos.find((p) => p.slug === agente.entryProductSlugs[0]);
  const produtoEntrada = entry?.nome ?? "o produto de entrada";
  const linkEntrada = entry?.checkoutUrl
    ? entry.checkoutUrl
    : "[o link é revelado pela interface após a pessoa deixar o contato]";

  const caminhoPaciente = `encaminhe pra avaliação de pele com a ${agente.meetingResponsavel} (a interface mostra o próximo passo depois que você chama a ferramenta encaminhar_reuniao)`;

  return agente.systemPromptTemplate
    .replace(
      "{{CATALOGO_DE_PRODUTOS}}",
      buildCatalogText(produtos, agente.entryProductSlugs, agente.meetingProductSlug),
    )
    .replace("{{PRODUTO_DE_ENTRADA}}", produtoEntrada)
    .replace("{{LINK_PRODUTO_DE_ENTRADA}}", linkEntrada)
    .replace("{{CAMINHO_PACIENTE}}", caminhoPaciente);
}

/** Slugs válidos pra tool recomendar_entrada (trava o enum no servidor). */
export function entrySlugs(config: BioConfig = bioConfig): string[] {
  return config.agente.entryProductSlugs;
}
