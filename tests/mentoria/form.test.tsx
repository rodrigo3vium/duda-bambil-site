import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AplicacaoForm from "@/app/mentoria/AplicacaoForm";

type User = ReturnType<typeof userEvent.setup>;

let fetchMock: ReturnType<typeof vi.fn>;

function respostaOk() {
  return {
    ok: true,
    json: async () => ({ ok: true }),
  } as unknown as Response;
}

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(respostaOk());
  vi.stubGlobal("fetch", fetchMock);
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const MOTIVO = "Cansei de trabalhar muito e ganhar pouco.";

async function avancar(user: User) {
  await user.click(screen.getByRole("button", { name: "Continuar" }));
}

/** As 9 perguntas, na ordem: o enunciado que aparece na tela e como respondê-la. */
function passos(user: User, prontidao = "Sim, agora") {
  const digita = (label: string, texto: string) => async () => {
    await user.type(screen.getByLabelText(label), texto);
  };
  const marca = (label: string) => async () => {
    await user.click(screen.getByLabelText(label));
  };

  return [
    { pergunta: "Seu nome", responder: digita("Seu nome", "Duda Bambil") },
    { pergunta: "WhatsApp", responder: digita("WhatsApp", "67998568757") },
    { pergunta: "Instagram", responder: digita("Instagram", "@dudabambil") },
    { pergunta: "Como você atende hoje?", responder: marca("Tenho espaço próprio") },
    {
      pergunta: "Qual seu faturamento mensal com estética?",
      responder: marca("Entre R$ 8 e 15 mil"),
    },
    {
      pergunta: "O que mais te trava hoje?",
      responder: marca("Cobro barato e não consigo subir o preço"),
    },
    {
      pergunta: "Quanto você já investiu na sua formação ou no seu negócio?",
      responder: marca("Entre R$ 500 e 2 mil"),
    },
    { pergunta: "Você está pronta para começar?", responder: marca(prontidao) },
    { pergunta: "Por que agora?", responder: digita("Por que agora?", MOTIVO) },
  ];
}

/**
 * Responde as `ate` primeiras perguntas, avançando depois de cada uma. Como
 * não se avança depois da 9ª, `preencher(user)` para na última tela com tudo
 * respondido — o envio fica por conta do teste.
 */
async function preencher(user: User, ate = 9, prontidao = "Sim, agora") {
  await responderDe(user, 1, ate, prontidao);
}

/**
 * Responde da pergunta `de` até a `ate` (1-indexadas, inclusivas), assumindo
 * que a tela atual já é a da pergunta `de`. Serve pra continuar de onde um
 * `preencher` parcial parou, em vez de recomeçar da primeira tela.
 */
async function responderDe(user: User, de: number, ate: number, prontidao = "Sim, agora") {
  const lista = passos(user, prontidao);
  for (let i = de - 1; i < ate; i++) {
    await lista[i].responder();
    if (i < lista.length - 1) await avancar(user);
  }
}

/** Quantas perguntas estão visíveis: caixas de texto + grupos de rádio. */
function perguntasVisiveis() {
  return screen.queryAllByRole("textbox").length + screen.queryAllByRole("group").length;
}

describe("uma pergunta por tela", () => {
  it("percorre as 9 telas mostrando exatamente uma pergunta em cada", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    const lista = passos(user);

    for (let i = 0; i < lista.length; i++) {
      expect(screen.getByText(new RegExp(`Etapa ${i + 1} de 9`))).toBeInTheDocument();
      expect(screen.getByText(lista[i].pergunta)).toBeInTheDocument();
      expect(perguntasVisiveis()).toBe(1);

      await lista[i].responder();
      if (i < lista.length - 1) await avancar(user);
    }

    // Chegou na última tela: o botão vira envio.
    expect(screen.getByRole("button", { name: "Enviar aplicação" })).toBeInTheDocument();
  });
});

