"use client";

import { useState } from "react";
import { CalendarHeart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agendamento } from "@/config/bio.config";

interface SchedulingSectionProps {
  agendamento: Agendamento;
  /**
   * Disparado ao clicar em agendar. O parent registra o evento e, no modo
   * 'lead', abre o chat/captura; no modo 'link', abre a calendlyUrl.
   */
  onAgendar: () => Promise<void> | void;
}

/** Bloco de agendamento — link direto OU captura via chat. */
export const SchedulingSection = ({
  agendamento,
  onAgendar,
}: SchedulingSectionProps) => {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  if (!agendamento.ativo) return null;

  const isLinkMode = agendamento.tipo === "link" && Boolean(agendamento.calendlyUrl);

  const handleClick = async () => {
    if (enviando || enviado) return;
    setEnviando(true);
    try {
      await onAgendar();
      if (!isLinkMode) setEnviado(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6 flex flex-col gap-3 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10">
        <CalendarHeart className="h-5 w-5 text-secondary" />
      </span>
      <h3 className="font-serif text-xl font-bold text-primary">
        {agendamento.titulo}
      </h3>
      <p className="font-sans text-sm text-foreground/80 leading-relaxed">
        {agendamento.descricao}
      </p>

      {enviado ? (
        <p className="inline-flex items-center justify-center gap-1.5 font-sans text-sm font-semibold text-secondary">
          <Check className="h-4 w-4" />
          Recebido! Em breve a gente te chama.
        </p>
      ) : (
        <Button
          onClick={handleClick}
          disabled={enviando}
          className="mx-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold"
        >
          {enviando ? "Enviando..." : agendamento.ctaLabel}
        </Button>
      )}
    </section>
  );
};
