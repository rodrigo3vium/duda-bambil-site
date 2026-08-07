import { describe, expect, it } from "vitest";
import {
  MOTIVO_MIN,
  VALORES_INICIAIS,
  mascararWhatsapp,
  normalizarAplicacao,
  normalizarInstagram,
  validarAplicacao,
  validarCampo,
  validarCampos,
  whatsappValido,
  type Aplicacao,
} from "@/app/mentoria/aplicacao";

function valida(over: Partial<Aplicacao> = {}): Aplicacao {
  return {
    nome: "Duda Bambil",
    whatsapp: "(67) 99856-8757",
    instagram: "@dudabambil",
    atuacao: "espaco_proprio",
    faturamento: "8k_15k",
    travamento: "preco_baixo",
    investimento_previo: "500_2k",
    prontidao: "agora",
    motivo: "Quero organizar a operação e finalmente subir o preço.",
    ...over,
  };
}

describe("whatsapp", () => {
  it("aceita celular com DDD válido e 11 dígitos", () => {
    expect(whatsappValido("(67) 99856-8757")).toBe(true);
    expect(whatsappValido("11999999999")).toBe(true);
  });

  it.each<[string, string]>([
    ["10 dígitos (fixo)", "6733334444"],
    ["12 dígitos", "679985687570"],
    ["DDD inexistente", "(20) 99856-8757"],
    ["DDD 00", "00998568757"],
    ["sem o 9 de celular", "(67) 88568-757"],
    ["vazio", ""],
    ["só texto", "meu zap"],
  ])("rejeita %s", (_caso, entrada) => {
    expect(whatsappValido(entrada)).toBe(false);
  });

  it("mascara progressivamente", () => {
    expect(mascararWhatsapp("6")).toBe("(6");
    expect(mascararWhatsapp("67")).toBe("(67");
    expect(mascararWhatsapp("679985")).toBe("(67) 9985");
    expect(mascararWhatsapp("67998568757")).toBe("(67) 99856-8757");
  });

  it("ignora dígitos além do 11º", () => {
    expect(mascararWhatsapp("679985687570000")).toBe("(67) 99856-8757");
  });

  it("valida com erro específico no campo", () => {
    expect(validarCampo("whatsapp", valida({ whatsapp: "(67) 9985" }))).toMatch(
      /WhatsApp válido/,
    );
    expect(validarCampo("whatsapp", valida({ whatsapp: "" }))).toMatch(/Informe/);
    expect(validarCampo("whatsapp", valida())).toBeNull();
  });
});

describe("normalização do Instagram", () => {
  it.each<[string, string]>([
    ["handle puro", "dudabambil"],
    ["com @", "@dudabambil"],
    ["com espaços", "  @dudabambil  "],
    ["URL https", "https://www.instagram.com/dudabambil"],
    ["URL com barra final", "https://instagram.com/dudabambil/"],
    ["URL sem protocolo", "instagram.com/dudabambil"],
    ["URL com www sem protocolo", "www.instagram.com/dudabambil"],
    ["URL mobile", "https://m.instagram.com/dudabambil"],
    ["URL com query", "https://www.instagram.com/dudabambil/?igshid=abc123"],
    ["URL com caminho extra", "https://www.instagram.com/dudabambil/reels/xyz"],
    ["URL com hash", "https://instagram.com/dudabambil#sobre"],
  ])("extrai o handle de %s", (_caso, entrada) => {
    expect(normalizarInstagram(entrada)).toBe("@dudabambil");
  });

  it("preserva ponto e underscore no handle", () => {
    expect(normalizarInstagram("duda.bambil_estetica")).toBe("@duda.bambil_estetica");
  });

  it("vazio continua vazio", () => {
    expect(normalizarInstagram("")).toBe("");
    expect(normalizarInstagram("   ")).toBe("");
  });

  it("rejeita handle com caractere inválido", () => {
    expect(validarCampo("instagram", valida({ instagram: "duda bambil" }))).toMatch(/@/);
    expect(validarCampo("instagram", valida({ instagram: "" }))).toMatch(/Informe/);
  });

  it("aceita na validação uma URL colada", () => {
    expect(
      validarCampo("instagram", valida({ instagram: "https://instagram.com/dudabambil/" })),
    ).toBeNull();
  });
});

describe("motivo", () => {
  it(`rejeita menos de ${MOTIVO_MIN} caracteres`, () => {
    expect(validarCampo("motivo", valida({ motivo: "quero muito" }))).toMatch(
      new RegExp(`${MOTIVO_MIN} caracteres`),
    );
  });

  it("conta sem espaços nas pontas", () => {
    const dezenove = "a".repeat(19);
    expect(validarCampo("motivo", valida({ motivo: `   ${dezenove}   ` }))).not.toBeNull();
    expect(validarCampo("motivo", valida({ motivo: "a".repeat(20) }))).toBeNull();
  });

  it("vazio pede resposta", () => {
    expect(validarCampo("motivo", valida({ motivo: "   " }))).toMatch(/Conte por que/);
  });
});

describe("campos de rádio", () => {
  it("vazio não passa", () => {
    expect(validarCampo("faturamento", valida({ faturamento: "" }))).toMatch(/Escolha/);
  });

  it("valor fora da lista de opções não passa", () => {
    expect(validarCampo("faturamento", valida({ faturamento: "acima_1_bilhao" }))).toBe(
      "Opção inválida.",
    );
    expect(validarCampo("prontidao", valida({ prontidao: "talvez" }))).toBe("Opção inválida.");
  });
});

describe("validação por tela e completa", () => {
  it("formulário em branco acusa os nove campos", () => {
    expect(Object.keys(validarAplicacao(VALORES_INICIAIS))).toHaveLength(9);
  });

  it("formulário válido não acusa nada", () => {
    expect(validarAplicacao(valida())).toEqual({});
  });

  it("validação por tela só olha os campos daquela tela", () => {
    // Tela 1 completa, telas 2 e 3 em branco.
    const parcial = {
      ...VALORES_INICIAIS,
      nome: "Duda",
      whatsapp: "67998568757",
      instagram: "@duda",
    };
    expect(validarCampos(["nome", "whatsapp", "instagram"], parcial)).toEqual({});
    expect(Object.keys(validarCampos(["atuacao", "faturamento", "travamento"], parcial))).toEqual([
      "atuacao",
      "faturamento",
      "travamento",
    ]);
  });
});

describe("normalizarAplicacao", () => {
  it("limpa o que vai pro webhook", () => {
    const saida = normalizarAplicacao(
      valida({
        nome: "  Duda   Bambil  ",
        whatsapp: "(67) 99856-8757",
        instagram: "https://www.instagram.com/dudabambil/?igshid=x",
        motivo: "  Quero organizar a operação inteira.  ",
      }),
    );

    expect(saida.nome).toBe("Duda Bambil");
    expect(saida.whatsapp).toBe("67998568757");
    expect(saida.instagram).toBe("@dudabambil");
    expect(saida.motivo).toBe("Quero organizar a operação inteira.");
  });
});
