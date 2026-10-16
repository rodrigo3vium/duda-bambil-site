/**
 * bio.config.ts — O ATIVO REPLICÁVEL (Direcionador / link-na-bio inteligente)
 * =============================================================================
 * TODO o conteúdo de cliente (marca, agente de IA, produtos, canais) vive AQUI.
 * O core (UI de chat, captura, vitrine) é agnóstico de cliente.
 *
 * ⚠️ Este módulo é importado TANTO pelo client (components/bio) QUANTO pelo
 *    route handler do chat (app/api/chat). Por isso NÃO pode importar assets
 *    nem APIs de browser — `brand.foto` é um path de /public (string).
 *
 * Adaptação DUDA BAMBIL (esteticista, gerenciamento de pele). A IA tem uma única
 * função: entender o momento da pessoa e CAPTURAR O LEAD, encaminhando pro caminho
 * certo — paciente → avaliação; profissional → curso/guia/imersão.
 */

// ─── Tipos (o contrato do template) ──────────────────────────────────────────

export type LucideIconName =
  | "instagram"
  | "youtube"
  | "spotify"
  | "mic"
  | "globe"
  | "linkedin";

export interface Produto {
  slug: string;
  nome: string;
  promessa: string;
  /** rótulo de preço legível. Vazio = ainda não confirmado. */
  preco: string;
  /** preço "de" (riscado), opcional */
  precoDe?: string;
  /** path em /public ou URL. Opcional. */
  imagem?: string;
  /** URL de checkout ou destino. Vazio → card manda pro detalhe ("Quero saber mais"). */
  checkoutUrl: string;
  /** etiqueta curta no card */
  badge?: string;
  /** corpo da página de detalhe — um parágrafo por item */
  detalhe: string[];
  /** bullets "o que você recebe" na página de detalhe (opcional) */
  oQueRecebe?: string[];
  /** rótulo do CTA de compra. Opcional — cai num default. */
  ctaLabel?: string;
}

export interface Canal {
  id: string;
  label: string;
  url: string;
  icon: LucideIconName;
  handle?: string;
}

export interface Agendamento {
  ativo: boolean;
  /** 'link' = abre calendlyUrl/WhatsApp; 'lead' = abre o chat pra capturar */
  tipo: "link" | "lead";
  titulo: string;
  descricao: string;
  ctaLabel: string;
  /** usado quando tipo === 'link' (aqui: link do WhatsApp de agendamento) */
  calendlyUrl?: string;
}

export interface Agente {
  ativo: boolean;
  /** primeira fala da assistente, antes da visitante digitar */
  saudacao: string;
  /**
   * Template do system prompt. Placeholders preenchidos NO SERVIDOR (app/api/chat):
   * {{CATALOGO_DE_PRODUTOS}} {{PRODUTO_DE_ENTRADA}} {{LINK_PRODUTO_DE_ENTRADA}}
   * {{CAMINHO_PACIENTE}}. O cliente nunca vê nem monta o system prompt.
   */
  systemPromptTemplate: string;
  /** slugs que FECHAM no chat (perfil profissional) — enum da tool `recomendar_entrada` */
  entryProductSlugs: string[];
  /** slug do caminho do paciente (avaliação) — tool `encaminhar_reuniao` */
  meetingProductSlug: string;
  /** quem atende (ex.: "Duda") */
  meetingResponsavel: string;
}

export interface BioConfig {
  brand: {
    nome: string;
    headline: string;
    subtitulo: string;
    /** CTA único do topo (abre o chat) */
    ctaInicial: string;
    /** path em /public (string) */
    foto: string;
    fotoAlt: string;
  };
  agente: Agente;
  produtos: Produto[];
  canais: {
    titulo: string;
    itens: Canal[];
  };
  agendamento: Agendamento;
  /** slug/tag da fonte do lead */
  integracao: {
    leadSourceSlug: string;
  };
  flags: {
    /** liga/desliga o agente de IA. Se false, o CTA do chat fica oculto. */
    agenteAtivo: boolean;
  };
}

// ─── System prompt template (voz da assistente da Duda) ──────────────────────
// Função única: acolher, entender o perfil (paciente x profissional) e CAPTURAR
// O LEAD, encaminhando pro caminho certo. A IA não vende agressivo, não coleta
// telefone/e-mail no chat (a interface faz isso) e NÃO dá diagnóstico de pele.

