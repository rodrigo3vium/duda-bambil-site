"use client";

/**
 * BioPage — página principal do Direcionador (page-first).
 * Mostra perfil, ícones sociais, CTA do chat, vitrine de produtos e agendamento.
 * O agente de IA abre como overlay que desliza de baixo (ChatFlow).
 */

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Instagram,
  Youtube,
  Music,
  Mic,
  Linkedin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { bioConfig, type Produto, type LucideIconName } from "@/config/bio.config";
import { useAttribution } from "@/contexts/AttributionProvider";
import { openCheckout } from "@/utils/checkout";
import { submitBioLead } from "@/utils/bioLead";
import { fireBioEvent } from "@/utils/bioEvents";
import { ProductCard } from "./ProductCard";
import { SchedulingSection } from "./SchedulingSection";
import { ChatFlow, type RecoResult } from "./ChatFlow";

const ICON_MAP: Record<LucideIconName, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  spotify: Music,
  mic: Mic,
  globe: Globe,
  linkedin: Linkedin,
};

export const BioPage = () => {
  const config = bioConfig;
  const router = useRouter();
  const attribution = useAttribution();
  const productsRef = useRef<HTMLDivElement>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [reco, setReco] = useState<RecoResult | null>(null);

  const handleCheckout = (produto: Produto) => {
    fireBioEvent({
      event_type: "produto_click",
      step: "page",
      produto_slug: produto.slug,
      lead_id: reco?.leadId ?? null,
    });
    if (produto.checkoutUrl) {
      openCheckout(produto.checkoutUrl, {
        produto: produto.slug,
        origem: "comece-vitrine",
        novaAba: true,
      });
    } else {
      router.push(`/comece/produto/${produto.slug}`);
    }
  };

  const handleDetail = (slug: string) => {
    router.push(`/comece/produto/${slug}`);
  };

  const handleAgendar = async () => {
    fireBioEvent({
      event_type: "agendamento_click",
      step: "page",
      lead_id: reco?.leadId ?? null,
    });

    if (config.agendamento.tipo === "link" && config.agendamento.calendlyUrl) {
      window.open(config.agendamento.calendlyUrl, "_blank");
      return;
    }

    // modo lead: re-submete com intencao='agendar' se já tem dados do chat,
    // senão abre o chat pra coletar o contato primeiro
    if (config.agendamento.tipo === "lead") {
      if (reco?.leadValues) {
        await submitBioLead({
          ...reco.leadValues,
          respostas: {},
          produtoRecomendado: reco.produtoSlug,
          resumo: "",
          attribution,
          leadSourceSlug: config.integracao.leadSourceSlug,
          intencao: "agendar",
        });
      } else {
        setChatOpen(true);
      }
    }
  };

  const handleChatComplete = (result: RecoResult) => {
    setReco(result);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    if (reco) {
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  };

  return (
    <>
      {/* Página principal */}
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 font-sans">
        <div className="mx-auto w-full max-w-[480px] px-5 py-10 flex flex-col gap-8">

          {/* Perfil */}
          <div className="flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.brand.foto}
              alt={config.brand.fotoAlt}
              className="h-24 w-24 rounded-full object-cover border-2 border-accent/40 shadow-md"
            />
            <div className="space-y-1.5">
              <p className="font-serif text-xl font-bold text-primary">
                {config.brand.nome}
              </p>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed max-w-[300px]">
                {config.brand.subtitulo}
              </p>
            </div>
          </div>

          {/* Ícones sociais */}
          {config.canais.itens.length > 0 && (
            <div className="flex justify-center gap-3">
              {config.canais.itens.map((canal) => {
                const Icon = ICON_MAP[canal.icon] ?? Globe;
                return (
                  <a
                    key={canal.id}
                    href={canal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={canal.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground/60 hover:text-primary hover:border-primary/40 transition-all"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          )}

          {/* CTA do chat */}
          <button
            onClick={() => {
              fireBioEvent({ event_type: "chat_open", step: "page_cta" });
              setChatOpen(true);
            }}
            className="w-full flex items-center gap-4 bg-primary text-primary-foreground rounded-2xl px-5 py-4 text-left hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-bold text-[15px] leading-snug">
                {config.brand.headline}
              </p>
              <p className="font-sans text-xs text-primary-foreground/75 mt-0.5">
                {config.brand.ctaInicial}
              </p>
            </div>
            <ArrowRight className="flex-shrink-0 h-5 w-5 opacity-60" />
          </button>

          {/* Produtos */}
          <div ref={productsRef} className="flex flex-col gap-4 scroll-mt-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-center">
              Como posso te ajudar
            </p>
            {reco && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-sm text-center text-secondary font-medium"
              >
                ✦ O melhor pra você está em destaque
              </motion.p>
            )}
            <div className="flex flex-col gap-4">
              {config.produtos.map((produto) => (
                <ProductCard
                  key={produto.slug}
                  produto={produto}
                  highlight={reco?.produtoSlug === produto.slug}
                  onCheckout={handleCheckout}
                  onDetail={handleDetail}
                />
              ))}
            </div>
          </div>

          {/* Agendamento */}
          <SchedulingSection
            agendamento={config.agendamento}
            onAgendar={handleAgendar}
          />
        </div>
      </div>

      {/* Overlay do chat — desliza de baixo */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chat-overlay"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 bg-background"
          >
            <ChatFlow onClose={handleChatClose} onComplete={handleChatComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
