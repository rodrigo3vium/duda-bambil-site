import type { Metadata } from "next";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Curso de Gerenciamento de Pele — Duda Bambil",
  description:
    "O método completo para esteticistas que querem parar de vender sessão e começar a vender protocolo de R$1.500 a R$4.000. 7 módulos + biblioteca de protocolos.",
  openGraph: {
    title: "Curso de Gerenciamento de Pele — Duda Bambil",
    description:
      "O método completo. De R$80 por limpeza a R$2.000 por plano de tratamento.",
    type: "website",
  },
};

const CHECKOUT_URL = "#"; // TODO: substituir pelo link real de checkout

const BONUS_PROTOCOLS = [
  "Limpeza de pele profunda (prática 1 e 2)",
  "Protocolo de acne e ácido glicólico",
  "Ultra hidratante com fios de seda",
  "Clareamento inteligente BIOAGE",
  "Dermaplaning + BTX BIOAGE",
  "Enzima BTX e Exo Peptide",
  "Limpeza com protocolo de chocolate",
  "Lâmpada de Wood",
];

export default function GerenciamentoDePelePage() {
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <a href="/" className={styles.logo}>
              Duda Bambil
            </a>
            <nav className={styles.nav}>
              <a href="#metodo">Método</a>
              <a href="#modulos">Módulos</a>
              <a href="#sobre">Sobre</a>
              <a href="#oferta">Investimento</a>
              <a href="#faq">Dúvidas</a>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.eyebrow}>Curso de Gerenciamento de Pele</div>
              <h1>
                De R$80 numa limpeza
                <br />a <em>R$2.000</em> num plano
                <br />
                de tratamento.
              </h1>
              <p className={styles.lead}>
                O método completo para esteticistas que querem parar de trocar
                tempo por dinheiro e construir um consultório com agenda enxuta,
                ticket alto e pacientes que voltam.
              </p>
              <a href="#oferta" className={styles.cta}>
                Ver o curso completo
              </a>
              <div className={styles.heroMeta}>
                <span>7 módulos</span>
                <span>·</span>
                <span>Biblioteca de protocolos</span>
                <span>·</span>
                <span>Acesso vitalício</span>
              </div>
            </div>
            <div className={styles.heroImg} aria-label="Duda Bambil" />
          </div>
        </div>
      </section>

      {/* DORES */}
      <section
        className={`${styles.pains} ${styles.sectionAlt}`}
        id="metodo"
      >
        <div className={styles.container}>
          <h2>
            Você não tem problema de cliente.
            <br />
            Você tem problema de método.
          </h2>
          <p className={styles.painsSub}>
            Se você se identifica com pelo menos 3 dessas situações, esse curso
            foi feito pra você.
          </p>
          <div className={styles.painsGrid}>
            <div className={styles.pain}>
              <div className={styles.painNum}>01</div>
              <p>Sua agenda vive cheia, mas o mês fecha no zero a zero.</p>
            </div>
            <div className={styles.pain}>
              <div className={styles.painNum}>02</div>
              <p>
                Os clientes vêm uma vez e voltam só depois de meses — quando
                voltam.
              </p>
            </div>
            <div className={styles.pain}>
              <div className={styles.painNum}>03</div>
              <p>Você depende de promoção pra movimentar o consultório.</p>
            </div>
            <div className={styles.pain}>
              <div className={styles.painNum}>04</div>
              <p>
                Sabe que entrega resultado, mas não consegue justificar cobrar
                mais.
              </p>
            </div>
            <div className={styles.pain}>
              <div className={styles.painNum}>05</div>
              <p>
                Vê biomédica injetando preenchimento e ganhando 10x mais que
                você.
              </p>
            </div>
            <div className={styles.pain}>
              <div className={styles.painNum}>06</div>
              <p>
                Trabalha sábado o dia inteiro e ainda assim a conta não fecha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMAÇÃO */}
      <section className={`${styles.transform} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <h2>O que muda na prática.</h2>
          <div className={styles.transformGrid}>
            <div className={`${styles.transformCol} ${styles.antes}`}>
              <h3>Antes</h3>
              <ul>
                <li>Vende sessão avulsa de R$80 a R$250.</li>
                <li>Atende 8–10 pacientes por dia pra fechar o mês.</li>
                <li>Depende de promoção pra mover a agenda.</li>
                <li>Cliente faz uma limpeza e some por meses.</li>
                <li>Compete por preço com qualquer estúdio do bairro.</li>
                <li>Trabalha sábado o dia inteiro.</li>
                <li>Sente que faz &ldquo;estética básica&rdquo;.</li>
              </ul>
            </div>
            <div className={`${styles.transformCol} ${styles.depois}`}>
              <h3>Depois do curso</h3>
              <ul>
                <li>Vende plano de tratamento de R$1.500 a R$4.000.</li>
                <li>Atende 3–4 pacientes por dia com ticket alto.</li>
                <li>Agenda preenchida sem desconto, sem promoção.</li>
                <li>Paciente fecha protocolo de 8–12 semanas e volta.</li>
                <li>É procurada como especialista, não como opção.</li>
                <li>Define o próprio horário. Folga inegociável.</li>
                <li>É referência em gerenciamento de pele.</li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "64px" }}>
            <a href="#oferta" className={`${styles.cta} ${styles.ctaLight}`}>
              Quero essa virada
            </a>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className={styles.modulos} id="modulos">
        <div className={styles.container}>
          <div className={styles.modulosHeader}>
            <div className={styles.eyebrow}>O que você vai aprender</div>
            <h2>O método completo, em 7 módulos.</h2>
            <p>
              Cada módulo é um pilar do gerenciamento de pele. Você não precisa
              ter experiência prévia — só vontade de mudar o jogo.
            </p>
          </div>

          <div className={styles.modulosList}>
            <div className={styles.modulo}>
              <div className={styles.moduloNum}>01</div>
              <div>
                <h3>Fundamentos do Gerenciamento de Pele</h3>
                <p>
                  A base conceitual que sustenta tudo. Sem isso, nenhum
                  protocolo funciona.
                </p>
                <ul>
                  <li>
                    O que é gerenciamento de pele e por que ele substitui o
                    procedimento avulso
                  </li>
                  <li>
                    A diferença entre vender sessão e vender acompanhamento
                  </li>
                  <li>
                    Os 4 pilares que fazem o paciente fechar plano e renovar
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>02</div>
              <div>
                <h3>Diagnóstico Profissional de Pele</h3>
                <p>
                  Como ler uma pele com confiança e gerar autoridade técnica
                  desde a primeira consulta.
                </p>
                <ul>
                  <li>
                    Anamnese estruturada que substitui o &ldquo;deixa eu olhar
                    sua pele&rdquo;
                  </li>
                  <li>Identificação de tipo, estado e disfunções de pele</li>
                  <li>
                    Como explicar o diagnóstico de forma simples e gerar valor
                    percebido
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>03</div>
              <div>
                <h3>Construção de Protocolo</h3>
                <p>
                  Onde a maioria das esteticistas trava. Você sai com modelos
                  prontos pra adaptar.
                </p>
                <ul>
                  <li>Como montar plano de 4, 8 e 12 semanas</li>
                  <li>Sequência de procedimentos que multiplica resultado</li>
                  <li>Escolha de produtos sem dependência de marca</li>
                  <li>
                    Por que preparar a pele com 6 produtos vale mais que com 2
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>04</div>
              <div>
                <h3>Precificação e Apresentação Comercial</h3>
                <p>
                  Como cobrar R$2.000 sem medo, sem desconto e sem perder
                  paciente.
                </p>
                <ul>
                  <li>Estrutura de precificação de plano de tratamento</li>
                  <li>
                    Como apresentar o valor sem entregar de mão beijada
                  </li>
                  <li>Quebra das principais objeções de preço</li>
                  <li>
                    Por que parcelar e como parcelar sem destruir margem
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>05</div>
              <div>
                <h3>Atendimento e Fidelização</h3>
                <p>
                  Do primeiro contato no WhatsApp ao retorno depois do
                  protocolo.
                </p>
                <ul>
                  <li>Script do primeiro atendimento no WhatsApp</li>
                  <li>Condução da consulta diagnóstica</li>
                  <li>Prescrição de home care que vende e fideliza</li>
                  <li>Estrutura de retorno e renovação de plano</li>
                </ul>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>06</div>
              <div>
                <h3>Posicionamento Digital de Especialista</h3>
                <p>
                  Como aparecer como referência — não como mais uma esteticista
                  que faz de tudo.
                </p>
                <ul>
                  <li>
                    Como construir narrativa de especialista no Instagram
                  </li>
                  <li>
                    Tipos de conteúdo que atraem paciente certo (não curioso)
                  </li>
                  <li>Como mostrar resultado sem expor paciente</li>
                </ul>
              </div>
            </div>

            <div className={styles.modulo}>
              <div className={styles.moduloNum}>07</div>
              <div>
                <h3>Gestão do Consultório</h3>
                <p>Porque entregar bem não basta. Você precisa de estrutura.</p>
                <ul>
                  <li>Organização financeira do consultório</li>
                  <li>Rotina de atendimento que não te deixa exausta</li>
                  <li>
                    Indicadores que você precisa acompanhar toda semana
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.moduloBonus}>
              <div className={styles.eyebrow}>Bônus incluído</div>
              <h3>Biblioteca de Protocolos Práticos</h3>
              <p style={{ marginTop: "16px" }}>
                8 protocolos completos em vídeo, prontos pra você aplicar no
                consultório:
              </p>
              <ul
                style={{
                  marginTop: "24px",
                  listStyle: "none",
                  columns: "2",
                  columnGap: "32px",
                }}
              >
                {BONUS_PROTOCOLS.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: "8px 0 8px 20px",
                      position: "relative",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: "var(--ink-mute)",
                      }}
                    >
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className={`${styles.sobre} ${styles.sectionAlt}`} id="sobre">
        <div className={styles.container}>
          <div className={styles.sobreGrid}>
            <div className={styles.sobreImg} aria-label="Duda Bambil" />
            <div className={styles.sobreText}>
              <div className={styles.eyebrow}>Quem é a Duda</div>
              <h2>
                Sou esteticista. Não biomédica, não farmacêutica.
              </h2>
              <p>
                Trabalho com a estética que toda profissional aprende na
                faculdade — e que quase ninguém sabe transformar em negócio
                rentável.
              </p>
              <p>
                Construí o método de Gerenciamento de Pele atendendo no meu
                próprio consultório, por anos, ajustando cada detalhe até chegar
                num modelo replicável.
              </p>
              <p>
                Hoje minha agenda é enxuta, meu ticket é alto, e segunda-feira é
                meu dia de folga inegociável. E o método que me trouxe até aqui
                é exatamente o que tá nesse curso.
              </p>
              <div className={styles.sobreSig}>— Duda Bambil</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRA QUEM É */}
      <section className={styles.target}>
        <div className={styles.container}>
          <h2>Esse curso não é pra todo mundo.</h2>
          <p className={styles.targetSub}>
            Antes de comprar, leia com atenção. Eu prefiro vender pra menos
            gente certa do que pra mais gente errada.
          </p>
          <div className={styles.targetGrid}>
            <div className={`${styles.targetCol} ${styles.sim}`}>
              <h3>É pra você se</h3>
              <ul>
                <li>
                  É esteticista, biomédica, farmacêutica, enfermeira ou
                  dentista que trabalha com estética básica.
                </li>
                <li>
                  Já atende, mas sente que tá deixando dinheiro na mesa.
                </li>
                <li>Quer parar de competir por preço.</li>
                <li>
                  Tá disposta a estudar e aplicar — não busca atalho mágico.
                </li>
                <li>
                  Entende que método sério leva 60–90 dias pra dar resultado
                  consistente.
                </li>
              </ul>
            </div>
            <div className={`${styles.targetCol} ${styles.nao}`}>
              <h3>Não é pra você se</h3>
              <ul>
                <li>
                  Quer fórmula mágica pra faturar 50 mil no próximo mês.
                </li>
                <li>
                  Não tem disposição pra mudar o jeito que atende hoje.
                </li>
                <li>
                  Quer só &ldquo;mais técnica&rdquo; — esse curso é sobre
                  método e posicionamento.
                </li>
                <li>
                  Não tem ainda qualquer experiência clínica em estética.
                </li>
                <li>Espera resultado sem aplicar o que vai aprender.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section className={styles.oferta} id="oferta">
        <div className={styles.container}>
          <div className={styles.ofertaCard}>
            <div className={styles.eyebrow}>Investimento</div>
            <h2>Curso de Gerenciamento de Pele</h2>
            <p
              style={{
                color: "rgba(236,232,225,0.75)",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              O método completo. Acesso vitalício. Atualizações inclusas.
            </p>

            <ul className={styles.ofertaIncludes}>
              <li>7 módulos com o método completo</li>
              <li>Biblioteca de 8 protocolos práticos em vídeo</li>
              <li>Modelos de plano de tratamento (4, 8 e 12 semanas)</li>
              <li>Scripts de WhatsApp e atendimento</li>
              <li>Estrutura de precificação pronta pra adaptar</li>
              <li>Acesso vitalício e atualizações inclusas</li>
            </ul>

            <div className={styles.ofertaPreco}>
              <div className={styles.label}>Acesso por</div>
              <div className={styles.parcelas}>12x de R$28,72</div>
              <div className={styles.valor}>
                ou <sup>R$</sup>297
              </div>
              <div className={styles.obs}>
                à vista · Pagamento único · Acesso imediato
              </div>
            </div>

            <a
              href={CHECKOUT_URL}
              className={`${styles.cta} ${styles.ctaLight}`}
            >
              Quero meu acesso agora
            </a>

            <p className={styles.garantia}>
              Garantia incondicional de 7 dias. Se você assistir, aplicar e não
              enxergar valor — devolvo seu dinheiro sem perguntas.
            </p>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className={styles.guaranteeBlock}>
        <div className={styles.containerSm}>
          <div className={styles.seal}>7 dias</div>
          <h2>O risco é meu, não seu.</h2>
          <p>
            Você tem 7 dias pra acessar todo o conteúdo, aplicar com uma
            paciente real, e decidir. Se não fizer sentido, é só me mandar uma
            mensagem. Devolvo 100% do valor, sem burocracia, sem perguntas.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq} id="faq">
        <div className={styles.containerSm}>
          <div className={styles.eyebrow} style={{ textAlign: "center" }}>
            Dúvidas frequentes
          </div>
          <h2>Antes de você decidir.</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>Ainda sou estudante. Posso fazer esse curso?</h3>
              <p>
                Sim. É melhor começar com o método certo desde o início, antes
                de criar vícios de atendimento que vão te limitar depois.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Gerenciamento de pele é um protocolo?</h3>
              <p>
                Não. Gerenciamento de pele não é uma técnica isolada — é um
                conjunto de estratégias e métodos que envolvem todo o
                atendimento estético. Do diagnóstico ao home care, do
                posicionamento à precificação. É o que transforma sessão em
                plano e cliente em paciente.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Em quanto tempo eu vejo resultado?</h3>
              <p>
                Você consegue aplicar o método na próxima paciente que entrar no
                seu consultório. O resultado de faturamento depende de quantos
                planos você fecha por mês — alunas que aplicaram desde a
                primeira semana relatam virar a chave em 30 a 60 dias.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>O curso tem atualização?</h3>
              <p>
                Sim. Aulas novas durante o ano todo, sobre temas variados,
                incluindo sugestões das próprias alunas. O acesso é vitalício.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Por que não é mais barato?</h3>
              <p>
                Porque um curso barato atrai gente que não aplica. R$297 é o
                filtro — quem investe esse valor leva a sério. Se aplicar o
                método em um único plano de tratamento de R$2.000, você pagou o
                curso 6 vezes.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>E se eu já tiver feito outros cursos?</h3>
              <p>
                Cursos de técnica te ensinam a fazer melhor o que você já faz.
                Esse aqui te ensina a vender de outro jeito o que você já sabe
                fazer. São complementares — mas o método de gerenciamento é o
                que destrava o faturamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.final}>
        <div className={styles.containerSm}>
          <div className={styles.eyebrow}>Última coisa</div>
          <h2>
            Você pode continuar trocando
            <br />
            tempo por dinheiro.
            <br />
            Ou pode mudar de método.
          </h2>
          <p>
            O preço da inação não é R$297. É outro ano cobrando R$80 por uma
            limpeza enquanto biomédica do lado fatura 10 vezes mais.
          </p>
          <a href={CHECKOUT_URL} className={`${styles.cta} ${styles.ctaLight}`}>
            Quero começar agora
          </a>
          <p className={styles.finalMeta}>
            Acesso vitalício · Garantia de 7 dias · 12x de R$28,72
          </p>
        </div>
      </section>

      {/* TEASER MENTORIA */}
      <section className={styles.nextStep}>
        <div className={styles.containerSm}>
          <div className={styles.eyebrow}>Depois do curso</div>
          <p>
            Pra quem quiser ir mais fundo, eu tenho mentoria individual e
            imersão presencial. Mas isso é depois. Primeiro, domine o método.
          </p>
          <a
            href="https://instagram.com/dudabambill"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conheça os próximos passos →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <a href="/" className={styles.logo}>
            Duda Bambil
          </a>
          <p>
            Gerenciamento de Pele ·{" "}
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