const SYSTEM_PROMPT_TEMPLATE = `Você é a assistente virtual da **Duda Bambil**, esteticista especialista em **gerenciamento de pele**. Você fala na voz da Duda: acolhedora, próxima e profissional — leve, mas com a autoridade de quem entende de pele de verdade. Você **não é a Duda**: você é a assistente dela e fala da Duda na terceira pessoa. Se perguntarem, assuma com naturalidade que é a assistente/IA da Duda.

Sua função é uma só: **entender o momento da pessoa e encaminhá-la pro caminho certo**, deixando o contato dela registrado pra Duda dar sequência. Você **não vende de forma agressiva** e **não pede telefone/e-mail no chat** — a interface cuida disso depois que você encaminha.

## Quem chega até aqui (descubra com naturalidade)
Existem dois perfis. Sua primeira missão é identificar qual é, com uma pergunta leve:
- **PACIENTE** — quer cuidar da própria pele (acne, manchas, oleosidade, sensibilidade, envelhecimento, "minha pele não melhora"). O caminho dela é uma **avaliação de pele com a Duda**.
- **PROFISSIONAL** — é esteticista, biomédica, farmacêutica, enfermeira, dentista ou estudante da área, e quer **aprender gerenciamento de pele, cobrar mais e lotar a agenda**. O caminho dela é um dos materiais/formações da Duda.

## Voz e tom
- Acolha primeiro, sempre. Uma pessoa por vez, uma pergunta por vez. Reaja ao que ela disse antes de seguir.
- Mensagens curtas, estilo DM/WhatsApp. Uma ideia por mensagem. Nada corporativo, nada de robô, nada de script duro.
- Calor com elegância — "que bom te ver por aqui", "vou te ajudar com isso". Emoji com muita parcimônia (💛 de vez em quando, no máximo).
- Nunca pressione, nunca crie falsa urgência, nunca envergonhe ninguém. Nunca pergunte renda nem orçamento.

## Fluxo (sempre conversando)
1. **Abertura + descobrir o perfil.** Descubra se é paciente (cuidar da própria pele) ou profissional (evoluir no atendimento). Se já veio claro na 1ª mensagem, não repita a pergunta.
2. **Entender o momento (1 a 2 perguntas, no máximo).**
   - Paciente: qual a principal queixa/objetivo com a pele? Há quanto tempo incomoda?
   - Profissional: qual sua atuação hoje e o que mais te trava (cobrar pouco, agenda vazia, não fidelizar, insegurança técnica, tá começando)?
3. **Encaminhar + capturar.** Quando entender o suficiente, mande UMA última mensagem calorosa preparando a indicação e **chame a ferramenta certa**. A interface abre o formulário de contato e mostra o próximo passo.

## Catálogo
{{CATALOGO_DE_PRODUTOS}}

Produto de entrada principal (profissional): {{PRODUTO_DE_ENTRADA}} ({{LINK_PRODUTO_DE_ENTRADA}}).
Caminho do paciente: {{CAMINHO_PACIENTE}}.

## Roteamento (a decisão)
- **PACIENTE** (quer cuidar da própria pele): acolha a queixa com carinho e **chame \`encaminhar_reuniao\`** — a Duda faz a avaliação de pele e monta o plano de tratamento. Não recomende curso nem guia pra paciente.
- **PROFISSIONAL** (quer evoluir no atendimento): recomende o material certo e **chame \`recomendar_entrada\`** com o slug:
   - Tá começando / quer entender o método antes de investir → **guia-primeiros-passos** (material gratuito).
   - Quer uma ferramenta pronta pra prescrever home care com a própria marca → **guia-editavel**.
   - Quer o método completo pra parar de vender sessão avulsa e passar a cobrar protocolo → **curso-gerenciamento**.
   - Quer ver o gerenciamento de pele na prática, presencial, no consultório da Duda → **imersao-wonderskin**.
  Ao recomendar, retome 1 ou 2 coisas que a pessoa contou.

## Ferramentas (como você age — MUITO IMPORTANTE)
- Você **NÃO escreve links, NÃO fala preços de checkout e NÃO pede telefone/e-mail no chat.** Depois que você chama a ferramenta, a interface mostra o formulário de contato e o próximo passo (checkout ou agendamento).
- Chame a ferramenta (\`recomendar_entrada\` ou \`encaminhar_reuniao\`) com um \`motivo\` curto e caloroso que retome o que a pessoa contou. Só chame depois de acolher e entender — nunca cedo demais.
- Antes de chamar, mande uma última mensagem preparando a indicação. A ferramenta encerra a conversa.

## Guardrails
- Use só os produtos, preços e caminhos do catálogo acima. Não invente nada.
- **Nunca dê diagnóstico nem prescrição.** Você não avalia a pele por aqui — quem faz isso é a Duda, na avaliação. Se a pessoa descrever um problema de pele, acolha e encaminhe pra avaliação; não receite ativo, produto nem procedimento.
- Não prometa resultado garantido. Não pressione, não crie urgência mentirosa, nunca fale de dinheiro de forma constrangedora.
- Se a pessoa só quer uma informação simples, responda com gentileza e ofereça o caminho.
- Mantenha sempre a voz da Duda: acolhedora, próxima, profissional.`;

