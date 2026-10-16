/**
 * <CheckoutLink> — a única âncora de checkout do site.
 * Garante o InitiateCheckout (uma vez por clique) e a URL carimbada.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutLink } from "@/components/CheckoutLink";
import { __resetAttributionStore, initAttribution } from "@/lib/attribution";
import { navigateTo } from "@/utils/navigation";

// jsdom não navega de verdade — o módulo de navegação existe pra ser mockado.
vi.mock("@/utils/navigation", () => ({
  navigateTo: vi.fn(),
  openInNewTab: vi.fn(),
}));

const BASE = "https://pay.kiwify.com.br/IKV1kqf";

let fbq: ReturnType<typeof vi.fn>;

beforeEach(() => {
  __resetAttributionStore();
  window.localStorage.clear();
  window.sessionStorage.clear();
  fbq = vi.fn();
  window.fbq = fbq;
  vi.mocked(navigateTo).mockClear();
});

afterEach(() => {
  delete window.fbq;
  vi.clearAllMocks();
});

function chamadasDe(evento: string) {
  return fbq.mock.calls.filter((c) => c[0] === "track" && c[1] === evento);
}

describe("InitiateCheckout", () => {
  it("dispara exatamente uma vez por clique", async () => {
    const user = userEvent.setup();
    render(
      <CheckoutLink href={BASE} produto="curso-gerenciamento" origem="lp-gerenciamento">
        Quero meu acesso
      </CheckoutLink>,
    );

    await user.click(screen.getByRole("link", { name: "Quero meu acesso" }));

    expect(chamadasDe("InitiateCheckout")).toHaveLength(1);
  });

  it("dois cliques = dois eventos, com event_ids diferentes", async () => {
    const user = userEvent.setup();
    render(<CheckoutLink href={BASE}>Comprar</CheckoutLink>);
    const link = screen.getByRole("link", { name: "Comprar" });

    await user.click(link);
    await user.click(link);

    const chamadas = chamadasDe("InitiateCheckout");
    expect(chamadas).toHaveLength(2);
    const ids = chamadas.map((c) => (c[3] as { eventID: string }).eventID);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("leva produto e origem como parâmetros do evento", async () => {
    const user = userEvent.setup();
    render(
      <CheckoutLink href={BASE} produto="curso-limpeza" origem="lp-limpeza-final">
        Começar
      </CheckoutLink>,
    );

    await user.click(screen.getByRole("link", { name: "Começar" }));

    const [, , params] = chamadasDe("InitiateCheckout")[0];
    expect(params).toMatchObject({
      content_name: "curso-limpeza",
      content_category: "lp-limpeza-final",
    });
  });

  it("pixel ausente (adblock) não quebra o clique", async () => {
    delete window.fbq;
    const user = userEvent.setup();
    render(<CheckoutLink href={BASE}>Comprar</CheckoutLink>);

    await user.click(screen.getByRole("link", { name: "Comprar" }));

    expect(vi.mocked(navigateTo)).toHaveBeenCalledTimes(1);
  });
});

describe("URL carimbada", () => {
  it("navega com a atribuição e com o event_id do próprio clique", async () => {
    window.history.replaceState({}, "", "/gerenciamento-de-pele?utm_source=instagram&utm_medium=bio");
    initAttribution();

    const user = userEvent.setup();
    render(<CheckoutLink href={BASE}>Comprar</CheckoutLink>);
    await user.click(screen.getByRole("link", { name: "Comprar" }));

    const destino = new URL(vi.mocked(navigateTo).mock.calls[0][0]);
    const eventId = (chamadasDe("InitiateCheckout")[0][3] as { eventID: string }).eventID;

    expect(destino.origin + destino.pathname).toBe(BASE);
    expect(destino.searchParams.get("utm_source")).toBe("instagram");
    expect(destino.searchParams.get("src")).toBe("instagram");
    expect(destino.searchParams.get("sck")).toBe("instagram|bio");
    expect(destino.searchParams.get("s2")).toBe(eventId);
  });

  it("o href renderizado já leva a atribuição (abrir em nova aba não perde origem)", async () => {
    window.history.replaceState({}, "", "/limpeza-de-pele?utm_source=facebook&utm_campaign=black");
    initAttribution();

    render(<CheckoutLink href={BASE}>Comprar</CheckoutLink>);

    const href = screen.getByRole("link", { name: "Comprar" }).getAttribute("href") ?? "";
    expect(href).toContain("utm_source=facebook");
    expect(href).toContain("utm_campaign=black");
    // event_id só existe quando há clique
    expect(href).not.toContain("s2=");
  });

  it("ctrl+clique não intercepta, mas registra o evento", async () => {
    const user = userEvent.setup();
    render(<CheckoutLink href={BASE}>Comprar</CheckoutLink>);

    await user.keyboard("{Control>}");
    await user.click(screen.getByRole("link", { name: "Comprar" }));
    await user.keyboard("{/Control}");

    expect(chamadasDe("InitiateCheckout")).toHaveLength(1);
    expect(vi.mocked(navigateTo)).not.toHaveBeenCalled();
  });
});
