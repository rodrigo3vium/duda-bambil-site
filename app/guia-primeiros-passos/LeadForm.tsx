'use client';

import { useState } from 'react';
import styles from './styles.module.css';

const EBOOK_URL = 'https://www.canva.com/design/DAHK3nPuh9U/BnsDbLnAqj5Bx-CbcJsWxA/edit';
const WEBHOOK_URL = 'WEBHOOK_URL';

type FormValues = { nome: string; whatsapp: string; email: string };
type FormErrors = { nome: boolean; whatsapp: boolean; email: boolean };

function maskWhatsapp(raw: string): string {
  let v = raw.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length <= 2) return v.length ? `(${v}` : '';
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  const split = v.length === 11 ? 7 : 6;
  return `(${v.slice(0, 2)}) ${v.slice(2, split)}-${v.slice(split)}`;
}

export default function LeadForm() {
  const [values, setValues] = useState<FormValues>({ nome: '', whatsapp: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({ nome: false, whatsapp: false, email: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const next: FormErrors = { nome: false, whatsapp: false, email: false };

    if (!values.nome.trim() || values.nome.trim().length < 2) next.nome = true;

    const digits = values.whatsapp.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) next.whatsapp = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = true;

    setErrors(next);
    return !next.nome && !next.whatsapp && !next.email;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      nome: values.nome.trim(),
      whatsapp: values.whatsapp.replace(/\D/g, ''),
      email: values.email.trim().toLowerCase(),
      origem: 'lp-guia-primeiros-passos',
      timestamp: new Date().toISOString(),
    };

    try {
      if (WEBHOOK_URL && WEBHOOK_URL !== 'WEBHOOK_URL') {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.warn('Falha ao registrar lead, prosseguindo com download:', err);
    }

    setSuccess(true);

    setTimeout(() => {
      window.open(EBOOK_URL, '_blank');
    }, 1200);
  }

  if (success) {
    return (
      <div className={styles.formSuccess}>
        <div className={styles.formSuccessIcon}>✓</div>
        <h3>Tudo pronto!</h3>
        <p>Seu guia está sendo aberto agora. Salve no celular ou imprima — é seu.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="nome">
          Seu nome
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          className={`${styles.formInput}${errors.nome ? ` ${styles.inputError}` : ''}`}
          placeholder="Como você prefere ser chamada"
          value={values.nome}
          onChange={(e) => setValues((v) => ({ ...v, nome: e.target.value }))}
        />
        {errors.nome && <div className={styles.formError}>Por favor, informe seu nome.</div>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="whatsapp">
          WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          className={`${styles.formInput}${errors.whatsapp ? ` ${styles.inputError}` : ''}`}
          placeholder="(00) 00000-0000"
          value={values.whatsapp}
          onChange={(e) => setValues((v) => ({ ...v, whatsapp: maskWhatsapp(e.target.value) }))}
        />
        {errors.whatsapp && (
          <div className={styles.formError}>Informe um WhatsApp válido com DDD.</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="email">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`${styles.formInput}${errors.email ? ` ${styles.inputError}` : ''}`}
          placeholder="seu@email.com"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
        {errors.email && (
          <div className={styles.formError}>Informe um e-mail válido.</div>
        )}
      </div>

      <button type="submit" className={styles.formSubmit} disabled={loading}>
        {loading ? 'Enviando...' : 'Quero meu guia gratuito'}
      </button>

      <p className={styles.formDisclaimer}>Seus dados estão protegidos. Sem spam.</p>
    </form>
  );
}
