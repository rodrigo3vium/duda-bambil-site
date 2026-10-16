"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Produto } from "@/config/bio.config";

interface ProductCardProps {
  produto: Produto;
  /** card em destaque (recomendação) vs. card de vitrine */
  highlight?: boolean;
  /** clique de compra (checkout) — parent dispara tracking + abre URL */
  onCheckout: (produto: Produto) => void;
  /** abrir página de detalhe */
  onDetail: (slug: string) => void;
}

const defaultCta = "Quero saber mais";

/** Card de produto — reusado no destaque da recomendação e na vitrine. */
export const ProductCard = ({
  produto,
  highlight = false,
  onCheckout,
  onDetail,
}: ProductCardProps) => {
  const temCheckout = Boolean(produto.checkoutUrl);

  return (
    <div
      className={[
        "flex flex-col rounded-2xl border bg-card overflow-hidden h-full",
        highlight
          ? "border-accent/50 shadow-lg"
          : "border-border hover:shadow-md transition-shadow",
      ].join(" ")}
    >
      {produto.imagem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full aspect-[16/9] object-cover"
        />
      )}

      <div className="flex flex-col gap-3 p-6 flex-1">
        {produto.badge && (
          <span className="self-start rounded-full bg-secondary/10 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-secondary">
            {produto.badge}
          </span>
        )}

        <h3 className="font-serif text-xl md:text-2xl font-bold text-primary">
          {produto.nome}
        </h3>

        <p className="font-sans text-sm text-foreground/80 leading-relaxed flex-1">
          {produto.promessa}
        </p>

        {produto.preco && (
          <div className="flex items-baseline gap-2 pt-1">
            {produto.precoDe && (
              <span className="font-sans text-sm text-muted-foreground line-through">
                {produto.precoDe}
              </span>
            )}
            <span className="font-serif text-2xl font-bold text-primary">
              {produto.preco}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {temCheckout ? (
            <Button
              onClick={() => onCheckout(produto)}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold"
            >
              {produto.ctaLabel ?? defaultCta}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => onDetail(produto.slug)}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold"
            >
              {defaultCta}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          <button
            type="button"
            onClick={() => onDetail(produto.slug)}
            className="font-sans text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
