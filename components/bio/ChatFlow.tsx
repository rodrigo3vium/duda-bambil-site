"use client";

/**
 * ChatFlow — agente conversacional do Direcionador.
 * Conversa em streaming com a IA (/api/chat); quando a IA roteia (tool call),
 * coleta o contato num formulário DIGITADO (nunca parseia telefone/e-mail do chat)
 * e grava o lead, então revela o próximo passo (produto profissional → checkout;
 * paciente → agendamento da avaliação com a Duda).
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Send, X, CalendarHeart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAttribution } from "@/contexts/AttributionProvider";
import { openCheckout } from "@/utils/checkout";
import { bioConfig, type Produto } from "@/config/bio.config";
import { findProduto } from "@/utils/bioRouting";
import { submitBioLead } from "@/utils/bioLead";
import { fireBioEvent } from "@/utils/bioEvents";
import { trackLead } from "@/utils/pixel";
import {
  streamChat,
  type ChatMessage,
  type RoutingEvent,
} from "@/utils/bioChat";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { LeadCaptureForm, type LeadFormValues } from "./LeadCaptureForm";
import { Recommendation } from "./Recommendation";

export interface RecoResult {
  produtoSlug: string;
  leadId?: string;
  leadValues: LeadFormValues;
}

type Phase = "chat" | "capture" | "result";

interface ChatFlowProps {
  onClose: () => void;
  onComplete?: (result: RecoResult) => void;
}

export const ChatFlow = ({ onClose, onComplete }: ChatFlowProps) => {
  const config = bioConfig;
  const router = useRouter();
  const attribution = useAttribution();
  const primeiroNomeMarca = config.brand.nome.split(" ")[0];

  const [phase, setPhase] = useState<Phase>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: config.agente.saudacao },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [routing, setRouting] = useState<RoutingEvent | null>(null);
  const [leadValues, setLeadValues] = useState<LeadFormValues | null>(null);

  const pendingRouting = useRef<RoutingEvent | null>(null);
  const streamingRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streamingText, phase]);

  const isEntrada = routing?.tipo === "entrada";
  const routedSlug = routing
    ? isEntrada
      ? (routing.produtoSlug ?? config.agente.entryProductSlugs[0])
      : config.agente.meetingProductSlug
    : config.agente.entryProductSlugs[0];
  const routedProduto: Produto | undefined = findProduto(routedSlug, config.produtos);

  const handleSend = () => {
    const text = input.trim();
    if (!text || streaming || phase !== "chat") return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setStreamingText("");
    streamingRef.current = "";

    void streamChat(next, {
      onText: (delta) => {
        streamingRef.current += delta;
        setStreamingText(streamingRef.current);
      },
      onRouting: (r) => {
        pendingRouting.current = r;
        setRouting(r);
        fireBioEvent({
          event_type: "chat_routing",
          step: "chat",
          produto_slug:
            r.tipo === "entrada" ? (r.produtoSlug ?? null) : config.agente.meetingProductSlug,
          meta: { tipo: r.tipo, motivo: r.motivo },
        });
      },
      onDone: () => {
        const finalText = streamingRef.current;
        streamingRef.current = "";
        setStreaming(false);
        setStreamingText("");
        if (finalText.trim()) {
          setMessages((prev) => [...prev, { role: "assistant", content: finalText }]);
        }
        if (pendingRouting.current) {
          // pequeno respiro pra pessoa ler a última fala antes do formulário
          setTimeout(() => setPhase("capture"), 700);
        }
      },
      onError: (message) => {
        streamingRef.current = "";
        setStreaming(false);
        setStreamingText("");
        setMessages((prev) => [...prev, { role: "assistant", content: message }]);
        fireBioEvent({ event_type: "chat_error", step: "chat", meta: { message } });
      },
    });
  };

  const handleCapture = async (values: LeadFormValues) => {
    const result = await submitBioLead({
      nome: values.nome,
      whatsapp: values.whatsapp,
      email: values.email,
      empresa: values.empresa,
      respostas: {},
      produtoRecomendado: routedSlug,
      resumo: routing?.motivo ?? "",
      attribution,
      leadSourceSlug: config.integracao.leadSourceSlug,
      intencao: isEntrada ? "quiz" : "agendar",
    });

    if (!result.ok) {
      throw new Error(result.error ?? "falha ao gravar lead");
    }

    setLeadValues(values);
    trackLead({ content_name: routedSlug, content_category: "comece-chat" });
    fireBioEvent({
      event_type: "lead_submit",
      step: "chat",
      produto_slug: routedSlug,
      lead_id: result.leadId ?? null,
      meta: { tipo: routing?.tipo, transcript: messages, motivo: routing?.motivo },
    });

    onComplete?.({ produtoSlug: routedSlug, leadId: result.leadId, leadValues: values });
    setPhase("result");
  };

  const handleCheckout = (produto: Produto) => {
    fireBioEvent({ event_type: "produto_click", step: "chat_result", produto_slug: produto.slug });
    if (produto.checkoutUrl) {
      openCheckout(produto.checkoutUrl, {
        produto: produto.slug,
        origem: "comece-chat-resultado",
        novaAba: true,
      });
    } else {
      router.push(`/comece/produto/${produto.slug}`);
    }
  };

  const handleDetail = (slug: string) => router.push(`/comece/produto/${slug}`);

  const primeiroNome = leadValues?.nome.split(" ")[0];

  return (
    <div className="flex h-[100dvh] flex-col bg-background font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.brand.foto}
          alt={config.brand.fotoAlt}
          className="h-9 w-9 rounded-full object-cover border border-accent/40"
        />
        <div className="flex-1 min-w-0">
          <p className="font-serif text-sm font-bold text-primary leading-tight">
            Assistente da {primeiroNomeMarca}
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">online agora</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3">
          {messages.map((m, i) => (
            <ChatBubble
              key={i}
              role={m.role}
              foto={config.brand.foto}
              fotoAlt={config.brand.fotoAlt}
            >
              {m.content}
            </ChatBubble>
          ))}

          {streaming && streamingText && (
            <ChatBubble role="assistant" foto={config.brand.foto} fotoAlt={config.brand.fotoAlt}>
              {streamingText}
            </ChatBubble>
          )}
          {streaming && !streamingText && (
            <TypingIndicator foto={config.brand.foto} fotoAlt={config.brand.fotoAlt} />
          )}

          {/* Captura — formulário digitado (nunca a IA parseando contato) */}
          <AnimatePresence>
            {phase === "capture" && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-2 rounded-2xl border border-accent/40 bg-card p-5"
              >
                <LeadCaptureForm
                  onSubmit={handleCapture}
                  titulo={isEntrada ? "Falta só um passo 💛" : "Vamos marcar sua avaliação?"}
                  descricao={
                    isEntrada
                      ? "Deixa seu contato que eu já te mostro o caminho certo pra você."
                      : `Deixa seu contato que a gente te chama pra marcar sua avaliação de pele com a ${primeiroNomeMarca}.`
                  }
                  ctaLabel={isEntrada ? "Ver meu próximo passo" : "Quero marcar minha avaliação"}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resultado */}
          <AnimatePresence>
            {phase === "result" && routedProduto && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-2"
              >
                {isEntrada ? (
                  <Recommendation
                    produto={routedProduto}
                    closingLine={routing?.motivo ?? ""}
                    nomeLead={primeiroNome}
                    onCheckout={handleCheckout}
                    onDetail={handleDetail}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-6 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
                      <CalendarHeart className="h-6 w-6 text-secondary" />
                    </span>
                    <h3 className="font-serif text-xl font-bold text-primary">
                      {primeiroNome ? `${primeiroNome}, ` : ""}recebido! 💛
                    </h3>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      A gente vai te chamar pra marcar sua avaliação de pele com a{" "}
                      {primeiroNomeMarca}. Você deu o primeiro passo pra cuidar da sua pele
                      com método.
                    </p>
                    {config.agendamento.tipo === "link" && config.agendamento.calendlyUrl && (
                      <Button
                        onClick={() => window.open(config.agendamento.calendlyUrl, "_blank")}
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold"
                      >
                        Falar no WhatsApp agora
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                    <p className="inline-flex items-center gap-1.5 font-sans text-xs text-secondary font-medium">
                      <Check className="h-3.5 w-3.5" />
                      Seu contato já chegou pra gente.
                    </p>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="mt-5 w-full text-center font-sans text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Ver todas as opções
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input — só na fase de conversa */}
      {phase === "chat" && (
        <div className="border-t border-border/40 px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mx-auto flex w-full max-w-[480px] items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Escreve aqui pra ${primeiroNomeMarca}...`}
              disabled={streaming}
              autoFocus
              className="h-11 flex-1 rounded-full bg-card"
            />
            <Button
              type="submit"
              size="icon"
              disabled={streaming || !input.trim()}
              aria-label="Enviar"
              className="h-11 w-11 flex-shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
