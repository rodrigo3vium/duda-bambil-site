"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  foto?: string;
  fotoAlt?: string;
}

/** Três pontinhos pulsando — "a Duda está digitando". */
export const TypingIndicator = ({ foto, fotoAlt }: TypingIndicatorProps) => (
  <div className="flex items-end gap-2 justify-start">
    {foto && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={foto}
        alt={fotoAlt ?? ""}
        className="h-7 w-7 flex-shrink-0 rounded-full object-cover border border-accent/40"
      />
    )}
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/60"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  </div>
);
