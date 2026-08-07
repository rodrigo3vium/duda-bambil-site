import type { Metadata } from "next";
import Link from "next/link";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Curso de Limpeza de Pele — Duda Bambil",
  description:
    "A limpeza de pele é o procedimento mais pedido da estética. E o mais mal executado. 11 módulos: da anamnese à precificação. Acesso vitalício por R$197.",
  openGraph: {
    title: "Curso de Limpeza de Pele — Duda Bambil",
    description:
      "Não é falta de talento — é falta de método. O método completo, da anamnese à precificação.",
    type: "website",
  },
};

const CHECKOUT_URL = "https://pay.kiwify.com.br/xriaMA0";

const ESPELHO_ITENS = [
  "Você não sabe ler o fototipo antes de escolher o ativo — e a hiperpigmentação aparece depois",
  "Sua anamnese é um formulário, não uma ferramenta de decisão",
  "Você comprou aparelho por indicação de Instagram, não por critério",
  "Você trata emoliência como etapa, não como o ponto que define o sucesso da extração inteira",
  "E ninguém nunca te ensinou a transformar uma limpeza de pele em um plano de tratamento",
];

const PILARES = [
  {
    titulo: "Critério clínico",
    texto:
      "saber o que fazer diante de qualquer pele, não decorar uma sequência",
  },
  {
    titulo: "Segurança",
    texto:
      "reconhecer, prevenir e conduzir intercorrências sem entrar em pânico",
  },
  {
    titulo: "Faturamento",
    texto:
      "precificar certo e orientar os próximos procedimentos sem parecer que está empurrando venda",
  },
];

const INCLUSOS = [
  "11 módulos completos, do fundamento à precificação",
  "Acesso vitalício + atualizações futuras sem custo",
  "Assista no celular, tablet ou computador, no seu ritmo",
  "Certificado de conclusão",
  "Garantia incondicional de 7 dias",
];

