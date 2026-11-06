/**
 * LP /criacao-de-conteudo — guarda das promessas e do checkout.
 *
 * O Rodrigo confirmou só garantia de 7 dias + lista de equipamentos
 * (05/11/2026). Acesso vitalício e certificado NÃO foram confirmados: se
 * alguém copiar um bloco das outras LPs e eles voltarem, este teste quebra.
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import CriacaoDeConteudoPage from "@/app/criacao-de-conteudo/page";
import { CHECKOUT_URL, PRECO } from "@/app/criacao-de-conteudo/config";
import { __resetAttributionStore } from "@/lib/attribution";

beforeEach(() => {
  __resetAttributionStore();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("LP Criação de Conteúdo", () => {
  it("não promete acesso vitalício nem certificado", () => {
    const { container } = render(<CriacaoDeConteudoPage />);
    const texto = container.textContent ?? "";

    expect(texto).not.toMatch(/vital[ií]cio/i);
    expect(texto).not.toMatch(/certificado/i);
  });

  it("todo botão de compra sai pelo CheckoutLink com o link do curso", () => {
    const { container } = render(<CriacaoDeConteudoPage />);
    const checkouts = container.querySelectorAll("a[data-checkout='1']");

    expect(checkouts.length).toBe(2);
    checkouts.forEach((a) => {
      expect(a.getAttribute("href")?.startsWith(CHECKOUT_URL)).toBe(true);
    });
  });

  it("nenhum link de checkout da Kiwify sai cru (sem CheckoutLink)", () => {
    const { container } = render(<CriacaoDeConteudoPage />);
    const kiwifyCru = Array.from(
      container.querySelectorAll("a[href*='kiwify']"),
    ).filter((a) => a.getAttribute("data-checkout") !== "1");

    expect(kiwifyCru).toHaveLength(0);
  });

  it("mostra o preço e não inventa preço riscado", () => {
    const { container } = render(<CriacaoDeConteudoPage />);
    const texto = container.textContent ?? "";

    // PRECO tem "$": comparação de texto, não RegExp.
    expect(texto).toContain(PRECO);
    expect(screen.queryByText(/^De R\$/)).toBeNull();
  });
});
