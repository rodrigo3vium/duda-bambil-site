"use client";

/**
 * Formulário de aplicação da mentoria — 3 telas, estado preservado entre elas.
 *
 * Não existe classificação: toda aplicação preenchida é enviada igual e a
 * triagem é feita pela equipe. Por isso a finalização é uma só, para todo mundo.
 *
 * ⚠️ COPY PLACEHOLDER neste arquivo: o disclaimer do rodapé do form. A
 * mensagem de finalização é copy definitiva da Duda. Marcados com [COPY].
 */

import { useEffect, useRef, useState } from "react";
import { useUTMParams } from "@/hooks/useUTMParams";
import {
  ATUACAO_OPCOES,
  FATURAMENTO_OPCOES,
  INVESTIMENTO_OPCOES,
  MOTIVO_MIN,
  PRONTIDAO_OPCOES,
  TELAS,
  TRAVAMENTO_OPCOES,
  VALORES_INICIAIS,
  mascararWhatsapp,
  normalizarInstagram,
  validarCampos,
  type Aplicacao,
  type Campo,
  type Erros,
  type Opcao,
} from "./aplicacao";
import styles from "./styles.module.css";

export default function AplicacaoForm() {
  const [tela, setTela] = useState(0);
  const [valores, setValores] = useState<Aplicacao>(VALORES_INICIAIS);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const utm = useUTMParams({ storage: "session", key: "mentoria_utm" });

  const blocoRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLParagraphElement>(null);
  const camposRef = useRef<Partial<Record<Campo, HTMLElement | null>>>({});
  const inicioRef = useRef(0);
  const enviandoRef = useRef(false);
  const focarPrimeiroErro = useRef(false);
  const montado = useRef(false);

  // Marca o início do preenchimento no client (evita mismatch de hidratação).
  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  // Ao trocar de tela, anuncia a mudança movendo o foco pro rótulo da etapa.
  // Vive num effect (e não num requestAnimationFrame solto no handler) pra
  // acontecer no commit do React — um rAF atrasado roubaria o foco de quem já
  // começou a digitar no primeiro campo da tela nova.
  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    tituloRef.current?.focus();
  }, [tela]);

  // Depois de renderizar os erros, joga o foco no primeiro campo inválido.
  useEffect(() => {
    if (!focarPrimeiroErro.current) return;
    focarPrimeiroErro.current = false;
    const primeiro = TELAS[tela].campos.find((campo) => erros[campo]);
    if (primeiro) camposRef.current[primeiro]?.focus();
  }, [erros, tela]);

  function registrar(campo: Campo) {
    return (el: HTMLElement | null) => {
      camposRef.current[campo] = el;
    };
  }

  function definir(campo: Campo, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
    setErros((e) => (e[campo] ? { ...e, [campo]: undefined } : e));
  }

  function rolarParaTopoDoBloco() {
    blocoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function telaValida(): boolean {
    const encontrados = validarCampos(TELAS[tela].campos, valores);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      focarPrimeiroErro.current = true;
      return false;
    }
    return true;
  }

  function avancar() {
    if (!telaValida()) return;
    setErros({});
    setTela((t) => t + 1);
    rolarParaTopoDoBloco();
  }

  function voltar() {
    setErros({});
    setTela((t) => Math.max(0, t - 1));
    rolarParaTopoDoBloco();
  }

  async function enviar() {
    if (!telaValida()) return;
    if (enviandoRef.current) return; // trava duplo clique síncrono
    enviandoRef.current = true;
    setEnviando(true);
    setErroEnvio(null);

    try {
      const res = await fetch("/api/mentoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...valores,
          empresa: honeypot,
          tempoPreenchimentoMs: inicioRef.current
            ? Date.now() - inicioRef.current
            : 0,
          utm,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });

      const dados = (await res.json().catch(() => null)) as { ok?: boolean } | null;

      if (!res.ok || !dados?.ok) {
        setErroEnvio(
          "Não conseguimos enviar sua aplicação agora. Tente de novo em instantes.",
        );
        return;
      }

      setEnviado(true);
      rolarParaTopoDoBloco();
    } catch {
      setErroEnvio(
        "Sua conexão caiu no meio do envio. Confira a internet e tente de novo.",
      );
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tela < TELAS.length - 1) avancar();
    else void enviar();
  }

  /**
   * Renderiza UM campo. É um switch explícito, não um gerador a partir de
   * schema: cada pergunta tem label, placeholder e ajuda próprios, escritos à
   * mão. Cada tela mostra exatamente um destes.
   */
  function renderCampo(campo: Campo) {
    switch (campo) {
      case "nome":
        return (
          <CampoTexto
            campo="nome"
            label="Seu nome"
            placeholder="Como você prefere ser chamada"
            autoComplete="name"
            valor={valores.nome}
            erro={erros.nome}
            onChange={(v) => definir("nome", v)}
            inputRef={registrar("nome")}
          />
        );
      case "whatsapp":
        return (
          <CampoTexto
            campo="whatsapp"
            label="WhatsApp"
            placeholder="(00) 00000-0000"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            valor={valores.whatsapp}
            erro={erros.whatsapp}
            onChange={(v) => definir("whatsapp", mascararWhatsapp(v))}
            inputRef={registrar("whatsapp")}
          />
        );
      case "instagram":
        return (
          <CampoTexto
            campo="instagram"
            label="Instagram"
            placeholder="@seuperfil"
            autoComplete="off"
            ajuda="Pode colar o link do perfil — a gente extrai o @."
            valor={valores.instagram}
            erro={erros.instagram}
            onChange={(v) => definir("instagram", v)}
            onBlur={() => definir("instagram", normalizarInstagram(valores.instagram))}
            inputRef={registrar("instagram")}
          />
        );
      case "atuacao":
        return (
          <GrupoRadio
            campo="atuacao"
            legenda="Como você atende hoje?"
            opcoes={ATUACAO_OPCOES}
            valor={valores.atuacao}
            erro={erros.atuacao}
            onChange={(v) => definir("atuacao", v)}
            primeiroRef={registrar("atuacao")}
          />
        );
      case "faturamento":
        return (
          <GrupoRadio
            campo="faturamento"
            legenda="Qual seu faturamento mensal com estética?"
            opcoes={FATURAMENTO_OPCOES}
            valor={valores.faturamento}
            erro={erros.faturamento}
            onChange={(v) => definir("faturamento", v)}
            primeiroRef={registrar("faturamento")}
          />
        );
      case "travamento":
        return (
          <GrupoRadio
            campo="travamento"
            legenda="O que mais te trava hoje?"
            opcoes={TRAVAMENTO_OPCOES}
            valor={valores.travamento}
            erro={erros.travamento}
            onChange={(v) => definir("travamento", v)}
            primeiroRef={registrar("travamento")}
          />
        );
      case "investimento_previo":
        return (
          <GrupoRadio
            campo="investimento_previo"
            legenda="Quanto você já investiu na sua formação ou no seu negócio?"
            opcoes={INVESTIMENTO_OPCOES}
            valor={valores.investimento_previo}
            erro={erros.investimento_previo}
            onChange={(v) => definir("investimento_previo", v)}
            primeiroRef={registrar("investimento_previo")}
          />
        );
      case "prontidao":
        return (
          <GrupoRadio
            campo="prontidao"
            legenda="Você está pronta para começar?"
            opcoes={PRONTIDAO_OPCOES}
            valor={valores.prontidao}
            erro={erros.prontidao}
            onChange={(v) => definir("prontidao", v)}
            primeiroRef={registrar("prontidao")}
          />
        );
      case "motivo":
        return (
          <CampoMotivo
            valor={valores.motivo}
            erro={erros.motivo}
            onChange={(v) => definir("motivo", v)}
            inputRef={registrar("motivo")}
          />
        );
    }
  }

  if (enviado) {
    return (
      <div className={styles.formBloco} ref={blocoRef}>
        <div className={styles.resultado} role="status" aria-live="polite">
          <div className={styles.resultadoSelo}>✓</div>
          <h3>Recebemos seus dados.</h3>
          <p>
            Uma pessoa da minha equipe vai entrar em contato para agendar uma
            call contigo.
          </p>
        </div>
      </div>
    );
  }

  const ultima = tela === TELAS.length - 1;
  const progresso = ((tela + 1) / TELAS.length) * 100;

  return (
    <div className={styles.formBloco} ref={blocoRef}>
      {/* Progresso */}
      <div className={styles.progressoWrap}>
        <div className={styles.progressoTopo}>
          <p className={styles.progressoTexto} ref={tituloRef} tabIndex={-1}>
            Etapa {tela + 1} de {TELAS.length} — {TELAS[tela].titulo}
          </p>
        </div>
        <div
          className={styles.progressoTrilha}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TELAS.length}
          aria-valuenow={tela + 1}
          aria-valuetext={`Etapa ${tela + 1} de ${TELAS.length}: ${TELAS[tela].titulo}`}
        >
          <div className={styles.progressoBarra} style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {/* Honeypot — invisível pra gente, irresistível pra bot. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="empresa">Empresa</label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {TELAS[tela].campos.map((campo) => (
          <div key={campo}>{renderCampo(campo)}</div>
        ))}

        {erroEnvio && (
          <p className={styles.erroEnvio} role="alert">
            {erroEnvio}
          </p>
        )}

        <div className={styles.formAcoes}>
          {tela > 0 && (
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={voltar}
              disabled={enviando}
            >
              Voltar
            </button>
          )}
          <button type="submit" className={styles.botaoPrimario} disabled={enviando}>
            {ultima ? (enviando ? "Enviando..." : "Enviar aplicação") : "Continuar"}
          </button>
        </div>

        {/* [COPY] disclaimer do rodapé do formulário */}
        <p className={styles.formDisclaimer}>
          Suas respostas são lidas por uma pessoa. Sem spam, sem lista.
        </p>
      </form>
    </div>
  );
}