describe("multi-step — não avança com tela inválida", () => {
  it("tela 1 em branco não avança e mostra o erro do nome", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await avancar(user);

    expect(screen.getByText(/Etapa 1 de 9/)).toBeInTheDocument();
    expect(screen.getByText("Informe seu nome.")).toBeInTheDocument();
  });

  it("manda o foco pro campo inválido", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 1); // preenche o nome e avança
    await avancar(user); // tenta passar da tela do WhatsApp em branco

    await waitFor(() => expect(screen.getByLabelText("WhatsApp")).toHaveFocus());
  });

  it("liga aria-invalid e aria-describedby no campo com erro", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 1);
    await user.type(screen.getByLabelText("WhatsApp"), "679985");
    await avancar(user);

    const input = screen.getByLabelText("WhatsApp");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby") ?? "").toContain("whatsapp-erro");
    expect(document.getElementById("whatsapp-erro")).toHaveTextContent(
      "Informe um WhatsApp válido com DDD.",
    );
  });

  it("whatsapp com DDD inexistente não passa", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 1);
    await user.type(screen.getByLabelText("WhatsApp"), "20999999999");
    await avancar(user);

    expect(screen.getByText(/Etapa 2 de 9/)).toBeInTheDocument();
    expect(screen.getByText("Informe um WhatsApp válido com DDD.")).toBeInTheDocument();
  });

  it("tela de rádio sem escolher não avança", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 3); // nome, whatsapp, instagram → chega na tela 4
    expect(screen.getByText(/Etapa 4 de 9/)).toBeInTheDocument();

    await avancar(user);

    expect(screen.getByText(/Etapa 4 de 9/)).toBeInTheDocument();
    expect(screen.getByText("Escolha uma opção para continuar.")).toBeInTheDocument();
  });

  it("motivo curto demais não envia", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 8);
    await user.type(screen.getByLabelText("Por que agora?"), "quero");
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Escreva pelo menos 20 caracteres.")).toBeInTheDocument();
  });

  it("o contador do motivo mostra quanto falta", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 8);

    expect(screen.getByText(/Faltam 20 caracteres/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Por que agora?"), "12345");
    expect(screen.getByText(/Faltam 15 caracteres/)).toBeInTheDocument();
  });
});

describe("multi-step — navegação e estado", () => {
  it("não mostra Voltar na tela 1 e mostra a partir da tela 2", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
    await preencher(user, 1);
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
  });

  it("preserva o estado ao voltar várias telas e ao avançar de novo", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 5); // chega na tela 6 com 5 respostas dadas
    expect(screen.getByText(/Etapa 6 de 9/)).toBeInTheDocument();

    // Volta cinco telas até o nome.
    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByRole("button", { name: "Voltar" }));
    }
    expect(screen.getByText(/Etapa 1 de 9/)).toBeInTheDocument();
    expect(screen.getByLabelText("Seu nome")).toHaveValue("Duda Bambil");

    // Avança de novo — tudo continua preenchido, texto e rádio.
    await avancar(user);
    expect(screen.getByLabelText("WhatsApp")).toHaveValue("(67) 99856-8757");
    await avancar(user);
    expect(screen.getByLabelText("Instagram")).toHaveValue("@dudabambil");
    await avancar(user);
    expect(screen.getByLabelText("Tenho espaço próprio")).toBeChecked();
    expect(screen.getByLabelText("Tenho espaço e equipe")).not.toBeChecked();
    await avancar(user);
    expect(screen.getByLabelText("Entre R$ 8 e 15 mil")).toBeChecked();
  });

  it("move o foco pro rótulo da etapa ao avançar, sem roubar o foco de quem já digita", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 1);
    expect(screen.getByText(/Etapa 2 de 9/)).toHaveFocus();

    await responderDe(user, 2, 8);
    const motivo = screen.getByLabelText("Por que agora?");
    await user.type(motivo, "Comecei a digitar assim que a tela trocou.");
    expect(motivo).toHaveFocus();
    expect(motivo).toHaveValue("Comecei a digitar assim que a tela trocou.");
  });

  it("a barra de progresso acompanha as 9 etapas", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    const barra = () => screen.getByRole("progressbar");
    expect(barra()).toHaveAttribute("aria-valuemax", "9");
    expect(barra()).toHaveAttribute("aria-valuenow", "1");

    await preencher(user, 1);
    expect(barra()).toHaveAttribute("aria-valuenow", "2");

    await responderDe(user, 2, 5);
    expect(barra()).toHaveAttribute("aria-valuenow", "6");
  });

  it("normaliza a URL do Instagram colada quando o campo perde o foco", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 2);
    const instagram = screen.getByLabelText("Instagram");
    await user.type(instagram, "https://www.instagram.com/dudabambil/?igshid=abc");
    await user.tab();

    expect(instagram).toHaveValue("@dudabambil");
  });

  it("aplica a máscara do WhatsApp enquanto digita", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user, 1);
    const whatsapp = screen.getByLabelText("WhatsApp");
    await user.type(whatsapp, "67998568757");
    expect(whatsapp).toHaveValue("(67) 99856-8757");
  });
});

