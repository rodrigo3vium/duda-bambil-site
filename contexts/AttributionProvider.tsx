"use client";

/**
 * AttributionProvider — inicializa a atribuição UMA vez, no topo da árvore.
 *
 * Montado em app/layout.tsx, ele cobre TODAS as rotas do site: qualquer página
 * que receba a pessoa (LP de curso, guia, /comece, /mentoria, home) captura a
 * origem no primeiro render, sem que a página precise saber disso.
 *
 * A lógica de verdade mora em lib/attribution.ts (store de módulo). O provider
 * só dispara o init e reexpõe o snapshot pra UI — assim `buildCheckoutUrl` e os
 * submits leem a mesma fonte de forma síncrona, fora do React.
 */

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import {
  ensureAttributionInitialized,
  getAttribution,
  getServerAttribution,
  initAttribution,
  subscribeAttribution,
  utmBagFromAttribution,
  type Attribution,
  type UtmBag,
} from "@/lib/attribution";

const AttributionContext = createContext<Attribution | null>(null);

export const AttributionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const atribuicao = useSyncExternalStore(
    subscribeAttribution,
    getAttribution,
    getServerAttribution,
  );

  // Captura no client, depois da hidratação: ler window/localStorage no render
  // causaria mismatch de hidratação.
  useEffect(() => {
    initAttribution();
  }, []);

  return (
    <AttributionContext.Provider value={atribuicao}>
      {children}
    </AttributionContext.Provider>
  );
};

/**
 * Atribuição vigente. Funciona dentro do provider (caso normal) e também fora
 * dele — um componente isolado num teste não pode quebrar por falta de wrapper,
 * e formulário do site nunca deve depender de uma árvore específica.
 */
export const useAttribution = (): Attribution => {
  const doContexto = useContext(AttributionContext);
  const doStore = useSyncExternalStore(
    subscribeAttribution,
    getAttribution,
    getServerAttribution,
  );

  useEffect(() => {
    if (!doContexto) ensureAttributionInitialized();
  }, [doContexto]);

  return doContexto ?? doStore;
};

/** Atalho: só os 5 utm_* do last_touch, no formato que as rotas já aceitam. */
export const useUtmBag = (): UtmBag => utmBagFromAttribution(useAttribution());
