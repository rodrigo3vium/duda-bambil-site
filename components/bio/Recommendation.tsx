"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Produto } from "@/config/bio.config";
import { ProductCard } from "./ProductCard";

interface RecommendationProps {
  produto: Produto;
  /** frase de fechamento (motivo caloroso vindo da IA) */
  closingLine: string;
  nomeLead?: string;
  onCheckout: (produto: Produto) => void;
  onDetail: (slug: string) => void;
}

/** Destaque do produto recomendado + frase de fechamento personalizada. */
export const Recommendation = ({
  produto,
  closingLine,
  nomeLead,
  onCheckout,
  onDetail,
}: RecommendationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          Seu próximo passo
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary leading-snug">
          {nomeLead ? `${nomeLead}, ` : ""}
          encontrei o caminho certo pra você
        </h2>
        <p className="font-sans text-base text-foreground/80 leading-relaxed max-w-md mx-auto">
          {closingLine}
        </p>
      </div>

      <ProductCard
        produto={produto}
        highlight
        onCheckout={onCheckout}
        onDetail={onDetail}
      />
    </motion.div>
  );
};
