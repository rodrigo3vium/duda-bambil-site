/**
 * Aplicação da mentoria — CAMPOS, NORMALIZAÇÃO e VALIDAÇÃO.
 *
 * Fonte de verdade ÚNICA, importada tanto pelo formulário (client) quanto pelo
 * route handler (server). Regra de validação não é duplicada em lugar nenhum:
 * se mudar aqui, muda nos dois lados.
 *
 * ⚠️ O SCORING **não** vive neste arquivo — está em `./scoring`, que só o
 * servidor importa. Este módulo vai pro bundle do browser; o critério, não.
 */

export interface Opcao {
  value: string;
  label: string;
}

export const ATUACAO_OPCOES: Opcao[] = [
  { value: "nao_atendo", label: "Ainda não atendo" },
  { value: "casa", label: "Atendo em casa ou home care" },
  { value: "sala_alugada", label: "Alugo sala ou divido espaço" },
  { value: "espaco_proprio", label: "Tenho espaço próprio" },
  { value: "com_equipe", label: "Tenho espaço e equipe" },
];

export const FATURAMENTO_OPCOES: Opcao[] = [
  { value: "ate_3k", label: "Até R$ 3 mil" },
  { value: "3k_8k", label: "Entre R$ 3 e 8 mil" },
  { value: "8k_15k", label: "Entre R$ 8 e 15 mil" },
  { value: "15k_30k", label: "Entre R$ 15 e 30 mil" },
  { value: "acima_30k", label: "Acima de R$ 30 mil" },
];

export const TRAVAMENTO_OPCOES: Opcao[] = [
  { value: "sem_clientes", label: "Não tenho fluxo de clientes" },
  { value: "preco_baixo", label: "Cobro barato e não consigo subir o preço" },
  { value: "muito_trabalho", label: "Trabalho muito e ganho pouco" },
  { value: "nao_sei_vender", label: "Não sei vender" },
  { value: "sem_direcao", label: "Não sei o que fazer primeiro" },
];

export const INVESTIMENTO_OPCOES: Opcao[] = [
  { value: "nunca", label: "Nunca investi" },
  { value: "ate_500", label: "Até R$ 500" },
  { value: "500_2k", label: "Entre R$ 500 e 2 mil" },
  { value: "2k_5k", label: "Entre R$ 2 e 5 mil" },
  { value: "acima_5k", label: "Acima de R$ 5 mil" },
];

export const PRONTIDAO_OPCOES: Opcao[] = [
  { value: "agora", label: "Sim, agora" },
  { value: "30_dias", label: "Sim, em até 30 dias" },
  { value: "depois", label: "Só mais pra frente" },
];

export const CAMPOS = [
  "nome",
  "whatsapp",
  "instagram",
  "atuacao",
  "faturamento",
  "travamento",
  "investimento_previo",
  "prontidao",
  "motivo",
] as const;

export type Campo = (typeof CAMPOS)[number];

export type Aplicacao = Record<Campo, string>;

export const VALORES_INICIAIS: Aplicacao = {
  nome: "",
  whatsapp: "",
  instagram: "",
  atuacao: "",
  faturamento: "",
  travamento: "",
  investimento_previo: "",
  prontidao: "",
  motivo: "",
};

/**
 * As telas do formulário, na ordem — UMA PERGUNTA POR TELA.
 * O `titulo` aparece no indicador de progresso ("Etapa 4 de 9 — Atendimento").
 */
export const TELAS: { titulo: string; campos: Campo[] }[] = [
  { titulo: "Nome", campos: ["nome"] },
  { titulo: "WhatsApp", campos: ["whatsapp"] },
  { titulo: "Instagram", campos: ["instagram"] },
  { titulo: "Atendimento", campos: ["atuacao"] },
  { titulo: "Faturamento", campos: ["faturamento"] },
  { titulo: "O que trava", campos: ["travamento"] },
  { titulo: "Investimento", campos: ["investimento_previo"] },
  { titulo: "Prontidão", campos: ["prontidao"] },
  { titulo: "Por que agora", campos: ["motivo"] },
];

/** Campos de rádio → opções aceitas. Serve de whitelist na validação. */
const OPCOES_POR_CAMPO: Partial<Record<Campo, Opcao[]>> = {
  atuacao: ATUACAO_OPCOES,
  faturamento: FATURAMENTO_OPCOES,
  travamento: TRAVAMENTO_OPCOES,
  investimento_previo: INVESTIMENTO_OPCOES,
  prontidao: PRONTIDAO_OPCOES,
};