// ─── Config do cliente (Duda Bambil) ─────────────────────────────────────────

export const bioConfig: BioConfig = {
  brand: {
    nome: "Duda Bambil",
    headline: "Vamos descobrir o seu próximo passo?",
    subtitulo:
      "Bate um papo rápido comigo, a assistente da Duda, e eu te indico o caminho certo — pra cuidar da sua pele ou pra evoluir no seu atendimento.",
    ctaInicial: "Conversar com a assistente da Duda",
    foto: "/images/duda-bambil.jpg",
    fotoAlt: "Duda Bambil",
  },

  agente: {
    ativo: true,
    saudacao:
      "Oi! Que bom te ver por aqui 💛 Eu sou a assistente da Duda. Pra eu te ajudar do jeito certo, me conta rapidinho: você tá buscando cuidar da sua própria pele, ou é profissional da estética querendo evoluir no atendimento?",
    systemPromptTemplate: SYSTEM_PROMPT_TEMPLATE,
    // profissional → fecha no chat (revela checkout/próximo passo)
    entryProductSlugs: [
      "curso-gerenciamento",
      "guia-editavel",
      "guia-primeiros-passos",
      "imersao-wonderskin",
    ],
    // paciente → avaliação de pele com a Duda
    meetingProductSlug: "avaliacao",
    meetingResponsavel: "Duda",
  },

  produtos: [
    {
      slug: "avaliacao",
      nome: "Avaliação de Gerenciamento de Pele",
      promessa:
        "Diagnóstico completo da sua pele, skincare assertivo e um plano de tratamento estruturado — feito pra você, com método.",
      preco: "",
      // Sem checkout: o caminho é o agendamento (WhatsApp). Ver `agendamento` abaixo.
      checkoutUrl: "",
      badge: "Para você, paciente",
      ctaLabel: "Agendar avaliação",
      detalhe: [
        "A avaliação é o primeiro passo do gerenciamento de pele: a Duda analisa a sua pele de perto, entende seu histórico e seus objetivos, e monta um plano de tratamento estruturado — não uma sessão solta, mas um caminho.",
        "É pra quem quer parar de tentar produto por conta própria e passar a cuidar da pele com diagnóstico, skincare assertivo e acompanhamento profissional.",
      ],
      oQueRecebe: [
        "Diagnóstico profissional da sua pele.",
        "Plano de tratamento estruturado (não sessão avulsa).",
        "Orientação de home care assertiva pra sua pele.",
      ],
    },
    {
      slug: "curso-gerenciamento",
      nome: "Curso de Gerenciamento de Pele",
      promessa:
        "O método completo pra parar de vender sessão avulsa e passar a vender plano de tratamento de R$1.500 a R$4.000. 7 módulos + biblioteca de protocolos.",
      preco: "R$297",
      checkoutUrl: "https://pay.kiwify.com.br/IKV1kqf",
      badge: "Para você, profissional",
      ctaLabel: "Quero meu acesso",
      detalhe: [
        "O Curso de Gerenciamento de Pele é o método completo da Duda: 7 módulos que vão do diagnóstico e construção de protocolo à precificação, fidelização, posicionamento e gestão do consultório.",
        "É pra esteticista, biomédica, farmacêutica, enfermeira ou dentista que já atende com estética básica e quer parar de competir por preço, cobrar protocolo de ticket alto e ser procurada como especialista.",
      ],
      oQueRecebe: [
        "7 módulos com o método completo.",
        "Biblioteca de 8 protocolos práticos em vídeo.",
        "Modelos de plano de tratamento (4, 8 e 12 semanas).",
        "Scripts de WhatsApp e estrutura de precificação prontos.",
        "Acesso vitalício e atualizações inclusas.",
      ],
    },
    {
      slug: "guia-editavel",
      nome: "Guia Editável de Skincare",
      promessa:
        "O guia editável no Canva que você personaliza com a sua marca, salva em PDF e entrega pra paciente. Pronto pra usar amanhã.",
      preco: "R$47",
      precoDe: "R$97",
      checkoutUrl: "https://pay.kiwify.com.br/PeL4M7p",
      badge: "Para você, profissional",
      ctaLabel: "Quero meu guia",
      detalhe: [
        "O Guia Editável de Skincare é um modelo profissional já estruturado: você abre no Canva, troca o logo, ajusta as recomendações pra cada paciente, salva em PDF e entrega. Em 5 minutos.",
        "Cobre os 4 tipos de pele (oleosa, seca, mista, sensível) com orientações por estado de pele — o material que padroniza sua prescrição de home care e valoriza o seu atendimento.",
      ],
      oQueRecebe: [
        "Template editável completo no Canva.",
        "4 versões por tipo de pele.",
        "Orientações por estado da pele (acne, manchas, envelhecimento).",
        "Páginas modulares pra personalização rápida.",
        "Acesso imediato + atualizações inclusas.",
      ],
    },
    {
      slug: "guia-primeiros-passos",
      nome: "Guia Primeiros Passos",
      promessa:
        "O material gratuito pra quem tá começando no gerenciamento de pele. 22 páginas, do diagnóstico ao conteúdo.",
      preco: "Gratuito",
      // LP interna com o formulário de download (lead magnet já existente no site).
      checkoutUrl: "/guia-primeiros-passos",
      badge: "Material gratuito",
      ctaLabel: "Quero o guia gratuito",
      detalhe: [
        "O Guia Primeiros Passos é o ponto de partida no gerenciamento de pele — 22 páginas com os fundamentos práticos: linguagem profissional, rotina de cuidados, hidratação, tipos de pele, mapa da acne e limpeza de pele.",
        "É o material gratuito pra profissional que tá começando e quer entender o método antes de dar o próximo passo.",
      ],
      oQueRecebe: [
        "22 páginas em PDF, com acesso imediato.",
        "Os fundamentos do gerenciamento de pele, do diagnóstico ao conteúdo.",
      ],
    },
    {
      slug: "imersao-wonderskin",
      nome: "Imersão Wonderskin",
      promessa:
        "Um dia de bastidores no consultório da Duda, aplicando gerenciamento de pele na prática, ao vivo.",
      preco: "",
      // TODO: WONDERSKIN_LINK — página/checkout da imersão (ainda não definido).
      checkoutUrl: "",
      badge: "Imersão presencial",
      ctaLabel: "Quero saber da imersão",
      detalhe: [
        "A Imersão Wonderskin é um dia de bastidores no consultório da Duda: você vê o gerenciamento de pele acontecendo na prática, do diagnóstico à condução do atendimento, ao vivo.",
        "É pra profissional que já estudou o método e quer ver de perto como ele funciona no dia a dia de um consultório de ticket alto.",
      ],
      oQueRecebe: [
        "Um dia presencial no consultório da Duda.",
        "Gerenciamento de pele aplicado na prática, ao vivo.",
      ],
    },
  ],

  canais: {
    titulo: "Onde mais a gente se encontra",
    itens: [
      {
        id: "instagram",
        label: "Instagram",
        url: "https://instagram.com/dudabambill",
        icon: "instagram",
        handle: "@dudabambill",
      },
    ],
  },

  agendamento: {
    ativo: true,
    // 'lead' por enquanto: abre o chat pra capturar o contato do paciente.
    // O link do WhatsApp já está preenchido abaixo — trocar `tipo` para 'link'
    // faz o bloco mandar o paciente direto pro WhatsApp, sem capturar o lead.
    tipo: "lead",
    titulo: "Prefere falar direto?",
    descricao:
      "Se você já quer cuidar da sua pele, deixa seu contato que a gente marca sua avaliação com a Duda.",
    ctaLabel: "Quero agendar minha avaliação",
    // WhatsApp comercial da Duda Bambil: +55 67 99856-8757
    calendlyUrl:
      "https://wa.me/5567998568757?text=Oi%2C%20Duda!%20Quero%20agendar%20minha%20avalia%C3%A7%C3%A3o%20de%20pele.",
  },

  integracao: {
    leadSourceSlug: "comece-bio",
  },

  flags: {
    agenteAtivo: true,
  },
};
