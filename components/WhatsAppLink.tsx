"use client";

/**
 * WhatsAppLink — âncora oficial de WhatsApp do site.
 *
 * Um link cru pro WhatsApp escrito à mão abre a conversa sem dizer de qual
 * botão a pessoa veio e sem evento nenhum. Este componente resolve as duas
 * coisas:
 *
 *   1. o href leva a mensagem pronta EXCLUSIVA do botão (utils/whatsappBotoes.ts)
 *      — é por ela que a equipe da Duda reconhece a origem na conversa;
 *   2. no clique, dispara Contact no Meta Pixel e o evento no Clarity.
 *
 * O href é estático (não depende de storage), então SSR e hidratação batem e,
 * sem JS, o link continua abrindo o WhatsApp — perde o evento, não perde a
 * conversa. Abre sempre em nova aba, então o evento tem tempo de sair.
 */

import {
  registrarCliqueWhatsapp,
  whatsappUrl,
  type BotaoWhatsappId,
} from "@/utils/whatsappBotoes";

interface WhatsAppLinkProps {
  /** Qual botão é este — define a mensagem pronta e o nome do evento. */
  botao: BotaoWhatsappId;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export const WhatsAppLink = ({
  botao,
  children,
  className,
  "aria-label": ariaLabel,
}: WhatsAppLinkProps) => (
  <a
    href={whatsappUrl(botao)}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    aria-label={ariaLabel}
    onClick={() => registrarCliqueWhatsapp(botao)}
    data-whatsapp={botao}
  >
    {children}
  </a>
);

export default WhatsAppLink;