describe("envio", () => {
  it("posta os nove campos + metadados e mostra a finalização única", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user);
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/mentoria");
    const enviado = JSON.parse(init.body as string);
    expect(enviado).toMatchObject({
      nome: "Duda Bambil",
      whatsapp: "(67) 99856-8757",
      instagram: "@dudabambil",
      atuacao: "espaco_proprio",
      faturamento: "8k_15k",
      travamento: "preco_baixo",
      investimento_previo: "500_2k",
      prontidao: "agora",
      motivo: MOTIVO,
      empresa: "",
    });
    expect(typeof enviado.tempoPreenchimentoMs).toBe("number");

    // Nada de score/classificação saindo do cliente.
    expect(enviado).not.toHaveProperty("score");
    expect(enviado).not.toHaveProperty("classificacao");

    // Formulário sai de cena, finalização entra no lugar.
    await waitFor(() =>
      expect(screen.getByText("Recebemos seus dados.")).toBeInTheDocument(),
    );
    expect(screen.queryByRole("button", { name: "Enviar aplicação" })).not.toBeInTheDocument();
    expect(
      screen.getByText(/Uma pessoa da minha equipe vai entrar em contato/i),
    ).toBeInTheDocument();
  });

  it("mostra a MESMA finalização para qualquer combinação de respostas", async () => {
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    // Perfil oposto ao do teste anterior: sem pressa nenhuma.
    await preencher(user, 9, "Só mais pra frente");
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));

    await waitFor(() =>
      expect(screen.getByText("Recebemos seus dados.")).toBeInTheDocument(),
    );

    // Nenhuma pista de triagem, régua ou caminho alternativo na tela.
    const texto = document.body.textContent ?? "";
    expect(texto).not.toMatch(/reprovad|aprovad/i);
    expect(texto).not.toMatch(/score/i);
    expect(texto).not.toMatch(/curso/i);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("trava o double-submit enquanto o envio está em voo", async () => {
    let liberar: (r: Response) => void = () => {};
    fetchMock.mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          liberar = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user);
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));

    await waitFor(() => expect(screen.getByRole("button", { name: /Enviando/ })).toBeDisabled());
    await user.click(screen.getByRole("button", { name: /Enviando/ }));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    liberar(respostaOk());
    await waitFor(() =>
      expect(screen.getByText("Recebemos seus dados.")).toBeInTheDocument(),
    );
  });

  it("falha de rede mostra erro e deixa tentar de novo, sem perder o preenchimento", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user);
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/conexão caiu/i);
    expect(screen.getByLabelText("Por que agora?")).toHaveValue(MOTIVO);

    fetchMock.mockResolvedValue(respostaOk());
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));
    await waitFor(() =>
      expect(screen.getByText("Recebemos seus dados.")).toBeInTheDocument(),
    );
  });

  it("envia as UTMs guardadas na sessão", async () => {
    sessionStorage.setItem(
      "mentoria_utm",
      JSON.stringify({ utm_source: "instagram", utm_campaign: "mentoria-set" }),
    );

    const user = userEvent.setup();
    render(<AplicacaoForm />);

    await preencher(user);
    await user.click(screen.getByRole("button", { name: "Enviar aplicação" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const enviado = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(enviado.utm).toMatchObject({
      utm_source: "instagram",
      utm_campaign: "mentoria-set",
    });
  });
});
