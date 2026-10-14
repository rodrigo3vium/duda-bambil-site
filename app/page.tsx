// Home — formato "link-na-bio" (fundo nude com foto desfocada, card de vidro
// pro agendamento e banners empilhados). Aprovada pela Duda em out/2026; nasceu
// como prévia em /v2, que hoje redireciona pra cá (next.config.mjs).
// Título/SEO vêm do layout raiz.

import Image from "next/image";
import { Instagram } from "lucide-react";
import styles from "./home.module.css";

// WhatsApp comercial da Duda Bambil: +55 67 99856-8757
const WHATSAPP_NUMERO = "5567998568757";

const whatsappCom = (mensagem: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;

const LINKS = {
  whatsappAgendamento: whatsappCom("Oi, Duda! Quero agendar um horário."),
  // Ainda não há página dos cursos presenciais: o interesse cai no WhatsApp.
  cursosPresenciais: whatsappCom(
    "Oi, Duda! Quero saber dos cursos presenciais."
  ),
  curso: "/gerenciamento-de-pele",
  limpeza: "/limpeza-de-pele",
  guia: "/guia-skin-care",
  whatsapp: `https://wa.me/${WHATSAPP_NUMERO}`,
  instagram: "https://instagram.com/dudabambill",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Fundo: foto da Duda bem desfocada + véu nude. Como fica desfocada,
          carrega uma versão pequena da imagem (sizes="480px"). */}
      <div className={styles.bg} aria-hidden="true">
        <Image
          src="/images/duda-sobre.jpg"
          alt=""
          fill
          priority
          sizes="480px"
          quality={50}
          className={styles.bgImg}
        />
      </div>

      <main className={styles.column}>
        {/* MARCA */}
        <header className={styles.brand}>
          <div className={styles.mono} aria-hidden="true">
            <span className={styles.monoD}>D</span>
            <span className={styles.monoB}>B</span>
          </div>
          <h1 className={styles.name}>Duda Bambil</h1>
          <p className={styles.role}>Gerenciamento de pele</p>
        </header>

        {/* AGENDAMENTO (paciente) */}
        <a
          href={LINKS.whatsappAgendamento}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.card} ${styles.agendar}`}
        >
          <span className={styles.whatsBadge}>
            <WhatsAppIcon className={styles.whatsIcon} />
          </span>
          <span className={styles.agendarEyebrow}>Para você, paciente</span>
          <span className={styles.agendarTitle}>Agende seu horário</span>
          <span className={styles.pill}>Quero agendar</span>
        </a>

        <p className={styles.groupLabel}>Para profissionais</p>

        {/* CURSO — bloco sólido */}
        <a
          href={LINKS.curso}
          className={`${styles.card} ${styles.banner} ${styles.curso}`}
        >
          <span className={styles.ghost} aria-hidden="true">
            DB
          </span>
          <span className={styles.tabPill}>Curso online</span>
          <span className={styles.cursoKicker}>Método de</span>
          <span className={styles.cursoTitle}>
            Gerenciamento
            <br />
            de Pele
          </span>
          <span className={styles.cursoBy}>Por Duda Bambil</span>
        </a>

        {/* LIMPEZA DE PELE — banner areia com moldura */}
        <a
          href={LINKS.limpeza}
          className={`${styles.card} ${styles.banner} ${styles.limpeza}`}
        >
          <span className={styles.darkPill}>Curso online</span>
          <span className={styles.limpezaTitle}>Limpeza de Pele</span>
          <span className={styles.limpezaSub}>Da anamnese à precificação</span>
        </a>

        {/* CURSOS PRESENCIAIS — banner com foto */}
        <a
          href={LINKS.cursosPresenciais}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.card} ${styles.banner} ${styles.presencial}`}
        >
          <span className={styles.presencialPhoto}>
            <Image
              src="/images/hero-duda.jpg"
              alt=""
              fill
              sizes="(max-width: 560px) 65vw, 340px"
              className={styles.presencialImg}
            />
          </span>
          <span className={styles.presencialText}>
            <span className={styles.darkPill}>Informações</span>
            <span className={styles.presencialTitle}>
              Cursos
              <br />
              presenciais
            </span>
            <span className={styles.presencialSub}>No meu consultório</span>
          </span>
        </a>

        {/* GUIA — banner claro */}
        <a
          href={LINKS.guia}
          className={`${styles.card} ${styles.banner} ${styles.guia}`}
        >
          <span className={styles.rosePill}>Editável no Canva</span>
          <span className={styles.guiaTitle}>Guia de Skincare</span>
          <span className={styles.guiaSub}>Personalizado com a sua marca</span>
        </a>

        {/* RODAPÉ */}
        <footer className={styles.footer}>
          <p className={styles.footerAsk}>
            Não sabe qual caminho é o seu?
            <br />
            Me chama — eu mesma respondo.
          </p>
          <div className={styles.socials}>
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label="Instagram @dudabambill"
            >
              <Instagram className={styles.socialIcon} strokeWidth={1.6} />
            </a>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className={styles.socialIcon} />
            </a>
          </div>
          <p className={styles.tagline}>
            Onde saúde e beleza se completam em equilíbrio.
          </p>
          <p className={styles.copy}>© 2026 Duda Bambil</p>
        </footer>
      </main>
    </div>
  );
}
