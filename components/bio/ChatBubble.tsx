"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  role: "user" | "assistant";
  /** avatar da assistente (path em /public) — só usado em mensagens dela */
  foto?: string;
  fotoAlt?: string;
  children: React.ReactNode;
}

/** Bolha de mensagem estilo DM. Assistente à esquerda (com avatar), pessoa à direita. */
export const ChatBubble = ({ role, foto, fotoAlt, children }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && foto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={foto}
          alt={fotoAlt ?? ""}
          className="h-7 w-7 flex-shrink-0 rounded-full object-cover border border-accent/40"
        />
      )}
      <div
        className={[
          "max-w-[78%] rounded-2xl px-4 py-2.5 font-sans text-[15px] leading-relaxed whitespace-pre-wrap",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground border border-border",
        ].join(" ")}
      >
        {children}
      </div>
    </motion.div>
  );
};
