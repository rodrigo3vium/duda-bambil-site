"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { normalizeWhatsapp } from "@/utils/whatsapp";

export interface LeadFormValues {
  nome: string;
  whatsapp: string;
  email: string;
  /** honeypot — humano deixa vazio */
  empresa: string;
}

interface LeadCaptureFormProps {
  /** chamado com os valores válidos; resolve quando a gravação termina */
  onSubmit: (values: LeadFormValues) => Promise<void>;
  titulo?: string;
  descricao?: string;
  ctaLabel?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Captura do contato — acontece ANTES de revelar a recomendação.
 * Inclui o campo honeypot oculto `empresa` (anti-spam): o servidor descarta
 * silenciosamente quando ele vem preenchido.
 */
export const LeadCaptureForm = ({
  onSubmit,
  titulo = "Falta só um passo",
  descricao = "Deixa seu contato que eu já te mostro o caminho certo pra você.",
  ctaLabel = "Ver meu próximo passo",
}: LeadCaptureFormProps) => {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!nome.trim() || !whatsapp.trim() || !email.trim()) {
      setErro("Preenche nome, WhatsApp e e-mail pra continuar.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErro("Confere o e-mail que você digitou.");
      return;
    }
    const wpp = normalizeWhatsapp(whatsapp);
    if (!wpp.ok) {
      setErro("Coloca o número com DDD (ex.: 11 99999-9999).");
      return;
    }

    setErro(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ nome, whatsapp, email, empresa });
    } catch (error) {
      console.error("[bio] erro ao gravar lead:", error);
      setErro("Ops, deu um problema. Tenta de novo em instantes, por favor.");
      setIsSubmitting(false);
    }
    // sucesso: o fluxo (ChatFlow) troca de tela; não reseta isSubmitting de propósito.
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary leading-snug">
          {titulo}
        </h2>
        <p className="font-sans text-base text-foreground/80 leading-relaxed">
          {descricao}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoComplete="name"
          className="h-12 rounded-xl bg-card"
        />
        <Input
          type="tel"
          placeholder="Seu WhatsApp (com DDD)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          autoComplete="tel"
          className="h-12 rounded-xl bg-card"
        />
        <Input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="h-12 rounded-xl bg-card"
        />

        {/* honeypot — escondido de humanos; bot tende a preencher */}
        <input
          type="text"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="hidden"
        />

        {erro && (
          <p className="font-sans text-sm text-destructive" role="alert">
            {erro}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-1 w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold"
        >
          {isSubmitting ? (
            "Preparando..."
          ) : (
            <>
              {ctaLabel}
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </Button>
      </form>

      <p className="inline-flex items-center justify-center gap-1.5 font-sans text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        Seus dados estão seguros. Sem spam.
      </p>
    </motion.div>
  );
};
