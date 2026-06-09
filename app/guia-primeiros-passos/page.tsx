import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './styles.module.css';
import LeadForm from './LeadForm';

export const metadata: Metadata = {
  title: 'Guia Primeiros Passos — Material gratuito · Duda Bambil',
  description:
    'Guia gratuito para profissionais da estética que querem dominar o gerenciamento de pele. Por Duda Bambil.',
  openGraph: {
    title: 'Guia Primeiros Passos para Profissionais — Duda Bambil',
    description: 'Material gratuito para profissionais da estética.',
    type: 'website',
  },
};

const CONTEUDO_ITEMS = [
  {
    num: '01',
    title: 'Linguagem profissional',
    text: 'Como explicar o processo da pele sem afastar o paciente. Clareza gera conversão.',
  },
  {
    num: '02',
    title: 'Rotina de cuidados',
    text: 'A sequência correta de skincare e a ordem de prioridade de compra para o paciente.',
  },
  {
    num: '03',
    title: 'Hidratação na prática',
    text: 'O equilíbrio do manto hidrolipídico e por que toda pele precisa de hidratação.',
  },
  {
    num: '04',
    title: 'Tipos de pele',
    text: 'Características da pele seca, oleosa e acneica. Como identificar com segurança.',
  },
  {
    num: '05',
    title: 'Mapa da acne',
    text: 'Classificação visual da acne em 5 graus e o que a localização revela.',
  },
  {
    num: '06',
    title: 'Limpeza de pele',
    text: 'Por que ela é a base de todo tratamento e como evitar os erros que frustram.',
  },
];

export default function GuiaPrimeirosPassosPage() {
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.container}>
          <a href="/" className={styles.logo}>
            Duda<span className={styles.logoDot}>·</span>Bambil
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.heroTag}>Material gratuito · Para profissionais</div>
              <h1>
                Guia Primeiros Passos <em>no Gerenciamento de Pele.</em>
              </h1>
              <p className={styles.heroLead}>
                O ponto de partida para esteticistas, biomédicas, farmacêuticas e enfermeiras
                que querem entender como funciona o método que está transformando consultórios
                de estética básica em negócios de ticket alto.
              </p>
              <div className={styles.heroMeta}>
                <div className={styles.heroMetaItem}>
                  <span className={styles.metaDot} />
                  <span>22 páginas</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.metaDot} />
                  <span>PDF para download</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.metaDot} />
                  <span>Acesso imediato</span>
                </div>
              </div>
            </div>

            <div className={styles.heroCover}>
              <Image
                src="/guia-primeiros-passos-cover.png"
                alt="Guia Primeiros Passos no Gerenciamento de Pele"
                width={600}
                height={450}
                className={styles.heroCoverImg}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* O QUE TEM DENTRO */}
      <section className={styles.conteudo}>
        <div className={styles.container}>
          <div className={styles.conteudoHeader}>
            <div className={styles.eyebrow}>O que tem dentro</div>
            <h2>Do diagnóstico ao conteúdo.</h2>
            <p>Os fundamentos práticos do gerenciamento de pele em um único material.</p>
          </div>
          <div className={styles.conteudoGrid}>
            {CONTEUDO_ITEMS.map((item) => (
              <div key={item.num} className={styles.conteudoItem}>
                <div className={styles.conteudoNum}>{item.num}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className={styles.formSection} id="formulario">
        <div className={styles.container}>
          <div className={styles.formWrap}>
            <div className={styles.eyebrow}>Acesso imediato</div>
            <h2>Receba o guia agora.</h2>
            <p>Preencha os dados e libere o download na hora.</p>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* AUTORA */}
      <section className={styles.autora}>
        <div className={styles.container}>
          <div className={styles.autoraContent}>
            <div className={styles.eyebrow}>Quem escreveu</div>
            <h2 style={{ fontSize: '1.875rem', marginBottom: '24px' }}>
              Esse material é meu — e está sendo seu agora.
            </h2>
            <p>
              Sou esteticista, formada há 4 anos. Construí o método de gerenciamento de pele
              no meu próprio consultório, e hoje ensino o mesmo método para profissionais que
              querem parar de vender procedimento avulso e começar a vender protocolo.
            </p>
            <p style={{ marginTop: '16px' }}>
              Esse guia é o ponto de partida. Espero que te ajude.
            </p>
            <div className={styles.autoraName}>— Duda Bambil</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerMeta}>
            © 2026 Duda Bambil ·{' '}
            <a
              href="https://instagram.com/dudabambill"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-mute)', textDecoration: 'none' }}
            >
              @dudabambill
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
