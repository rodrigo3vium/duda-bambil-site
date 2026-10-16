/**
 * Normalização de WhatsApp para E.164. Usado só pra FEEDBACK de validação no
 * client (a fonte da verdade é o backend, quando existir). Mantém a mesma regra
 * dos outros forms do site.
 */

export type NormalizationError =
  | "empty"
  | "scientific_notation"
  | "too_short"
  | "too_long";

export type NormalizationResult =
  | { ok: true; e164: string }
  | { ok: false; reason: NormalizationError };

const E164_MIN_DIGITS = 10;
const E164_MAX_DIGITS = 15;
const BR_LANDLINE_LENGTH = 10;
const BR_MOBILE_LENGTH = 11;

export function normalizeWhatsapp(
  input: string | null | undefined,
): NormalizationResult {
  if (input == null) return { ok: false, reason: "empty" };

  const trimmed = input.trim();
  if (trimmed.length === 0) return { ok: false, reason: "empty" };

  // Excel transforma número longo em notação científica (ex.: "9,71971E+15").
  if (/\d[eE][+-]?\d/.test(trimmed)) {
    return { ok: false, reason: "scientific_notation" };
  }

  // Detecta formato "CC NÚMERO" antes de tirar os não-dígitos.
  const ccSpaceMatch = trimmed.match(/^(\d{1,3})\s[\d\s\-()+]+$/);
  if (ccSpaceMatch) {
    const ccStr = ccSpaceMatch[1]!;
    const allDigits = trimmed.replace(/\D/g, "");
    const isSingleDigitCC = ccStr.length === 1;
    const isThreeDigitCC = ccStr.length === 3;
    const isTwoDigitCC = ccStr.length === 2 && allDigits.length > 11;
    if (isSingleDigitCC || isThreeDigitCC || isTwoDigitCC) {
      if (allDigits.length < E164_MIN_DIGITS) return { ok: false, reason: "too_short" };
      if (allDigits.length > E164_MAX_DIGITS) return { ok: false, reason: "too_long" };
      return { ok: true, e164: `+${allDigits}` };
    }
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 0) return { ok: false, reason: "empty" };
  if (digits.length < E164_MIN_DIGITS) return { ok: false, reason: "too_short" };
  if (digits.length > E164_MAX_DIGITS) return { ok: false, reason: "too_long" };

  // 10 ou 11 dígitos sem código de país → assume Brasil.
  if (digits.length === BR_LANDLINE_LENGTH || digits.length === BR_MOBILE_LENGTH) {
    return { ok: true, e164: `+55${digits}` };
  }

  // Já tem código de país; só prefixa +.
  return { ok: true, e164: `+${digits}` };
}
