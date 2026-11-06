import type { Metadata } from "next";
import Link from "next/link";
import styles from "./styles.module.css";
import { CheckoutLink } from "@/components/CheckoutLink";
import { SectionNav, type SecaoNav } from "./SectionNav";
import { CHECKOUT_URL, PRECO } from "./config";

/*
 * LP — Curso de Criação de Conteúdo para Estética.
 * Spec e copy aprovada: docs/lp-criacao-de-conteudo.md
 *
 * NÃO prometer acesso vitalício nem certificado: o Rodrigo não confirmou
 * (05/11/2026). O teste em tests/criacao-de-conteudo/ falha se aparecerem.
 */

export const metadata: Metadata = {
  title: "Curso de Criação de Conteúdo para Estética — Duda Bambil",
  description:
    "O conteúdo que traz paciente já acontece na sua maca. 9 aulas diretas para esteticistas e biomédicas transformarem a rotina do consultório em conteúdo que faz agendar. R$597.",
  openGraph: {
    title: "Curso de Criação de Conteúdo para Estética — Duda Bambil",
    description:
      "Sem dia de produção, sem softbox, sem calendário pronto. Conteúdo que nasce da sua rotina e traz paciente.",
    type: "website",
  },
};

const SECOES: SecaoNav[] = [
  { id: "virada", label: "O curso" },
  { id: "aulas", label: "Aulas" },
  { id: "oferta", label: "Investimento" },
  { id: "quem-ensina", label: "Quem ensina" },
  { id: "faq", label: "Dúvidas" },
];

const ESPELHO_ITENS = [
  "Você escreve no story como se falasse com outra esteticista (“oxigenação celular”, “ácido tal”) e a paciente não entende o que ganha com isso",
  "Você grava cinco stories seguidos só falando, sem legenda, e ela pula todos",
  "O fundo do vídeo tem carrinho bagunçado e gaveta aberta, e é disso que ela lembra, não do procedimento",
  "Você espera ter microfone, LED e tripé bom pra começar, e não começa",
  "Você posta o print do feedback com “gratidão” e deixa passar a venda que estava ali",
];

const PILARES = [
  {
    titulo: "Ideias que não acabam",
    texto:
      "os 5 ângulos que tiram conteúdo de cada atendimento, cada dúvida e cada resultado",
  },
  {
    titulo: "Formatos que cabem na rotina",
    texto:
      "cinco jeitos de gravar sem parar o dia, enquanto você arruma a bancada ou atende",
  },
  {
    titulo: "Linguagem que vende",
    texto:
      "trocar o termo técnico pelo que a paciente ganha, até ela pensar “eu preciso fazer isso, e com ela”",
  },
];

interface Aula {
  titulo: string;
  texto: string;
  destaque?: string;
}

const AULAS: Aula[] = [
  {
    titulo: "Começando do jeito certo",
    texto:
      "Por que tanto conteúdo de estética não dá resultado, e o combinado que separa quem aplica de quem só anota no caderno.",
  },
  {
    titulo: "O básico bem feito",
    texto:
      "Câmera limpa, cenário organizado, edição limpa. Por que o carrinho bagunçado rouba a atenção do procedimento, e por que menos é mais no story e no feed.",
  },
  {
    titulo: "Você já tem o equipamento",
    texto:
      "Comece com o celular e a luz de uma janela. Quando vale investir, e o que a Duda usa hoje (microfone e tripé de ímã), com os links.",
  },
  {
    titulo: "O que a sua paciente quer assistir",
    texto:
      "Feed atrai, story vende. O teste do “minha mãe entenderia?” antes de postar. E o perfil espião, pra achar conteúdo que já funcionou sem se perder rolando o feed.",
  },
  {
    titulo: "Os formatos que cabem na rotina",
    texto:
      "Story vlog, take, talk, estático, terceira pessoa e carrossel: como gravar enquanto arruma a sala, prepara a pele ou explica algo pra paciente. A aula mais longa do curso.",
  },
  {
    titulo: "A técnica dos ângulos",
    texto:
      "O bastidor que a paciente não vê, a sua opinião sobre cada etapa do protocolo e os erros que todo paciente comete. Três produtos da sua bancada viram três conteúdos.",
  },
  {
    titulo: "Sua base de conteúdo",
    texto:
      "Dúvidas e resultados: de uma pergunta de paciente saem cinco conteúdos. Como contar um resultado sem ficar só no antes e depois, e montar a lista que acaba com o “o que eu posto hoje?”.",
    destaque: "Uma pergunta que você ia só responder vira cinco conteúdos.",
  },
  {
    titulo: "Os erros que custam paciente",
    texto:
      "Story falado sem legenda, excesso de edição, nunca mostrar o rosto, foto de curso sem contexto e feedback sem gancho. E o que fazer no lugar de cada um.",
  },
  {
    titulo: "Teste e constância",
    texto:
      "Os Reels de teste do Instagram: o mesmo vídeo com legendas diferentes até achar o que roda. E como replicar o que deu certo em vez de inventar do zero.",
    destaque:
      "Um vídeo que eu já tinha postado várias vezes ganhou uma legenda nova e passou de 130 mil visualizações.",
  },
];

