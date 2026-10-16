/**
 * Botões de WhatsApp do site — o MAPA de qual mensagem pronta sai de qual botão.
 *
 * Por que cada botão tem a sua mensagem: quando a conversa chega no WhatsApp
 * da Duda, o texto pronto é a única coisa que diz de onde a pessoa veio. Se
 * dois botões mandam o mesmo texto, a equipe não sabe qual funcionou. Por isso:
 *
 *   1. toda mensagem começa com "Oi, Duda! Vim pelo seu site e…" — separa quem
 *      veio do site de quem escreveu do zero;
 *   2. o resto da frase é exclusivo do botão (o teste em
 *      tests/whatsapp/ garante que nenhuma se repete).
 *
 * A tabela legível pra equipe (mensagem → botão) está em docs/whatsapp-botoes.md.
 * Mudou uma mensagem aqui? Atualize a tabela lá.
 *
 * Todo clique também vira evento (ver `registrarCliqueWhatsapp`): Contact no
 * Meta Pixel e evento no Clarity, com a origem (utm) da pessoa.
 *
 * Regra do repo: nenhum `wa.me` escrito à mão em app/ ou components/ — link de
 * WhatsApp sai só por <WhatsAppLink botao="…"> (components/WhatsAppLink.tsx).
 */

import { ensureAttributionInitialized } from "@/lib/attribution";
import { clarityEvent, claritySet, clarityUpgrade } from "@/utils/clarity";
import { trackContact } from "@/utils/pixel";

/** WhatsApp comercial da Duda Bambil: +55 67 99856-8757 */
export const WHATSAPP_NUMERO = "5567998568757";

export interface BotaoWhatsapp {
  /** onde o botão está, em português de gente — vai pra documentação */
  onde: string;
  /** texto que já aparece digitado quando o WhatsApp abre */
  mensagem: string;
}

export const BOTOES_WHATSAPP = {
  "home-agendar": {
    onde: 'Home — card "Agende seu horário" (paciente)',
    mensagem: "Oi, Duda! Vim pelo seu site e quero agendar um horário.",
  },
  "home-cursos-presenciais": {
    onde: 'Home — banner "Cursos presenciais"',
    mensagem: "Oi, Duda! Vim pelo seu site e quero saber dos cursos presenciais.",
  },
  "home-rodape": {
    onde: 'Home — ícone do WhatsApp no rodapé ("Não sabe qual caminho é o seu?")',
    mensagem:
      "Oi, Duda! Vim pelo seu site e fiquei na dúvida de qual caminho é o meu.",
  },
} as const satisfies Record<string, BotaoWhatsapp>;

export type BotaoWhatsappId = keyof typeof BOTOES_WHATSAPP;

/** URL do wa.me com a mensagem pronta daquele botão. */
export function whatsappUrl(botao: BotaoWhatsappId): string {
  const { mensagem } = BOTOES_WHATSAPP[botao];
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Registra o clique: Contact no pixel (com a origem do last touch) e, no
 * Clarity, um evento geral + um do botão + a tag `whatsapp_botao`.
 * Devolve o event_id do Contact. Nunca lança.
 */
export function registrarCliqueWhatsapp(botao: BotaoWhatsappId): string {
  const last = ensureAttributionInitialized().last_touch;

  const eventId = trackContact({
    content_name: botao,
    content_category: "whatsapp",
    utm_source: last?.utm_source,
    utm_medium: last?.utm_medium,
    utm_campaign: last?.utm_campaign,
    utm_content: last?.utm_content,
  });

  clarityEvent("whatsapp_click");
  clarityEvent(`whatsapp_${botao.replace(/-/g, "_")}`);
  claritySet("whatsapp_botao", botao);
  clarityUpgrade("whatsapp_click");

  return eventId;
}
