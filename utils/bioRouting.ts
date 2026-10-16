/**
 * Helpers do Direcionador. O roteamento é conversacional (a IA decide via tool
 * call em app/api/chat) — aqui só sobra o lookup de produto por slug, usado pela
 * página de detalhe e pela vitrine.
 */

import type { Produto } from "@/config/bio.config";

/** Acha o produto pelo slug (ou undefined). */
export function findProduto(
  slug: string,
  produtos: Produto[],
): Produto | undefined {
  return produtos.find((p) => p.slug === slug);
}