const PRA_QUEM_SIM = [
  "É esteticista ou biomédica esteta e já atende (ou está prestes a começar)",
  "Sabe que precisa postar, mas trava no “o que eu posto hoje?”",
  "Já gastou com equipamento ou com dia de produção e não viu retorno",
  "Não tem como parar a agenda pra gravar",
  "Quer que o Instagram traga paciente, não só curtida",
];

const PRA_QUEM_NAO = [
  "Quer 30 posts prontos pra trocar o logo e repostar",
  "Procura edição cheia de efeito e transição",
  "Vai assistir, anotar e deixar pra depois",
];

const INCLUSOS = [
  "9 aulas diretas, da gravação à constância",
  "Os 5 formatos e os 5 ângulos pra nunca mais ficar sem ideia",
  "A lista dos equipamentos que a Duda usa, com link",
  "Aulas gravadas: assista no celular ou no computador, no seu ritmo",
  "Garantia incondicional de 7 dias",
];

const FAQ = [
  {
    pergunta: "Não gosto de aparecer. Consigo fazer?",
    resposta:
      "Sim. Vários formatos do curso não pedem que você fale nada: o take e o estático, por exemplo. Mas a aula 8 explica por que aparecer aos poucos faz diferença, e como começar sem travar.",
  },
  {
    pergunta: "Preciso comprar equipamento?",
    resposta:
      "Não. Um celular que grave e a luz de uma janela bastam pra começar. A aula 3 mostra quando vale investir, e o que comprar.",
  },
  {
    pergunta: "Não tenho tempo pra criar conteúdo.",
    resposta:
      "É exatamente disso que o curso trata: gravar no meio da rotina que você já tem, sem parar a agenda.",
  },
  {
    pergunta: "Vou receber posts prontos ou um calendário?",
    resposta:
      "Não. Você aprende a tirar conteúdo da sua própria rotina, das suas pacientes e dos seus resultados, que é o que faz quem assiste querer agendar com você.",
  },
  {
    pergunta: "As aulas são ao vivo?",
    resposta:
      "Não. São 9 aulas gravadas, cerca de 1h30 no total, disponíveis no momento da compra.",
  },
  {
    pergunta: "Como recebo o acesso?",
    resposta:
      "Na hora. O e-mail com login chega em minutos após a confirmação do pagamento.",
  },
];

