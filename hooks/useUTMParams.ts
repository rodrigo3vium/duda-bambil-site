/**
 * @deprecated Substituído pelo AttributionProvider (contexts/AttributionProvider.tsx)
 * + lib/attribution.ts. Nenhuma página do site usa mais este hook.
 *
 * O arquivo só continua aqui como ponte: se algum código antigo ainda importar
 * `useUTMParams`, ele lê a MESMA fonte global — nunca um segundo storage
 * paralelo, que foi exatamente o problema que a refatoração resolveu.
 *
 * ⚠️ As opções `storage` e `key` do hook antigo NÃO são mais respeitadas: a
 * atribuição vive numa chave só (`attribution`, localStorage). O conteúdo das
 * chaves antigas (`utm_params`, `mentoria_utm`) foi migrado, não descartado.
 *
 * Pode ser removido assim que o Rodrigo confirmar — nada mais o importa.
 */

import { useAttribution } from "@/contexts/AttributionProvider";
import { utmBagFromAttribution, type UtmBag } from "@/lib/attribution";

export type UTMParams = UtmBag;

/** @deprecated use `useAttribution()` (ou `useUtmBag()`). */
export const useUTMParams = (): UTMParams =>
  utmBagFromAttribution(useAttribution());
