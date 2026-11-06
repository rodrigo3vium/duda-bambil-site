/**
 * Config da LP do Curso de Criação de Conteúdo para Estética.
 * Fica fora do page.tsx porque página do Next só pode exportar os campos
 * dela (default, metadata…) — e o teste precisa ler estes valores.
 */

// TODO(checkout): link provisório. Trocar pelo link real da Kiwify antes de
// publicar — o Rodrigo vai mandar (o produto já existe na Kiwify).
export const CHECKOUT_URL = "https://pay.kiwify.com.br/PENDENTE-curso-conteudo";

/** Preço à vista. O valor da parcela não aparece: depende da config da Kiwify. */
export const PRECO = "R$597";
