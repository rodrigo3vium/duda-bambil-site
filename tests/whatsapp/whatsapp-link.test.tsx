/**
 * Botões de WhatsApp — cada botão tem a SUA mensagem pronta (é assim que a
 * equipe da Duda sabe, pela conversa, de qual botão a pessoa veio) e todo
 * clique vira evento: Contact no Meta Pixel + evento no Clarity.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { __resetAttributionStore, initAttribution } from "@/lib/attribution";
import {
  BOTOES_WHATSAPP,
  WHATSAPP_NUMERO,
  whatsappUrl,
  type BotaoWhatsappId,
} from "@/utils/whatsappBotoes";

let fbq: ReturnType<typeof vi.fn>;
let clarity: ReturnType<typeof vi.fn>;

beforeEach(() => {
  __resetAttributionStore();
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  fbq = vi.fn();
  clarity = vi.fn();
  window.fbq = fbq;
  window.clarity = clarity;
});

afterEach(() => {
  delete window.fbq;
  delete window.clarity;
  vi.clearAllMocks();
});

const ids = Object.keys(BOTOES_WHATSAPP) as BotaoWhatsappId[];

function chamadasContact() {
  return fbq.mock.calls.filter((c) => c[0] === "track" && c[1] === "Contact");
}

describe("mensagem pronta por botão", () => {
  it("nenhuma mensagem se repete — senão não dá pra saber de qual botão veio", () => {
    const mensagens = ids.map((id) => BOTOES_WHATSAPP[id].mensagem);
    expect(new Set(mensagens).size).toBe(mensagens.length);
  });

  it("toda mensagem diz que a pessoa veio do site", () => {
    for (const id of ids) {
      expect(BOTOES_WHATSAPP[id].mensagem).toContain("Vim pelo seu site");
    }
  });

  it("a URL abre o WhatsApp comercial da Duda com a mensagem do botão", () => {
    for (const id of ids) {
      const url = new URL(whatsappUrl(id));
      expect(url.origin + url.pathname).toBe(`https://wa.me/${WHATSAPP_NUMERO}`);
      expect(url.searchParams.get("text")).toBe(BOTOES_WHATSAPP[id].mensagem);
    }
  });
});

describe("<WhatsAppLink>", () => {
  it("renderiza a URL do botão e abre em nova aba", () => {
    render(<WhatsAppLink botao="home-agendar">Agendar</WhatsAppLink>);
    const link = screen.getByRole("link", { name: "Agendar" });

    expect(link.getAttribute("href")).toBe(whatsappUrl("home-agendar"));
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("dispara exatamente um Contact por clique, com o botão e um event_id", async () => {
    const user = userEvent.setup();
    render(<WhatsAppLink botao="home-cursos-presenciais">Cursos</WhatsAppLink>);

    await user.click(screen.getByRole("link", { name: "Cursos" }));

    const chamadas = chamadasContact();
    expect(chamadas).toHaveLength(1);
    const [, , params, opcoes] = chamadas[0];
    expect(params).toMatchObject({
      content_name: "home-cursos-presenciais",
      content_category: "whatsapp",
    });
    expect((opcoes as { eventID: string }).eventID).toMatch(/[0-9a-f-]{36}/);
  });

  it("leva a origem (utm do last touch) junto no evento", async () => {
    window.history.replaceState({}, "", "/?utm_source=instagram&utm_medium=bio&utm_campaign=outubro");
    initAttribution();

    const user = userEvent.setup();
    render(<WhatsAppLink botao="home-agendar">Agendar</WhatsAppLink>);
    await user.click(screen.getByRole("link", { name: "Agendar" }));

    const [, , params] = chamadasContact()[0];
    expect(params).toMatchObject({
      utm_source: "instagram",
      utm_medium: "bio",
      utm_campaign: "outubro",
    });
  });

  it("registra o clique no Clarity: evento geral, evento do botão e tag", async () => {
    const user = userEvent.setup();
    render(<WhatsAppLink botao="home-rodape">Rodapé</WhatsAppLink>);

    await user.click(screen.getByRole("link", { name: "Rodapé" }));

    expect(clarity).toHaveBeenCalledWith("event", "whatsapp_click");
    expect(clarity).toHaveBeenCalledWith("event", "whatsapp_home_rodape");
    expect(clarity).toHaveBeenCalledWith("set", "whatsapp_botao", "home-rodape");
  });

  it("pixel e Clarity bloqueados (adblock) não quebram o clique", async () => {
    delete window.fbq;
    delete window.clarity;
    const user = userEvent.setup();
    render(<WhatsAppLink botao="home-agendar">Agendar</WhatsAppLink>);

    await expect(
      user.click(screen.getByRole("link", { name: "Agendar" })),
    ).resolves.not.toThrow();
  });
});

describe("guarda: nenhum link de WhatsApp cru", () => {
  // Um <a href="https://wa.me/..."> escrito à mão pula a mensagem mapeada e o
  // evento — exatamente o buraco que este componente fecha.
  function arquivos(dir: string): string[] {
    return readdirSync(dir).flatMap((nome) => {
      const caminho = path.join(dir, nome);
      if (statSync(caminho).isDirectory()) return arquivos(caminho);
      return /\.(tsx?|jsx?)$/.test(nome) ? [caminho] : [];
    });
  }

  it("app/ e components/ não têm wa.me escrito à mão", () => {
    const raiz = path.resolve(__dirname, "../..");
    const ofensores = ["app", "components"]
      .flatMap((d) => arquivos(path.join(raiz, d)))
      .filter((f) => readFileSync(f, "utf8").includes("wa.me/"))
      .map((f) => path.relative(raiz, f));

    expect(ofensores).toEqual([]);
  });
});