export default function CriacaoDeConteudoPage() {
  return (
    <div className={styles.page}>
      {/* HEADER — fixo, com índice das seções e barra de progresso */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              Duda Bambil
            </Link>
            <SectionNav secoes={SECOES} />
          </div>
        </div>
      </header>

      {/* BLOCO 1 — HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.eyebrow}>
                Curso de conteúdo para esteticistas e biomédicas
              </div>
              <h1>
                O conteúdo que traz paciente já acontece na sua maca.{" "}
                <em>Você só não está gravando.</em>
              </h1>
              <p className={styles.lead}>
                Sem dia de produção, sem softbox, sem calendário de 30 posts
                prontos.
              </p>
              <p className={styles.lead}>
                Em 9 aulas diretas, a Duda te mostra como transformar a rotina
                do consultório (o preparo da sala, a dúvida da paciente, o
                resultado do protocolo) em conteúdo que faz quem assiste querer
                agendar com você.
              </p>
              <a href="#oferta" className={styles.cta}>
                Quero aprender — {PRECO}
              </a>
              <div className={styles.heroMeta}>
                <span>Acesso imediato</span>
                <span>·</span>
                <span>9 aulas</span>
                <span>·</span>
                <span>7 dias de garantia</span>
              </div>
            </div>
            <div className={styles.heroImg} aria-label="Duda Bambil" />
          </div>
        </div>
      </section>

      {/* BLOCO 2 — O ESPELHO */}
      <section className={`${styles.espelho} ${styles.sectionAlt}`}>
        <div className={styles.containerSm}>
          <div className={styles.eyebrow}>Você já viveu isso</div>
          <h2>Tirou a tarde pra gravar. O post não deu em nada.</h2>
          <p>
            Se maquiou, trocou de roupa, chamou modelo, chamou alguém pra
            filmar. Postou no feed na mesma semana. Quase ninguém viu. Nenhuma
            mensagem, nenhum agendamento.
          </p>
          <p>
            E o ciclo recomeça: você sabe que precisa fazer conteúdo, mas a
            agenda, o financeiro, a limpeza da sala e a vida lá fora sempre
            ganham. O Instagram vira mais um peso.
          </p>
          <p className={styles.espelhoPivot}>
            O problema não é o seu celular nem a sua luz. É que ninguém te
            ensinou a fazer o conteúdo <strong>certo</strong>:
          </p>
          <ul className={styles.espelhoList}>
            {ESPELHO_ITENS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* BLOCO 3 — A VIRADA */}
      <section className={`${styles.virada} ${styles.sectionDark}`} id="virada">
        <div className={styles.containerSm}>
          <h2>Este não é mais um curso de calendário de conteúdo.</h2>
          <p>
            Não tem 30 posts editáveis pra trocar o logo. Não tem roteiro pra
            seguir sem entender por quê. Se você espera receber tudo pronto,
            este curso não é pra você.
          </p>
          <p>
            É o jeito que a Duda faz o próprio Instagram: celular, tripé e a
            luz da sala. O básico muito bem feito, gravado no meio dos
            atendimentos.
          </p>
          <p className={styles.viradaPivot}>Você sai daqui com três coisas:</p>
          <ol className={styles.pilares}>
            {PILARES.map((pilar, i) => (
              <li key={pilar.titulo}>
                <span className={styles.pilarNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{pilar.titulo}</strong>: {pilar.texto}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BLOCO 4 — AS 9 AULAS */}
      <section className={styles.modulos} id="aulas">
        <div className={styles.container}>
          <div className={styles.modulosHeader}>
            <div className={styles.eyebrow}>O que você vai aprender</div>
            <h2>Nove aulas, do celular limpo ao conteúdo que roda.</h2>
            <p>
              Aulas curtas e diretas, cerca de 1h30 no total. Dá pra assistir
              uma no intervalo e aplicar no atendimento seguinte.
            </p>
          </div>

          <div className={styles.modulosList}>
            {AULAS.map((aula, i) => (
              <div className={styles.modulo} key={aula.titulo}>
                <div className={styles.moduloNum}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3>{aula.titulo}</h3>
                  <p>{aula.texto}</p>
                  {aula.destaque && (
                    <blockquote className={styles.moduloQuote}>
                      {aula.destaque}
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCO 5 — PARA QUEM É */}
      <section className={`${styles.target} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2>Para quem é este curso.</h2>
          <div className={styles.targetGrid}>
            <div className={`${styles.targetCol} ${styles.sim}`}>
              <h3>É pra você se</h3>
              <ul>
                {PRA_QUEM_SIM.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.targetCol} ${styles.nao}`}>
              <h3>Não é pra você se</h3>
              <ul>
                {PRA_QUEM_NAO.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 6 — OFERTA */}
      <section className={styles.oferta} id="oferta">
        <div className={styles.container}>
          <div className={styles.ofertaHeader}>
            <h2>Uma paciente nova que fecha protocolo paga o curso.</h2>
            <p>
              O resto é lucro, e conteúdo que continua trabalhando por você toda
              semana.
            </p>
          </div>

          <div className={styles.ofertaCard}>
            <div className={styles.eyebrow}>Investimento</div>

            <div className={styles.ofertaPreco}>
              <div className={styles.valor}>
                <sup>R$</sup>597
              </div>
              <div className={styles.obs}>à vista</div>
              <div className={styles.parcelas}>ou parcelado no cartão</div>
            </div>

            <div className={styles.ofertaLabel}>Você leva</div>
            <ul className={styles.ofertaIncludes}>
              {INCLUSOS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <CheckoutLink
              href={CHECKOUT_URL}
              className={`${styles.cta} ${styles.ctaLight}`}
              produto="curso-conteudo"
              origem="lp-conteudo-oferta"
            >
              Quero começar agora
            </CheckoutLink>

            <p className={styles.garantia}>
              Acesso imediato · À vista ou parcelado · Garantia de 7 dias
            </p>
          </div>
        </div>
      </section>

      {/* BLOCO 7 — GARANTIA */}
      <section className={styles.guaranteeBlock}>
        <div className={styles.containerSm}>
          <div className={styles.seal}>7 dias</div>
          <h2>Risco zero. Só seu, não.</h2>
          <p>
            Entre, assista, grave os primeiros conteúdos. Se em 7 dias você
            achar que não valeu, pede o reembolso e devolvemos 100% do valor.
            Sem formulário chato, sem pergunta constrangedora.
          </p>
          <p>
            O risco é todo nosso, porque a gente sabe o que tem lá dentro.
          </p>
        </div>
      </section>

      {/* BLOCO 8 — QUEM ENSINA */}
      <section className={styles.sobre} id="quem-ensina">
        <div className={styles.container}>
          <div className={styles.sobreGrid}>
            <div className={styles.sobreImg} aria-label="Duda Bambil" />
            <div className={styles.sobreText}>
              <div className={styles.eyebrow}>Quem ensina</div>
              <h2>Duda Bambil</h2>
              <p>
                Esteticista formada há 4 anos, especialista em gerenciamento de
                pele. Atendo pacientes no meu próprio consultório e ensino
                profissionais da estética.
              </p>
              <p>
                Comecei a fazer conteúdo em 2024 com um iPhone 11, sem microfone
                e com uma ring light quebrada, presa com fita. Postava de tudo,
                até procedimento que eu nem atendo. Era conteúdo solto, sem pé
                nem cabeça.
              </p>
              <p>
                Hoje uso um tripé de ímã, um microfone e a luz da minha sala. O
                que mudou não foi o equipamento: foi entender o que gravar, como
                falar e por que testar. É esse método que está aqui dentro, o
                mesmo que eu uso no meu Instagram todo dia.
              </p>
              <div className={styles.sobreSig}>— Duda Bambil</div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 9 — FAQ */}
      <section className={`${styles.faq} ${styles.sectionAlt}`} id="faq">
        <div className={styles.containerSm}>
          <div className={`${styles.eyebrow} ${styles.center}`}>
            Dúvidas frequentes
          </div>
          <h2>Antes de você decidir.</h2>
          <div className={styles.faqList}>
            {FAQ.map(({ pergunta, resposta }) => (
              <div className={styles.faqItem} key={pergunta}>
                <h3>{pergunta}</h3>
                <p>{resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCO 10 — FECHAMENTO */}
      <section className={styles.final}>
        <div className={styles.containerSm}>
          <div className={styles.eyebrow}>Última coisa</div>
          <h2>
            Seu próximo conteúdo já está acontecendo no consultório.{" "}
            <em>Só falta apertar o rec.</em>
          </h2>
          <p>
            Você já tem a rotina, as pacientes e as perguntas. Falta o método
            pra transformar isso em paciente nova.
          </p>
          <CheckoutLink
            href={CHECKOUT_URL}
            className={`${styles.cta} ${styles.ctaLight}`}
            produto="curso-conteudo"
            origem="lp-conteudo-final"
          >
            Começar agora — {PRECO}
          </CheckoutLink>
          <p className={styles.finalMeta}>
            Acesso imediato · 9 aulas · 7 dias de garantia
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            Duda Bambil
          </Link>
          <p>
            Curso de Criação de Conteúdo para Estética ·{" "}
            <a
              href="https://instagram.com/dudabambill"
              target="_blank"
              rel="noopener noreferrer"
            >
              @dudabambill
            </a>
          </p>
          <p>© 2026 Duda Bambil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