/* ─── Campos ───────────────────────────────────────────────────────────── */

interface CampoTextoProps {
  campo: Campo;
  label: string;
  placeholder?: string;
  ajuda?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  autoComplete?: string;
  valor: string;
  erro?: string;
  onChange: (valor: string) => void;
  onBlur?: () => void;
  inputRef: (el: HTMLElement | null) => void;
}

function CampoTexto({
  campo,
  label,
  placeholder,
  ajuda,
  type = "text",
  inputMode,
  autoComplete,
  valor,
  erro,
  onChange,
  onBlur,
  inputRef,
}: CampoTextoProps) {
  const idErro = `${campo}-erro`;
  const idAjuda = `${campo}-ajuda`;
  const describedBy = [erro ? idErro : null, ajuda ? idAjuda : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.campo}>
      <label className={styles.label} htmlFor={campo}>
        {label}
      </label>
      <input
        id={campo}
        name={campo}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`${styles.input}${erro ? ` ${styles.inputErro}` : ""}`}
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={erro ? true : undefined}
        aria-describedby={describedBy || undefined}
        ref={inputRef}
      />
      {ajuda && (
        <p className={styles.ajuda} id={idAjuda}>
          {ajuda}
        </p>
      )}
      {erro && (
        <p className={styles.erro} id={idErro}>
          {erro}
        </p>
      )}
    </div>
  );
}

