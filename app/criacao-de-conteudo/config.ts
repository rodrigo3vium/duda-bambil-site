/**
 * Config da LP do Curso de Criação de Conteúdo para Estética.
 * Fica fora do page.tsx porque página do Next só pode exportar os campos
 * dela (default, metadata…) — e o teste precisa ler estes valores.
 */

/** Checkout do produto "Conteúdo que vende" na Kiwify (R$597, link do tipo Checkout). */
export const CHECKOUT_URL = "https://pay.kiwify.com.br/0oKeqVO";

/** Preço à vista. O valor da parcela não aparece: depende da config da Kiwify. */
export const PRECO = "R$597";