export default function LimpezaDePelePage() {
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              Duda Bambil
            </Link>
            <nav className={styles.nav}>
              <a href="#virada">O curso</a>
              <a href="#modulos">Módulos</a>
              <a href="#quem-ensina">Quem ensina</a>
              <a href="#oferta">Investimento</a>
              <a href="#faq">Dúvidas</a>
            </nav>
          </div>
        </div>
      </header>

      {/* BLOCO 1 — HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.eyebrow}>
                Para esteticistas que já atendem (ou estão prestes a atender)
              </div>
              <h1>
                A limpeza de pele é o procedimento mais pedido da estética.{" "}
                <em>E o mais mal executado.</em>
              </h1>
              <p className={styles.lead}>
                Extração no escuro, emoliência que não amolece nada, cliente que
                sai com a pele marcada e não volta. Não é falta de talento — é
                falta de método. Este curso te dá o método completo: da anamnese
                à precificação.
              </p>
              <a href="#oferta" className={styles.cta}>
                Quero o método completo — R$197
              </a>
              <div className={styles.heroMeta}>
                <span>Acesso imediato</span>
                <span>·</span>
                <span>Vitalício</span>
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
          <h2>
            Passou 1h40 num atendimento que devia durar uma hora.
          </h2>
          <p>
            Suou. Forçou a extração porque a emoliência não fez o trabalho dela.
            Terminou com a pele da cliente vermelha demais, e ficou com aquele
            frio na barriga esperando o WhatsApp reclamando no dia seguinte.
          </p>
          <p>
            Ou pior: fez tudo &ldquo;certo&rdquo;, a cliente amou — e mesmo
            assim você cobrou R$120 num procedimento que consumiu quase duas
            horas da sua agenda, o custo dos seus produtos e o seu corpo.
          </p>
          <p className={styles.espelhoPivot}>
            O problema quase nunca está na sua mão. Está no que vem{" "}
            <strong>antes</strong> dela:
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
          <h2>Este curso não vai ser padrão.</h2>
          <p>
            Não é mais uma videoaula avulsa de limpeza de pele que você assiste
            e esquece.
          </p>
          <p>
            É a formação que a Duda Bambil montou a partir do que realmente
            acontece na maca: por que a extração trava, por que a pele reage,
            por que o cliente não volta, e por que a maioria das profissionais
            cobra menos do que o procedimento vale.
          </p>
          <p className={styles.viradaPivot}>
            Você sai daqui com três coisas que quase nenhuma esteticista tem
            juntas:
          </p>
          <ol className={styles.pilares}>
            {PILARES.map((pilar, i) => (
              <li key={pilar.titulo}>
                <span className={styles.pilarNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{pilar.titulo}</strong> — {pilar.texto}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BLOCO 4 — O QUE VOCÊ VAI APRENDER */}
      <section className={styles.modulos} id="modulos">
        <div className={styles.container}>
          <div className={styles.modulosHeader}>
            <div className={styles.eyebrow}>O que você vai aprender</div>
            <h2>Onze módulos, do fundamento à precificação.</h2>
            <p>
              Cada módulo resolve um ponto onde a limpeza de pele costuma
              travar. Você não precisa saber nada antes.
            </p>
          </div>

          <div className={styles.modulosList}>
            <div className={styles.modulo}>
              <div className={styles.moduloNum}>01</div>
              <div>
                <h3>Começando diferente</h3>
                <p>
                  Por que este curso não segue o padrão do mercado e por que a
                  limpeza de pele é o procedimento mais estratégico da sua
                  agenda — não o mais banal.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>02</div>
              <div>
                <h3>Teoria que serve na prática</h3>
                <p>
                  Anatomia da pele explicada de forma clara (sem decoreba de
                  faculdade). Como os tipos de pele mudam completamente o seu
                  resultado. E o capítulo que quase ninguém domina:{" "}
                  <strong>fototipo x hiperpigmentação</strong> — como evitar a
                  mancha que aparece uma semana depois e destrói a sua
                  indicação.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>03</div>
              <div>
                <h3>Anamnese que decide o protocolo</h3>
                <p>
                  Como avaliar de verdade antes de encostar na pele, e as
                  orientações de pós-procedimento que separam a cliente que
                  volta da cliente que some.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>04</div>
              <div>
                <h3>Possíveis intercorrências</h3>
                <p>
                  O que pode dar errado, como reconhecer cedo e o que fazer na
                  hora. O módulo que te dá calma na cadeira.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>05</div>
              <div>
                <h3>Guia de produtos e aparelhos</h3>
                <p>
                  Os produtos curingas que resolvem 90% dos casos. Quais
                  aparelhos comprar <strong>de verdade</strong> (e em que
                  ordem). Dermascan ou lupa de Wood: qual faz sentido pra sua
                  realidade. E os acessórios complementares que valem o
                  investimento.
                </p>
                <blockquote className={styles.moduloQuote}>
                  Só este módulo pode te economizar milhares de reais em compra
                  errada.
                </blockquote>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>06</div>
              <div>
                <h3>Emoliência certeira</h3>
                <p>
                  O segredo de uma emoliência eficaz. Acerte aqui e a extração
                  deixa de ser luta. Erre aqui e nada depois compensa.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>07</div>
              <div>
                <h3>Upsell na limpeza de pele</h3>
                <p>
                  Como orientar mais procedimentos com naturalidade e ética. E a
                  aula de <strong>precificação</strong>: quanto a sua limpeza de
                  pele deveria custar, com base no seu tempo, seu custo e o seu
                  nível.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>08</div>
              <div>
                <h3>Higienização e biossegurança</h3>
                <p>
                  Autoclave, higienização de acessórios e o protocolo que
                  protege você, a cliente e o seu CNPJ.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>09</div>
              <div>
                <h3>Receita de bolo?</h3>
                <p>
                  O passo a passo completo da limpeza de pele. Não porque
                  técnica se decora — mas porque depois de tudo que veio antes,
                  você vai saber <strong>por que</strong> cada etapa existe.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>10</div>
              <div>
                <h3>Módulo prático</h3>
                <p>
                  A execução na maca, do início ao fim. É aqui que a teoria vira
                  mão.
                </p>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>11</div>
              <div>
                <h3>Otimização de tempo</h3>
                <p>
                  Como fazer uma limpeza de pele excelente sem sequestrar duas
                  horas da sua agenda. Mais atendimentos por dia, com a mesma
                  qualidade.
                </p>
              </div>
            </div>
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
                <li>
                  É esteticista, biomédica esteta ou está se formando e quer
                  começar certo
                </li>
                <li>
                  Já faz limpeza de pele, mas sente que executa no automático e
                  sem segurança
                </li>
                <li>
                  Quer parar de ter medo de pele negra, pele acneica ou pele
                  sensível
                </li>
                <li>Cobra pouco e sabe disso</li>
                <li>
                  Quer transformar limpeza de pele em porta de entrada pra
                  tratamentos maiores
                </li>
              </ul>
            </div>
            <div className={`${styles.targetCol} ${styles.nao}`}>
              <h3>Não é pra você se</h3>
              <ul>
                <li>
                  Procura atalho, receita mágica ou &ldquo;protocolo de 15
                  minutos&rdquo;
                </li>
                <li>Não pretende atender pessoas de verdade</li>
                <li>Acha que já sabe tudo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 6 — OFERTA */}
      <section className={styles.oferta} id="oferta">
        <div className={styles.container}>
          <div className={styles.ofertaHeader}>
            <h2>Uma limpeza de pele paga o curso inteiro.</h2>
            <p>
              Você vai investir menos do que gastou no último aparelho que
              comprou por impulso — e do que vai faturar na primeira semana
              aplicando o que aprendeu.
            </p>
          </div>

          <div className={styles.ofertaCard}>
            <div className={styles.eyebrow}>Investimento</div>

            <div className={styles.ofertaPreco}>
              <div className={styles.precoDe}>De R$397</div>
              <div className={styles.valor}>
                <sup>R$</sup>197
              </div>
              <div className={styles.obs}>à vista</div>
              <div className={styles.parcelas}>ou 12x de R$19,90</div>
            </div>

            <div className={styles.ofertaLabel}>Você leva</div>
            <ul className={styles.ofertaIncludes}>
              {INCLUSOS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <a
              href={CHECKOUT_URL}
              className={`${styles.cta} ${styles.ctaLight}`}
            >
              Quero garantir minha vaga
            </a>

            <p className={styles.garantia}>
              Acesso imediato · Pagamento único ou parcelado · Garantia
              incondicional de 7 dias
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
            Entre, assista tudo, aplique. Se em 7 dias você achar que não valeu,
            pede o reembolso e devolvemos 100% do valor. Sem formulário chato,
            sem pergunta constrangedora.
          </p>
          <p>
            O risco é todo nosso — porque a gente sabe o que tem lá dentro.
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
                profissionais que querem parar de vender procedimento avulso e
                começar a vender protocolo.
              </p>
              <p>
                Este curso nasceu na maca, não na sala de aula. De cada extração
                que travou, de cada pele que reagiu depois, de cada cliente que
                sumiu depois de um atendimento &ldquo;bem feito&rdquo;. Ajustei
                anamnese, emoliência, protocolo e preço em centenas de
                atendimentos até chegar num método que funciona em qualquer pele
                e cabe dentro da agenda.
              </p>
              <p>
                É esse método que está aqui dentro — o mesmo que eu uso no meu
                consultório, todo dia.
              </p>
              <div className={styles.sobreSig}>— Duda Bambil</div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 9 — FAQ */}
      <section className={`${styles.faq} ${styles.sectionAlt}`} id="faq">
        <div className={styles.containerSm}>
          <div className={styles.eyebrow} style={{ textAlign: "center" }}>
            Dúvidas frequentes
          </div>
          <h2>Antes de você decidir.</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>Sou iniciante. Consigo acompanhar?</h3>
              <p>
                Sim. O curso começa do fundamento — anatomia, tipos de pele,
                anamnese — e sobe até a execução prática. Você não precisa saber
                nada antes.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Já faço limpeza de pele há anos. Vou aprender algo novo?</h3>
              <p>
                Provavelmente mais do que imagina. A maioria das profissionais
                experientes trava exatamente nos módulos de emoliência, fototipo
                e precificação.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Por quanto tempo tenho acesso?</h3>
              <p>
                Vitalício. Entrou, é seu — inclusive as atualizações.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Tem certificado?</h3>
              <p>Tem, emitido ao concluir o curso.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>As aulas são ao vivo?</h3>
              <p>
                Não. É tudo gravado, disponível no momento da compra. Você
                assiste quando e quantas vezes quiser.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Como recebo o acesso?</h3>
              <p>
                Na hora. O e-mail com login chega em minutos após a confirmação
                do pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 10 — FECHAMENTO */}
      <section className={styles.final}>
        <div className={styles.containerSm}>
          <div className={styles.eyebrow}>Última coisa</div>
          <h2>
            A diferença entre cobrar R$120 e cobrar R$300 pela mesma hora não é
            o seu talento. <em>É o seu método.</em>
          </h2>
          <p>Você já tem a mão. Falta o critério.</p>
          <a href={CHECKOUT_URL} className={`${styles.cta} ${styles.ctaLight}`}>
            Começar agora — R$197
          </a>
          <p className={styles.finalMeta}>
            Acesso imediato · Vitalício · 7 dias de garantia
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
            Curso de Limpeza de Pele ·{" "}
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