interface GrupoRadioProps {
  campo: Campo;
  legenda: string;
  opcoes: Opcao[];
  valor: string;
  erro?: string;
  onChange: (valor: string) => void;
  primeiroRef: (el: HTMLElement | null) => void;
}

function GrupoRadio({
  campo,
  legenda,
  opcoes,
  valor,
  erro,
  onChange,
  primeiroRef,
}: GrupoRadioProps) {
  const idErro = `${campo}-erro`;

  return (
    <fieldset
      className={styles.campo}
      aria-invalid={erro ? true : undefined}
      aria-describedby={erro ? idErro : undefined}
    >
      <legend className={styles.legenda}>{legenda}</legend>
      <div className={`${styles.opcoes}${erro ? ` ${styles.opcoesErro}` : ""}`}>
        {opcoes.map((opcao, i) => (
          <label
            key={opcao.value}
            className={`${styles.opcao}${valor === opcao.value ? ` ${styles.opcaoAtiva}` : ""}`}
          >
            <input
              type="radio"
              name={campo}
              value={opcao.value}
              checked={valor === opcao.value}
              onChange={() => onChange(opcao.value)}
              ref={i === 0 ? primeiroRef : undefined}
            />
            <span>{opcao.label}</span>
          </label>
        ))}
      </div>
      {erro && (
        <p className={styles.erro} id={idErro}>
          {erro}
        </p>
      )}
    </fieldset>
  );
}

interface CampoMotivoProps {
  valor: string;
  erro?: string;
  onChange: (valor: string) => void;
  inputRef: (el: HTMLElement | null) => void;
}

function CampoMotivo({ valor, erro, onChange, inputRef }: CampoMotivoProps) {
  const restam = Math.max(0, MOTIVO_MIN - valor.trim().length);

  return (
    <div className={styles.campo}>
      <label className={styles.label} htmlFor="motivo">
        Por que agora?
      </label>
      <textarea
        id="motivo"
        name="motivo"
        rows={4}
        className={`${styles.input} ${styles.textarea}${erro ? ` ${styles.inputErro}` : ""}`}
        placeholder="O que mudou pra você decidir que é agora?"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={`motivo-contador${erro ? " motivo-erro" : ""}`}
        ref={inputRef}
      />
      <p className={styles.contador} id="motivo-contador">
        {restam > 0
          ? `Faltam ${restam} caractere${restam > 1 ? "s" : ""} (mínimo ${MOTIVO_MIN}).`
          : `${valor.trim().length} caracteres.`}
      </p>
      {erro && (
        <p className={styles.erro} id="motivo-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
