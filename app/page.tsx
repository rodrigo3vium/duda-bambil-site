// TODO: substituir os placeholders abaixo pelos links/URLs reais.
const LINKS = {
  // WhatsApp para agendamento de avaliação (paciente)
  whatsappAgendamento: "#", // TODO: WHATSAPP_AGENDAMENTO
  // Página da Imersão Wonderskin
  wonderskin: "#", // TODO: WONDERSKIN_LINK
  // Página do Curso de Gerenciamento de Pele
  curso: "/gerenciamento-de-pele",
  // Página do Guia Editável de Skincare
  guia: "/guia-skin-care",
  // WhatsApp de contato geral
  whatsapp: "#", // TODO: WHATSAPP_LINK
  instagram: "https://instagram.com/dudabambill",
};

export default function Home() {
  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <a href="#" className="logo">
              Duda<span className="dot">·</span>Bambil
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              Onde saúde e beleza se completam em equilíbrio.
            </div>
            <h1>
              Gerenciamento
              <br />
              de Pele <em>com método.</em>
            </h1>
            <p className="hero-lead">
              Esteticista, especialista em gerenciamento de pele. Atendo
              pacientes e ensino profissionais.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="produtos">
        <div className="container">
          <div className="produtos-header">
            <div className="eyebrow">Como posso te ajudar</div>
            <h2>Escolha o seu caminho.</h2>
          </div>

          <div className="cards-grid">
            <a href={LINKS.whatsappAgendamento} className="card">
              <div>
                <div className="card-eyebrow">Para você, paciente</div>
                <h3>Gerenciamento de Pele</h3>
                <p className="card-promise">
                  Tratamento personalizado com diagnóstico, skincare assertivo e
                  plano estruturado.
                </p>
              </div>
              <span className="card-arrow">Agendar avaliação</span>
            </a>

            <a href={LINKS.wonderskin} className="card">
              <div>
                <div className="card-eyebrow">Para você, profissional</div>
                <h3>Imersão Wonderskin</h3>
                <p className="card-promise">
                  Um dia de bastidores no meu consultório aplicando gerenciamento
                  de pele na prática.
                </p>
              </div>
              <span className="card-arrow">Saber mais</span>
            </a>

            <a href={LINKS.curso} className="card">
              <div>
                <div className="card-eyebrow">Para você, profissional</div>
                <h3>Curso de Gerenciamento de Pele</h3>
                <p className="card-promise">
                  Curso online com aulas de marketing, gestão, HOF, como montar
                  planos de tratamento e aumentar o seu faturamento.
                </p>
              </div>
              <span className="card-arrow">Ver curso</span>
            </a>

            <a href={LINKS.guia} className="card">
              <div>
                <div className="card-eyebrow">Para você, profissional</div>
                <h3>Guia Editável de Skincare</h3>
                <p className="card-promise">
                  Material editável no Canva pra você prescrever home care com a
                  sua marca.
                </p>
              </div>
              <span className="card-arrow">Ver detalhes</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section className="contato">
        <div className="container">
          <div className="eyebrow">Vamos conversar</div>
          <h2>Não sabe qual caminho é o seu?</h2>
          <p>Me chama. Eu mesma respondo.</p>

          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="contato-link"
          >
            @dudabambill
          </a>
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="contato-link"
          >
            WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p className="footer-meta">
            © 2026 Duda Bambil — Gerenciamento de Pele.
          </p>
        </div>
      </footer>
    </>
  );
}
