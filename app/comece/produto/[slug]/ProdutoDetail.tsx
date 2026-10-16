"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCheckout } from "@/utils/checkout";
import { bioConfig } from "@/config/bio.config";
import { findProduto } from "@/utils/bioRouting";
import { fireBioEvent } from "@/utils/bioEvents";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/** /comece/produto/[slug] — página de detalhe de um produto/caminho do catálogo. */
export const ProdutoDetail = ({ slug }: { slug: string }) => {
  const produto = findProduto(slug, bioConfig.produtos);

  useEffect(() => {
    if (produto) {
      fireBioEvent({
        event_type: "step_view",
        step: "produto_detalhe",
        produto_slug: produto.slug,
      });
    }
  }, [produto]);

  if (!produto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6 text-center font-sans">
        <p className="font-serif text-2xl text-primary">Produto não encontrado</p>
        <Link
          href="/comece"
          className="rounded-full bg-primary px-6 py-2.5 font-sans font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    fireBioEvent({
      event_type: "produto_click",
      step: "produto_detalhe",
      produto_slug: produto.slug,
    });
    if (produto.checkoutUrl) {
      openCheckout(produto.checkoutUrl, {
        produto: produto.slug,
        origem: "comece-produto-detalhe",
        novaAba: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 font-sans">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 flex flex-col gap-8">
        <Link
          href="/comece"
          className="inline-flex items-center gap-1 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-5"
        >
          {produto.badge && (
            <span className="self-start rounded-full bg-secondary/10 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-secondary">
              {produto.badge}
            </span>
          )}

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary leading-tight">
            {produto.nome}
          </h1>

          <p className="font-sans text-lg text-foreground/80 leading-relaxed">
            {produto.promessa}
          </p>

          {produto.imagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full rounded-2xl object-cover"
            />
          )}
        </motion.div>

        <div className="flex flex-col gap-5 text-foreground/80 leading-relaxed">
          {produto.detalhe.map((paragrafo, i) => (
            <p key={i} className="font-sans text-base">
              {paragrafo}
            </p>
          ))}
        </div>

        {produto.oQueRecebe && produto.oQueRecebe.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-primary">
              O que você recebe
            </h2>
            <ul className="flex flex-col gap-2">
              {produto.oQueRecebe.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-base text-foreground/80">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-secondary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-accent/40 bg-card p-8 text-center">
          {produto.preco ? (
            <div className="flex items-baseline gap-2">
              {produto.precoDe && (
                <span className="font-sans text-base text-muted-foreground line-through">
                  {produto.precoDe}
                </span>
              )}
              <span className="font-serif text-4xl font-bold text-primary">
                {produto.preco}
              </span>
            </div>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              Investimento sob consulta
            </p>
          )}

          {produto.checkoutUrl ? (
            <Button
              size="lg"
              onClick={handleCheckout}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold h-12"
            >
              {produto.ctaLabel ?? "Quero saber mais"}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              Em breve por aqui. Volte ao início pra falar com a gente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