export const MOTIVO_MIN = 20;

/** DDDs em uso no Brasil (Anatel). Fora dessa lista, o número é inválido. */
const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function apenasDigitos(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Máscara (00) 00000-0000 — mesma lógica da LP do guia. */
export function mascararWhatsapp(raw: string): string {
  let v = apenasDigitos(raw);
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length <= 2) return v.length ? `(${v}` : "";
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  const corte = v.length === 11 ? 7 : 6;
  return `(${v.slice(0, 2)}) ${v.slice(2, corte)}-${v.slice(corte)}`;
}

/** 11 dígitos, DDD existente e 9º dígito de celular. */
export function whatsappValido(raw: string): boolean {
  const d = apenasDigitos(raw);
  if (d.length !== 11) return false;
  if (!DDDS_VALIDOS.has(Number(d.slice(0, 2)))) return false;
  return d[2] === "9";
}

/**
 * Normaliza o Instagram para `@handle`. Aceita handle puro, com @, ou URL
 * completa colada do perfil (com ou sem protocolo, barra final e query).
 * Entrada irreconhecível volta como veio (trimada) — quem barra é a validação.
 */
export function normalizarInstagram(raw: string): string {
  let v = raw.trim();
  if (!v) return "";

  // Tira protocolo e host, se for URL colada.
  v = v.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  if (/^(m\.)?instagram\.com\//i.test(v)) {
    v = v.replace(/^(m\.)?instagram\.com\//i, "");
  }

  // Corta query string, hash e barra final.
  v = v.split("?")[0].split("#")[0].replace(/\/+$/, "");

  // Sobrou caminho (ex.: handle/reels/xyz)? fica só o primeiro segmento.
  v = v.split("/")[0];

  v = v.replace(/^@+/, "").trim();
  return v ? `@${v}` : "";
}

const HANDLE_RE = /^@[A-Za-z0-9._]{1,30}$/;

export function instagramValido(raw: string): boolean {
  return HANDLE_RE.test(normalizarInstagram(raw));
}

/** Aplica as normalizações finais — é este objeto que vai pro webhook. */
export function normalizarAplicacao(valores: Aplicacao): Aplicacao {
  return {
    ...valores,
    nome: valores.nome.trim().replace(/\s+/g, " "),
    whatsapp: apenasDigitos(valores.whatsapp),
    instagram: normalizarInstagram(valores.instagram),
    motivo: valores.motivo.trim(),
  };
}

export type Erros = Partial<Record<Campo, string>>;

/** Mensagem de erro do campo, ou `null` se estiver válido. */
export function validarCampo(campo: Campo, valores: Aplicacao): string | null {
  const bruto = valores[campo] ?? "";

  const opcoes = OPCOES_POR_CAMPO[campo];
  if (opcoes) {
    if (!bruto) return "Escolha uma opção para continuar.";
    if (!opcoes.some((o) => o.value === bruto)) return "Opção inválida.";
    return null;
  }

  switch (campo) {
    case "nome": {
      const nome = bruto.trim();
      if (!nome) return "Informe seu nome.";
      if (nome.length < 2) return "Informe seu nome completo.";
      return null;
    }
    case "whatsapp": {
      if (!apenasDigitos(bruto)) return "Informe seu WhatsApp.";
      if (!whatsappValido(bruto)) return "Informe um WhatsApp válido com DDD.";
      return null;
    }
    case "instagram": {
      if (!bruto.trim()) return "Informe seu Instagram.";
      if (!instagramValido(bruto))
        return "Informe um @ ou o link do seu perfil.";
      return null;
    }
    case "motivo": {
      const motivo = bruto.trim();
      if (!motivo) return "Conte por que agora.";
      if (motivo.length < MOTIVO_MIN)
        return `Escreva pelo menos ${MOTIVO_MIN} caracteres.`;
      return null;
    }
    default:
      return null;
  }
}

export function validarCampos(campos: readonly Campo[], valores: Aplicacao): Erros {
  const erros: Erros = {};
  for (const campo of campos) {
    const erro = validarCampo(campo, valores);
    if (erro) erros[campo] = erro;
  }
  return erros;
}

/** Valida os nove campos. `{}` = tudo válido. */
export function validarAplicacao(valores: Aplicacao): Erros {
  return validarCampos(CAMPOS, valores);
}
