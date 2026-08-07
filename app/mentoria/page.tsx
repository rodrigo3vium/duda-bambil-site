/**
 * /mentoria — página de aplicação da Mentoria individual da Duda.
 *
 * A página é curta de propósito: hero + formulário. Não classifica ninguém —
 * toda aplicação preenchida vai pra planilha e a triagem é feita pela equipe.
 * Nada depende de banco; o envio é por webhook (MENTORIA_WEBHOOK_URL).
 *
 * ⚠️ É mentoria INDIVIDUAL — não usar "turma" na copy.
 * ⚠️ O número de vagas (4) aparece na abertura do formulário. Se mudar, é aqui
 *    e mais nenhum lugar.
 */

import type { Metadata } from "next";
import Link from "next/link";
import AplicacaoForm from "./AplicacaoForm";
import styles from "./styles.module.css";

/** Foto da Duda usada como imagem de compartilhamento. */
const OG_IMAGE = "/images/hero-duda.jpg";

/** Quantas vagas estão abertas. Único lugar onde esse número vive. */
const VAGAS = 4;

export const metadata: Metadata = {
  title: "Mentoria Duda Bambil — Aplicação",
  description:
    "Mentoria individual para esteticistas que já atendem e querem transformar a operação em negócio. Apenas 4 vagas — o acesso é por aplicação.",
  alternates: { canonical: "/mentoria" },
  openGraph: {
    title: "Mentoria Duda Bambil — Aplicação",
    description:
      "Para esteticistas que já atendem e querem parar de trabalhar muito para ganhar pouco. Apenas 4 vagas: preencha a aplicação e a equipe entra em contato.",
    url: "/mentoria",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Duda Bambil" }],
  },
};

export default function MentoriaPage() {
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              Duda Bambil
            </Link>
          </div>
        </div>
      </header>

      {/* 1 — HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            Mentoria individual para esteticistas que já atendem
          </div>
          {/* Headline dimensionada para caber em no máximo 3 linhas no desktop. */}
          <h1>
            Você domina a técnica.{" "}
            <em>O que falta é o negócio em volta dela.</em>
          </h1>
          <p className={styles.lead}>
            Acompanhamento individual e próximo, da Duda para você, se você já
            atende e cansou de trabalhar muito para ganhar pouco. Não é curso
            nem turma: é a sua operação, olhada de perto.
          </p>
          <a className={styles.cta} href="#aplicacao">
            Quero me candidatar
          </a>
          <p className={styles.heroNota}>
            Leva 3 minutos. A Duda lê cada aplicação.
          </p>
        </div>
      </section>

      {/* 2 — APLICAÇÃO */}
      <section className={styles.secaoForm} id="aplicacao">
        <div className={styles.containerSm}>
          <div className={styles.formIntro}>
            <div className={styles.eyebrow}>Aplicação</div>
            <h2>Apenas {VAGAS} vagas disponíveis.</h2>
            <p>
              Como o acompanhamento é individual, a Duda consegue atender pouca
              gente por vez. Por isso a entrada é por aplicação: são {VAGAS}{" "}
              vagas abertas agora.
            </p>
            <p>
              Nenhuma resposta aqui é lida por robô. A Duda lê cada aplicação
              uma por uma e, se fizer sentido para as duas, alguém da equipe
              chama você no WhatsApp para marcar uma call com ela.
            </p>
          </div>
          <AplicacaoForm />
        </div>
      </section>

      <footer className={styles.rodape}>
        <div className={styles.container}>
          <p>© Duda Bambil — Gerenciamento de Pele</p>
        </div>
      </footer>
    </div>
  );
}
