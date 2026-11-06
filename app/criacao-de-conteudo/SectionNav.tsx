"use client";

/**
 * Índice das seções + barra de progresso de leitura.
 *
 * Página longa (10 blocos) precisa de mapa: o índice fica no cabeçalho fixo,
 * marca a seção em que a pessoa está e rola na horizontal no celular. A barra
 * de 2px no topo mostra quanto falta.
 */

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface SecaoNav {
  /** id da <section> na página */
  id: string;
  /** texto do link no índice */
  label: string;
}

/** Distância do topo (px) a partir da qual uma seção conta como "atual". */
const LINHA_ATIVA = 140;

export function SectionNav({ secoes }: { secoes: SecaoNav[] }) {
  const [atual, setAtual] = useState<string | null>(null);
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let agendado = false;

    const atualizar = () => {
      agendado = false;

      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (barra.current) {
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        barra.current.style.width = `${pct}%`;
      }

      let corrente: string | null = null;
      for (const { id } of secoes) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= LINHA_ATIVA) corrente = id;
      }
      setAtual(corrente);
    };

    const agendar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [secoes]);

  return (
    <>
      <div ref={barra} className={styles.progresso} aria-hidden="true" />
      <nav className={styles.nav} aria-label="Seções da página">
        {secoes.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={atual === id ? styles.navAtivo : undefined}
            aria-current={atual === id ? "location" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}
