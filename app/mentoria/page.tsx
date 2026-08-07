/**
 * /mentoria — página de aplicação da Mentoria (R$4.000, profissionais de estética).
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ SUBSTITUIR ANTES DE PUBLICAR — tudo abaixo é copy placeholder, marcada
 *    com [COPY] no arquivo:
 * ════════════════════════════════════════════════════════════════════════════
 *   1. metadata   title, description e OpenGraph desta rota.
 *   2. OG_IMAGE   imagem do OpenGraph (hoje: /images/hero-duda.jpg).
 *   3. HERO       eyebrow, headline (H1), subheadline, texto do CTA e a nota
 *                 logo abaixo dele.
 *   4. APLICACAO  título e texto de abertura do bloco do formulário.
 *   5. Em app/mentoria/AplicacaoForm.tsx: o disclaimer do rodapé do form.
 *      (A mensagem de finalização já é a copy definitiva da Duda.)
 *
 * A página é curta de propósito: hero + formulário. Não classifica ninguém —
 * toda aplicação preenchida vai pra planilha e a triagem é feita pela equipe.
 * Nada depende de banco; o envio é por webhook (MENTORIA_WEBHOOK_URL).
 */

import type { Metadata } from "next";
import Link from "next/link";
import AplicacaoForm from "./AplicacaoForm";
import styles from "./styles.module.css";

/** [COPY] imagem de OpenGraph — trocar por uma arte própria da mentoria. */
const OG_IMAGE = "/images/hero-duda.jpg";

export const metadata: Metadata = {
  // [COPY] metadata da rota
  title: "Mentoria Duda Bambil — Aplicação",
  description:
    "Mentoria para esteticistas que já atendem e querem transformar a operação em negócio: método, precificação e escala. Vagas por aplicação.",
  alternates: { canonical: "/mentoria" },
  openGraph: {
    title: "Mentoria Duda Bambil — Aplicação",
    description:
      "Para esteticistas que já atendem e querem parar de trabalhar muito para ganhar pouco. Preencha a aplicação e a equipe entra em contato.",
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
          {/* [COPY] eyebrow */}
          <div className={styles.eyebrow}>
            PLACEHOLDER — Mentoria para esteticistas com operação rodando
          </div>
          {/* [COPY] headline — máx. 3 linhas no desktop */}
          <h1>
            Você domina a técnica.{" "}
            <em>O que falta é o negócio em volta dela.</em>
          </h1>
          {/* [COPY] subheadline */}
          <p className={styles.lead}>
            PLACEHOLDER — Uma mentoria de acompanhamento próximo para
            esteticistas que já atendem e querem parar de trabalhar muito para
            ganhar pouco. Poucas vagas, todas por aplicação.
          </p>
          <a className={styles.cta} href="#aplicacao">
            {/* [COPY] texto do CTA */}
            Quero me candidatar
          </a>
          {/* [COPY] linha de apoio abaixo do CTA */}
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
            {/* [COPY] título e texto de abertura do bloco do formulário */}
            <h2>PLACEHOLDER — Candidate-se para a próxima turma</h2>
            <p>
              PLACEHOLDER — Explicar que as vagas são limitadas, que a aplicação
              é lida por uma pessoa e o que acontece depois do envio.
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
