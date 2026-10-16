"use client";

/**
 * CheckoutLink — âncora oficial de checkout do site.
 *
 * Existe pra que NENHUMA rota perca a origem: um `<a href={CHECKOUT_URL}>` cru
 * manda a pessoa pra Kiwify sem utm, sem sck e sem evento de pixel. Este
 * componente resolve as três coisas:
 *
 *   1. no mount, troca o href pela URL carimbada com a atribuição — assim
 *      "abrir em nova aba" e "copiar link" também levam a origem;
 *   2. no clique, dispara InitiateCheckout e recarimba a URL com o mesmo
 *      event_id (parâmetro `s2`), pra permitir dedup quando o CAPI entrar;
 *   3. sem JS, o href cru continua funcionando — perde atribuição, não perde
 *      a venda.
 *
 * Clique com modificador (ctrl/cmd/shift/alt) ou botão do meio não é
 * interceptado: o evento é registrado e o href do mount segue seu caminho.
 */

import { useEffect, useState } from "react";
import { buildCheckoutUrl } from "@/utils/checkout";
import { navigateTo } from "@/utils/navigation";
import { trackInitiateCheckout } from "@/utils/pixel";

interface CheckoutLinkProps {
  /** URL do checkout (Kiwify). */
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Nome/slug do produto — vai como content_name no InitiateCheckout. */
  produto?: string;
  /** Onde o clique aconteceu (ex.: "lp-gerenciamento-oferta"). */
  origem?: string;
  target?: string;
  rel?: string;
}

export const CheckoutLink = ({
  href,
  children,
  className,
  produto,
  origem,
  target,
  rel,
}: CheckoutLinkProps) => {
  // SSR e primeiro render usam o href cru: ler localStorage no render causaria
  // mismatch de hidratação.
  const [hrefFinal, setHrefFinal] = useState(href);

  useEffect(() => {
    setHrefFinal(buildCheckoutUrl(href));
  }, [href]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const eventId = trackInitiateCheckout({
      content_name: produto ?? null,
      content_category: origem ?? null,
    });

    // Deixa o browser cuidar de nova aba / nova janela — o href do mount já
    // está carimbado com a atribuição.
    const abreForaDaAba =
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || !!target;
    if (abreForaDaAba || e.defaultPrevented) return;

    e.preventDefault();
    navigateTo(buildCheckoutUrl(href, { eventId }));
  };

  return (
    <a
      href={hrefFinal}
      className={className}
      target={target}
      rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
      onClick={handleClick}
      data-checkout="1"
    >
      {children}
    </a>
  );
};

export default CheckoutLink;
