import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guia Editável de Skincare — Duda Bambil',
  description:
    'O guia editável que esteticistas usam pra prescrever home care com a própria marca. Pronto pra editar, salvar e entregar pra paciente. R$47.',
  openGraph: {
    title: 'Guia Editável de Skincare por R$47',
    description: 'Prescreva home care com a sua marca. Pronto pra editar e entregar.',
    type: 'website',
  },
};

const CHECKOUT_URL = 'https://pay.kiwify.com.br/PeL4M7p';

export default function GuiaSkinCare() {
  return (
    <div className="guia-page">

      {/* HEADER */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <a href="#" className="logo">Duda Bambil</a>
            <a href="#oferta" className="header-cta">Adquirir por R$47</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="eyebrow">Guia Editável de Skincare</div>
              <h1>
                Guia de Skincare editável<br />
                para <em>Profissionais da estética</em>
              </h1>
              <p className="lead">
                O guia editável que você baixa, edita com a sua marca, salva em PDF e entrega pra
                paciente. Pronto pra usar amanhã.
              </p>
              <div className="hero-price">
                <span className="currency">R$</span>
                <span className="value">47</span>
                <span className="obs">à vista · acesso imediato</span>
              </div>
              <a href="#oferta" className="cta">Quero meu guia</a>
              <div className="hero-meta">
                <span>Editável no Canva</span>
                <span>·</span>
                <span>Personalizável com sua marca</span>
              </div>
            </div>
            <div className="hero-mockup" aria-label="Duda Bambil" />
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="problema section-alt">
        <div className="container-sm">
          <div className="eyebrow" style={{ textAlign: 'center' }}>Você já passou por isso?</div>
          <h2>Atendimento termina e você ainda<br />não orientou o home care.</h2>
          <p>
            A paciente vai embora com a pele tratada e a dúvida intacta. Você manda áudio no
            WhatsApp depois, ou improvisa um print no celular. Resultado: paciente não aplica
            direito, não fideliza, não compra produto.
          </p>
          <ul className="problema-list">
            <li>Você passa horas no Canva tentando montar PDF de orientação.</li>
            <li>Cada paciente recebe uma versão diferente — não tem padrão.</li>
            <li>Você esquece de enviar e a paciente esquece de fazer.</li>
            <li>Sem orientação escrita, a paciente atribui falta de resultado a você.</li>
            <li>Não consegue cobrar mais por home care porque não tem material profissional.</li>
          </ul>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="solucao">
        <div className="container">
          <div className="solucao-header">
            <div className="eyebrow">A solução</div>
            <h2>Um guia editável.<br />Sua marca. Pronto pra entregar.</h2>
            <p>
              Modelo profissional já estruturado. Você abre no Canva, troca o logo, ajusta as
              recomendações pra paciente, salva em PDF e envia. Em 5 minutos.
            </p>
          </div>
          <div className="solucao-grid">
            <div className="solucao-img" aria-label="Preview das páginas do guia" />
            <div className="solucao-text">
              <h3>O que tem dentro</h3>
              <p>
                Um guia profissional com orientações de skincare e home care segmentadas por tipo e
                estado de pele. Você adapta pra cada paciente em minutos, não em horas.
              </p>
              <ul className="solucao-features">
                <li>Recomendação de skincare por tipo de pele (oleosa, seca, mista, sensível)</li>
                <li>Rotina de cuidados manhã e noite, passo a passo</li>
                <li>Orientações específicas por estado da pele (acne, manchas, envelhecimento)</li>
                <li>Espaço editável pra você inserir produtos da sua escolha</li>
                <li>Identidade visual neutra e elegante — adapta com a sua marca</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE INCLUI */}
      <section className="inclui section-dark">
        <div className="container">
          <div className="eyebrow">O que você leva</div>
          <h2>Tudo que precisa pra começar amanhã.</h2>
          <p className="inclui-sub" style={{ color: 'rgba(236,232,225,0.75)' }}>
            Não é só um arquivo. É um sistema pronto.
          </p>
          <div className="inclui-grid">
            <div className="inclui-item">
              <div className="num">01</div>
              <h3>Template editável no Canva</h3>
              <p>Acesse, duplique, edite. Sem precisar de designer, sem precisar saber Photoshop.</p>
            </div>
            <div className="inclui-item">
              <div className="num">02</div>
              <h3>Versões por tipo de pele</h3>
              <p>Modelos prontos pra oleosa, seca, mista e sensível. Cobre 90% dos seus atendimentos.</p>
            </div>
            <div className="inclui-item">
              <div className="num">03</div>
              <h3>Páginas modulares</h3>
              <p>Use só o que faz sentido pra cada paciente. Personalização rápida, sem retrabalho.</p>
            </div>
            <div className="inclui-item">
              <div className="num">04</div>
              <h3>Identidade visual neutra</h3>
              <p>Estética sóbria que combina com a sua marca. Você adapta cor, fonte, logo.</p>
            </div>
            <div className="inclui-item">
              <div className="num">05</div>
              <h3>Acesso imediato</h3>
              <p>Comprou, recebeu o link. Em 10 minutos você tá editando o primeiro guia.</p>
            </div>
            <div className="inclui-item">
              <div className="num">06</div>
              <h3>Atualizações inclusas</h3>
              <p>Toda atualização do guia entra no seu acesso, sem custo adicional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="roi">
        <div className="container">
          <div className="roi-card">
            <div className="eyebrow">Faz a conta com a gente</div>
            <h2>Quanto custa NÃO ter esse guia?</h2>
            <div className="roi-math">
              <div className="item">
                <div className="label">Tempo gasto</div>
                <div className="num">2h</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(236,232,225,0.5)', marginTop: '8px' }}>
                  por guia improvisado no Canva
                </div>
              </div>
              <div className="equals">×</div>
              <div className="item">
                <div className="label">Pacientes/mês</div>
                <div className="num">15</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(236,232,225,0.5)', marginTop: '8px' }}>
                  média conservadora
                </div>
              </div>
            </div>
            <p>
              = 30 horas por mês fazendo PDF no celular em vez de atender, descansar ou produzir
              conteúdo.
            </p>
            <p style={{ marginTop: '32px', fontSize: '1.125rem', color: 'var(--bg)' }}>
              O guia se paga na primeira paciente que receber.
            </p>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="sobre">
        <div className="container-sm">
          <div className="sobre-img" aria-label="Duda Bambil" />
          <div className="eyebrow">Quem assina</div>
          <h3>Duda Bambil</h3>
          <p>
            Esteticista, especialista em gerenciamento de pele. Esse guia é o mesmo que eu uso no
            meu consultório, com as alunas que comprei e as pacientes que atendo. Foi testado,
            ajustado e aprovado em centenas de atendimentos antes de virar produto.
          </p>
        </div>
      </section>

      {/* OFERTA */}
      <section className="oferta section-alt" id="oferta">
        <div className="container">
          <div className="oferta-card">
            <div className="eyebrow">Adquira agora</div>
            <h2>Guia Editável de Skincare</h2>
            <p style={{ maxWidth: '480px', margin: '16px auto 0' }}>
              Acesso imediato. Edite no Canva. Entregue pra paciente em 5 minutos.
            </p>
            <ul className="oferta-includes">
              <li>Template editável completo no Canva</li>
              <li>4 versões por tipo de pele</li>
              <li>Orientações por estado da pele</li>
              <li>Páginas modulares pra personalização rápida</li>
              <li>Acesso imediato + atualizações inclusas</li>
            </ul>
            <div className="oferta-preco">
              <div className="label">Investimento único</div>
              <div className="strike">De R$97</div>
              <div className="valor"><sup>R$</sup>47</div>
              <div className="obs">Pagamento único · Acesso imediato</div>
            </div>
            <a href={CHECKOUT_URL} className="cta">Quero meu acesso agora</a>
            <p className="garantia-mini">
              Garantia de 7 dias. Acesse, teste no próximo atendimento, e se não fizer sentido —
              devolvo seu dinheiro.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container-sm">
          <div className="eyebrow" style={{ textAlign: 'center' }}>Dúvidas rápidas</div>
          <h2>Antes de você comprar.</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Eu preciso saber mexer no Canva?</h3>
              <p>
                Saber o básico já é o suficiente. O template já vem montado — você só troca logo,
                cores e os produtos que recomenda. Nada mais que isso.
              </p>
            </div>
            <div className="faq-item">
              <h3>O Canva é pago?</h3>
              <p>
                Não pra esse uso. A versão gratuita do Canva edita o template e exporta em PDF sem
                nenhuma limitação relevante. Se você quiser recursos extras, tem o plano pago — mas
                não é obrigatório.
              </p>
            </div>
            <div className="faq-item">
              <h3>Posso usar pra mais de uma paciente?</h3>
              <p>
                Sim. Você duplica o template quantas vezes quiser e personaliza pra cada paciente.
                Uso ilimitado dentro do seu consultório.
              </p>
            </div>
            <div className="faq-item">
              <h3>Funciona pra qualquer tipo de pele?</h3>
              <p>
                O guia cobre os 4 tipos principais (oleosa, seca, mista, sensível) com orientações
                específicas por estado de pele. Atende a maioria absoluta dos atendimentos de uma
                esteticista.
              </p>
            </div>
            <div className="faq-item">
              <h3>Como recebo o acesso?</h3>
              <p>
                Comprou, recebe na hora o link por e-mail. Em 5 minutos você tá com o template
                aberto no Canva.
              </p>
            </div>
            <div className="faq-item">
              <h3>Tem garantia?</h3>
              <p>
                7 dias. Acesse, teste no próximo atendimento, e se não fizer sentido — me chama no
                WhatsApp e devolvo 100% do valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final">
        <div className="container-sm">
          <h2>R$47 hoje.<br />Ou mais 30 horas no Canva esse mês.</h2>
          <p>
            Você decide se quer continuar fazendo material no improviso ou começar a entregar
            atendimento profissional desde a próxima paciente.
          </p>
          <a href={CHECKOUT_URL} className="cta cta-light">Quero meu guia agora</a>
          <p className="meta">Acesso imediato · Garantia de 7 dias · Atualizações inclusas</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <a href="#" className="logo">Duda Bambil</a>
          <p>
            Gerenciamento de Pele ·{' '}
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
